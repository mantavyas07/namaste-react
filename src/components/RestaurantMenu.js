import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IMG_CDN_URL, MENU_IMG_CDN_URL } from "../utils/constants";
import { restaurantDetails, restaurantsMenu } from "../utils/mockData";

const getSavedMenu = (resId) => {
  const { cards } = restaurantsMenu.data;
  const info = cards
    .map((entry) => entry.card?.card?.info)
    .find((info) => String(info?.id) === resId);
  if (!info) return null;

  const regularMenu = cards.find(
    (entry) => entry.groupedCard?.cardGroupMap?.REGULAR,
  )?.groupedCard.cardGroupMap.REGULAR;
  const itemCards = (regularMenu?.cards ?? []).flatMap(({ card }) => {
    const category = card?.card;
    return (
      category?.itemCards ??
      (category?.categories ?? []).flatMap((section) => section.itemCards ?? [])
    );
  });
  const itemsById = new Map(
    itemCards.map(({ card: { info } }) => [info.id, info]),
  );
  return { info, menuItems: Array.from(itemsById.values()) };
};

const getDishDiet = ({ isVeg, itemAttribute }) => {
  const classifier = itemAttribute?.vegClassifier;
  if (classifier === "VEG" || isVeg === 1) return "veg";
  if (classifier === "NONVEG" || classifier === "EGG" || isVeg === 0) {
    return "non-veg";
  }
  return null;
};

