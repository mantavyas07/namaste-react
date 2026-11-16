import { useId } from "react";
import { Link } from "react-router-dom";
import { IMG_CDN_URL } from "../utils/constants";

export const RestaurantCard = ({ restaurant, imageBadge, imageBadgeId }) => {
  const { info } = restaurant;

  const {
    id,
    name,
    cuisines,
    areaName,
    avgRating,
    sla,
    costForTwo,
    cloudinaryImageId,
  } = info;

  return (
    <Link
      to={`/restaurants/${id}`}
      className="m-2.5 w-68 rounded-[10px] bg-[#f0f0f0] p-1.25 shadow-[0_4px_8px_rgba(0,0,0,0.1)]
        outline-2 outline-offset-2 outline-transparent transition-[box-shadow,outline-color] duration-200
        hover:shadow-lg hover:outline-orange-600 focus-visible:outline-orange-600 motion-reduce:transition-none
        dark:bg-zinc-900 dark:shadow-black/40 dark:hover:outline-orange-400 dark:focus-visible:outline-orange-400"
      aria-label={name}
      aria-describedby={imageBadgeId}
    >
      <div className="relative">
        <img
          className="aspect-11/12 w-full rounded-md object-cover"
          src={`${IMG_CDN_URL}${cloudinaryImageId}`}
          alt={name}
        />
        {imageBadge}
      </div>
      <h2 className="mt-3 mb-1 text-lg font-semibold">{name}</h2>
      <h4 className="text-sm text-slate-600 dark:text-zinc-300">
        {cuisines.join(", ")}
      </h4>
      <h4 className="text-sm text-slate-600 dark:text-zinc-300">{areaName}</h4>
      <div className="my-1.5 flex items-center gap-2 text-sm">
        <span>
          <span
            className="text-amber-700 dark:text-amber-400"
            aria-hidden="true"
          >
            ★
          </span>{" "}
          {avgRating}
        </span>
        <span aria-hidden="true">•</span>
        <span>{sla.deliveryTime} mins</span>
      </div>
      <h4 className="text-sm text-slate-600 dark:text-zinc-300">
        {costForTwo}
      </h4>
    </Link>
  );
};

// Higher Order Component (HOC) to add a "Promoted" label to the RestaurantCard component
const withPromotedLabel = (RestaurantCardComponent) => {
  return function WithPromotedLabel(props) {
    const badgeId = useId();
    if (!props.restaurant.info.promoted) {
      return <RestaurantCardComponent {...props} />;
    }

    return (
      <RestaurantCardComponent
        {...props}
        imageBadgeId={badgeId}
        imageBadge={
          <span
            id={badgeId}
            className="absolute top-2 left-2 rounded-md bg-orange-700 px-2 py-1 text-xs font-semibold text-white shadow-sm"
          >
            Promoted
          </span>
        }
      />
    );
  };
};

export const PromotedRestaurantCard = withPromotedLabel(RestaurantCard);
