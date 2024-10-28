import { Request, Response } from "express";
import Restaurant from "../models/restaurant";

/**
 * Get Restaurant
 * @description This function is used to get a specific restaurant based on the restaurant id.
 */
const getRestaurant = async (req: Request, res: Response) => {
  try {
    // 01. Get the restaurant id from the request
    const { restaurantId } = req.params;

    // 02. Get the restaurant from the database.
    const restaurant = await Restaurant.findById(restaurantId);

    // 03. If the restaurant is not found, return a 404 error.
    if (!restaurant) {
      res.status(404).json({ message: "Restaurant not found" });
      return;
    }

    // 04. Return the restaurant.
    res.status(200).json(restaurant);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * Search Restaurant
 * @description This function is used to search for restaurants based on the given search query for the city, cuisines, and the restaurant name.
 */
const searchRestaurant = async (req: Request, res: Response) => {
  try {
    // 01. Get the search param from the request
    const city = req.params.city;

    // 02. Create a query to search for the restaurants
    let query: any = {};

    // 02.1. Add a query to search for the city
    query["city"] = new RegExp(city, "i"); // Search for a city name even if it contains a space or a comma or a special character.
    const cityCheck = await Restaurant.countDocuments(query);

    if (cityCheck === 0) {
      res.status(404).json({
        data: [],
        pagination: { page: 1, limit: 5, total: 0, pages: 1 },
      });
      return;
    }

    // 02.2. Add a query to search for the cuisines
    const selectedCuisines = (req.query.selectedCuisines as string) || "";
    if (selectedCuisines) {
      // Url: selectedCuisines="italian,mexican" -> ["italian", "mexican"]
      const cuisinesArray = selectedCuisines
        .split(",")
        .map((cuisine) => new RegExp(cuisine, "i")); // Split the string by comma and then convert it to array of RegExp objects.

      query["cuisines"] = { $all: cuisinesArray }; // Match if the restaurant has any of the cuisines in the array.
    }

    // 02.3. Add a query to search for the restaurant name or cuisines
    const searchQuery = (req.query.searchQuery as string) || "";
    if (searchQuery) {
      const searchRegex = new RegExp(searchQuery, "i");

      // This for loop is to match the searchQuery in the restaurant name or cuisines.
      query["$or"] = [
        { restaurantName: searchRegex }, // Match if the restaurant name contains the search query.
        {
          cuisines: { $in: [searchRegex] }, // this is a nested query, it will match if the searchQuery is in the cuisines array.
        },
      ];
    }

    // 02.4. Add a query for pagination (page and limit)
    const page = parseInt(req.query.page as string) || 1;

    const limit = 5;
    const skip = (page - 1) * limit;

    // 02.5. Add a query to sort the restaurants.
    const sortOption = (req.query.sortOption as string) || "lastUpdated";

    // 03. Execute the query to get the restaurants from the database.
    const restaurants = await Restaurant.find(query)
      .sort({ [sortOption]: 1 }) // Sort the restaurants in ascending order based on the sortOption.
      .skip(skip) // Skip the first page (skip) and take the next 5 restaurants (limit)
      .limit(limit) // Take the next 5 restaurants.
      .lean(); // Convert the result to a plain JavaScript object.

    const total = await Restaurant.countDocuments(query);

    // 04. Return the restaurants and the pagination information.
    const response = {
      data: restaurants,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default { searchRestaurant, getRestaurant };
