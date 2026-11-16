import React, { useState } from "react";
import { PromotedRestaurantCard } from "./RestaurantCard";
import { restaurantDetails } from "../utils/mockData";
import useOnlineStatus from "../utils/useOnlineStatus";

export const Body = () => {
  const [filteredRestaurants, setFilteredRestaurants] =
    useState(restaurantDetails);
  const [searchText, setSearchText] = useState("");
  const onlineStatus = useOnlineStatus();

  if (onlineStatus === false)
    return (
      <h1>
        Looks like you are offline. Please check your internet connection.
      </h1>
    );

  return (
    <div className="body">
      <div className="flex flex-wrap">
        <div className="search m-4 p-4">
          <input
            className="border border-solid border-black p-2 dark:border-zinc-600 dark:bg-zinc-900 dark:placeholder:text-zinc-400"
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button
            className="px-4 py-2 m-4 bg-green-100 rounded-lg dark:bg-emerald-950 dark:text-emerald-100"
            onClick={() => {
              const query = searchText.trim().toLowerCase();
              const filteredRestaurants = restaurantDetails.filter(
                (restaurant) =>
                  restaurant.info.name.toLowerCase().includes(query),
              );
              setFilteredRestaurants(filteredRestaurants);
            }}
          >
            Search
          </button>
        </div>
        <div className="search m-4 p-4 flex items-center">
          <button
            className="px-4 py-2 bg-gray-100 rounded-lg dark:bg-zinc-800"
            onClick={() => {
              const filteredRestaurants = restaurantDetails.filter(
                (restaurant) => restaurant.info.avgRating > 4.5,
              );
              setFilteredRestaurants(filteredRestaurants);
            }}
          >
            Top Rated Restaurants
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-start">
        {filteredRestaurants.map((restaurant) => (
          <PromotedRestaurantCard
            key={restaurant.info.id}
            restaurant={restaurant}
          />
        ))}
      </div>
    </div>
  );
};
