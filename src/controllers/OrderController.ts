import { Request, Response } from "express";
import Stripe from "stripe";
import Restaurant, { MenuItemType } from "../models/restaurant";
import User from "../models/user";
import Order from "../models/order";

const STRIPE = new Stripe(process.env.STRIPE_API_KEY as string);
const FRONTEND_URL = process.env.FRONTEND_URL as string;
const STRIPE_ENDPOINT_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

/**
 * Get my orders
 * @description This function will get all the orders of the user in the database
 */
const getMyOrders = async (req: Request, res: Response) => {
  try {
    const order = await Order.find({ user: req.userId })
      .populate("restaurant")
      .populate("user");

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error getting customer orders", error });
  }
};

type CheckoutSessionRequest = {
  cartItems: {
    name: string;
    quantity: string;
    menuItemId: string;
  }[];
  deliveryDetails: {
    name: string;
    city: string;
    email: string;
    country: string;
    addressLine1: string;
  };
  restaurantId: string;
};

/**
 * Stripe webhook handler
 * @description This function will handle the stripe webhook and update the order status in the database
 */
const stripeWebhookHandler = async (req: Request, res: Response) => {
  let event;

  // 01. get the stripe signature from the request headers
  try {
    // 01.1 get the stripe signature from the request headers
    const sig = req.headers["stripe-signature"];

    // 01.2 create the webhook endpoint
    event = Stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      STRIPE_ENDPOINT_SECRET
    );
  } catch (error: any) {
    res.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }

  // 02. check the event type
  if (event.type === "checkout.session.completed") {
    // 02.1 Check if the order exists in the database
    const order = await Order.findById(event.data.object.metadata?.orderId);

    if (!order) {
      res.status(400).json({ message: "Order not found" });
      return;
    }

    // 02.2 update the order with the new status
    order.totalAmount = event.data.object.amount_total;
    order.status = "paid";

    // 02.3 save the order in the database
    await order.save();
  }

  // 03. send a response back to stripe
  res.status(200).send();
};

/**
 * Create a checkout session in stripe
 * @description This function will create a checkout session in stripe and create a new order in the database and return the session url
 */
const createCheckoutSession = async (req: Request, res: Response) => {
  try {
    // 01. get the restaurantId from the request body
    const checkoutSessionRequest: CheckoutSessionRequest = req.body;
    // 02. get the restaurant from the database
    const restaurant = await Restaurant.findById(
      checkoutSessionRequest.restaurantId
    );

    if (!restaurant) {
      res.status(400).json({ message: "Restaurant not found" });
      return;
    }

    // 03. create a new order in the database
    const newOrder = new Order({
      restaurant: restaurant,
      user: req.userId,
      status: "placed",
      cartItems: checkoutSessionRequest.cartItems,
      deliveryDetails: checkoutSessionRequest.deliveryDetails,
      createdAt: new Date(),
    });

    // 04. create a lineItems array with the menuItems and the quantity
    const lineItems = createLineItems(
      restaurant.menuItems,
      checkoutSessionRequest
    );

    // 05. create a session in stripe
    const session = await createSession(
      lineItems,
      newOrder._id.toString(),
      restaurant.deliveryPrice,
      restaurant._id.toString()
    );

    if (!session.url) {
      res.status(400).json({ message: "Session not created" });
      return;
    }

    // 06. save the new order in the database
    await newOrder.save();

    // 07. return the session url
    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: "Error creating checkout session", error });
  }
};

/**
 * Create a lineItem
 * @description This function will create a lineItem in stripe and return it as a lineItem object with the price
 */
const createLineItems = (
  menuItems: MenuItemType[],
  checkoutSessionRequest: CheckoutSessionRequest
) =>
  checkoutSessionRequest.cartItems.map((cartItem) => {
    // 01. foreach cartItem, get the menuItem object from the restaurant -> to get the price
    const menuItem = menuItems.find(
      (menuItem) => menuItem._id.toString() === cartItem.menuItemId
    );

    if (!menuItem) throw new Error(`MenuItem not found ${cartItem.menuItemId}`);

    // 02. foreach cartItem, convert it to a stripe line item
    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
      price_data: {
        currency: "gbp",
        unit_amount: menuItem.price,
        product_data: {
          name: menuItem.name,
        },
      },
      quantity: parseInt(cartItem.quantity),
    };

    // 03. return lineItem
    return lineItem;
  });

/**
 * Create a checkout session in stripe
 * @description This function will create a checkout session in stripe and return it as a session object
 */
const createSession = async (
  line_items: Stripe.Checkout.SessionCreateParams.LineItem[],
  orderId: string,
  deliveryPrice: number,
  restaurantId: string
) =>
  await STRIPE.checkout.sessions.create({
    line_items,
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: "Delivery",
          fixed_amount: {
            amount: Math.round(deliveryPrice * 100),
            currency: "gbp",
          },
        },
      },
    ],
    mode: "payment",
    metadata: {
      orderId,
      restaurantId,
    },
    success_url: `${FRONTEND_URL}/order-state?success=true`,
    cancel_url: `${FRONTEND_URL}/detail/${restaurantId}?cancelled=true`,
  });

export default {
  getMyOrders,
  stripeWebhookHandler,
  createCheckoutSession,
};