const DietMarker = ({ diet }) => (
  <span
    aria-hidden="true"
    className={`inline-grid size-4 shrink-0 place-items-center rounded-[3px] border ${diet === "veg" ? "text-emerald-700 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}
  >
    {diet === "veg" ? (
      <span className="size-2 rounded-full bg-current" />
    ) : (
      <span className="text-[10px] leading-none">▲</span>
    )}
  </span>
);

const filters = [
  { id: "veg", label: "Veg", diet: "veg" },
  { id: "non-veg", label: "Non-veg", diet: "non-veg" },
  { id: "bestseller", label: "Bestseller" },
];

const MenuItems = ({ items }) => {
  const [query, setQuery] = useState("");
  const [diet, setDiet] = useState(null);
  const [bestsellersOnly, setBestsellersOnly] = useState(false);
  const searchTerm = query.trim().toLowerCase();
  const visibleItems = items.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm) &&
      (!diet || getDishDiet(item) === diet) &&
      (!bestsellersOnly || item.isBestseller),
  );

  return (
    <>
      <div className="relative">
        <input
          aria-label="Search for dishes"
          className="h-12 w-full rounded-xl bg-zinc-100 px-4 pr-11 text-sm text-zinc-900 outline-none placeholder:text-center placeholder:font-medium placeholder:text-zinc-600 focus-visible:ring-2 focus-visible:ring-orange-500 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:focus-visible:ring-orange-400"
          placeholder="Search for dishes"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-5 size-3.5 -translate-y-1/2 rounded-full border-2 border-zinc-500 after:absolute after:-right-1.5 after:-bottom-0.5 after:h-0.5 after:w-1.5 after:rotate-45 after:rounded-full after:bg-zinc-500 dark:border-zinc-400 dark:after:bg-zinc-400"
        />
      </div>

      <div
        role="group"
        aria-label="Filter dishes"
        className="mt-4 flex flex-wrap gap-2"
      >
        {filters.map((filter) => {
          const selected = filter.diet ? diet === filter.diet : bestsellersOnly;
          const colors = selected
            ? "border-orange-600 bg-orange-50 text-orange-800 dark:border-orange-400 dark:bg-orange-950 dark:text-orange-200"
            : "border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800";
          return (
            <button
              key={filter.id}
              type="button"
              aria-pressed={selected}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-3 py-2 text-sm leading-none font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600 dark:focus-visible:outline-orange-400 ${colors}`}
              onClick={() => {
                if (filter.diet) {
                  setDiet(selected ? null : filter.diet);
                } else {
                  setBestsellersOnly(!bestsellersOnly);
                }
              }}
            >
              {filter.diet && <DietMarker diet={filter.diet} />}
              {filter.label}
            </button>
          );
        })}
      </div>

      <h2 className="mt-7 border-b border-zinc-200 pb-3 text-xl font-bold dark:border-zinc-800">
        Menu
      </h2>
      {visibleItems.length > 0 ? (
        <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
          {visibleItems.map((item) => {
            const {
              id,
              name,
              price,
              defaultPrice,
              description,
              imageId,
              isBestseller,
            } = item;
            const priceInPaise = price ?? defaultPrice;
            const itemDiet = getDishDiet(item);

            return (
              <li key={id} className="flex justify-between gap-4 py-5">
                <div>
                  {(itemDiet || isBestseller) && (
                    <div className="mb-2 flex items-center gap-2 text-xs font-medium text-orange-700 dark:text-orange-300">
                      {itemDiet && (
                        <>
                          <DietMarker diet={itemDiet} />
                          <span className="sr-only">
                            {itemDiet === "veg" ? "Veg" : "Non-veg"}
                          </span>
                        </>
                      )}
                      {isBestseller && <span>Bestseller</span>}
                    </div>
                  )}
                  <h3 className="font-semibold">{name}</h3>
                  {priceInPaise != null && (
                    <p className="text-sm">₹{priceInPaise / 100}</p>
                  )}
                  {description && (
                    <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                      {description}
                    </p>
                  )}
                </div>
                {imageId && (
                  <img
                    className="size-20 shrink-0 rounded-xl object-cover"
                    src={`${IMG_CDN_URL}${imageId}`}
                    alt=""
                    loading="lazy"
                    width={80}
                    height={80}
                  />
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p
          role="status"
          className="py-5 text-sm text-zinc-600 dark:text-zinc-400"
        >
          {items.length > 0
            ? "No dishes match your search or filters."
            : "No menu items available."}
        </p>
      )}
    </>
  );
};

export const RestaurantMenu = () => {
  const { resId } = useParams();
  const sample = restaurantDetails.find(({ info }) => info.id === resId);
  const menu = sample ?? getSavedMenu(resId);
  if (!menu) {
    return (
      <p role="alert" className="mx-auto max-w-212 px-4 py-8">
        Restaurant details are unavailable.
      </p>
    );
  }

  const {
    name,
    city = "Bangalore",
    cuisines = [],
    locality,
    areaName,
    avgRating,
    avgRatingString,
    totalRatingsString,
    costForTwo,
    costForTwoMessage,
    sla,
    cloudinaryImageId,
  } = menu.info;
  const rating = avgRatingString ?? avgRating;
  const ratingCount = totalRatingsString?.replace(/\s+ratings?$/i, "");
  const priceForTwo = costForTwoMessage ?? costForTwo;
  const outlet = areaName || locality;
  const deliveryTime = sla?.slaString?.toLowerCase();

  return (
    <main className="mx-auto w-full max-w-212 px-4 pt-6 pb-12 sm:px-6">
      <nav
        aria-label="Breadcrumb"
        className="mb-5 text-xs text-zinc-500 sm:px-4 dark:text-zinc-400"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link to="/" className="hover:underline">
              Home
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>{city}</li>
          <li aria-hidden="true">/</li>
          <li
            aria-current="page"
            className="font-semibold text-zinc-800 dark:text-zinc-100"
          >
            {name}
          </li>
        </ol>
      </nav>

      <h1 className="text-[1.75rem] leading-tight font-extrabold tracking-tight sm:px-4 sm:text-3xl">
        {name}
      </h1>
      {cloudinaryImageId && (
        <img
          className="mt-6 aspect-5/2 w-full rounded-[20px] object-cover"
          src={`${MENU_IMG_CDN_URL}${cloudinaryImageId}`}
          alt={name}
          width={900}
          height={400}
        />
      )}

      <div className="mt-5 px-1 sm:px-4">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-bold sm:text-base">
          {rating && (
            <span className="inline-flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="inline-grid size-5 place-items-center rounded-full bg-green-700 text-xs text-white"
              >
                ★
              </span>
              <span>
                <span className="sr-only">Rating</span>
                {rating}
                {ratingCount && ` (${ratingCount} ratings)`}
              </span>
            </span>
          )}
          {rating && priceForTwo && (
            <span className="text-zinc-400" aria-hidden="true">
              ·
            </span>
          )}
          {priceForTwo && <span>{priceForTwo}</span>}
        </div>

        {cuisines.length > 0 && (
          <p className="mt-1.5 text-sm font-semibold text-orange-700 dark:text-orange-300">
            {cuisines.join(", ")}
          </p>
        )}

        {(outlet || deliveryTime) && (
          <div className="mt-4 max-w-xs border-t border-zinc-200 pt-4 dark:border-zinc-800">
            <dl className="ml-1 grid gap-2 border-l border-zinc-300 pl-4 text-sm dark:border-zinc-700">
              {outlet && (
                <div className="relative flex flex-wrap gap-x-3 before:absolute before:top-1/2 before:-left-5 before:size-2 before:-translate-y-1/2 before:rounded-full before:bg-zinc-300 dark:before:bg-zinc-500">
                  <dt className="font-semibold">Outlet</dt>
                  <dd className="text-zinc-600 dark:text-zinc-400">{outlet}</dd>
                </div>
              )}
              {deliveryTime && (
                <div className="relative before:absolute before:top-1/2 before:-left-5 before:size-2 before:-translate-y-1/2 before:rounded-full before:bg-zinc-300 dark:before:bg-zinc-500">
                  <dt className="sr-only">Estimated delivery</dt>
                  <dd className="font-semibold">{deliveryTime}</dd>
                </div>
              )}
            </dl>
          </div>
        )}
      </div>

      <section aria-label="Restaurant menu" className="mt-5 px-1 sm:px-4">
        {sample && (
          <p className="mb-3 rounded-lg bg-linear-to-r from-orange-50 to-rose-50 px-3 py-2.5 text-sm font-medium text-orange-800 dark:from-orange-950/70 dark:to-rose-950/70 dark:text-orange-200">
            Sample dishes and prices
          </p>
        )}
        <MenuItems key={resId} items={menu.menuItems} />
      </section>
    </main>
  );
};
