import { useEffect, useState } from "react";

const useRestaurantMenu = (resId) => {
  const [result, setResult] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchMenuData = async () => {
      try {
        const response = await fetch(
          `https://www.swiggy.com/dapi/menu/pl?page-type=REGULAR_MENU&complete-menu=true&lat=12.89149481573474&lng=77.57124938204382&restaurantId=${encodeURIComponent(resId)}&catalog_qa=undefined&submitAction=ENTER`,
          { signal: controller.signal },
        );

        if (response.headers.get("x-amzn-waf-action") === "challenge") {
          throw new Error("Swiggy requires a browser security check.");
        }
        if (!response.ok) {
          throw new Error(`Swiggy returned HTTP ${response.status}.`);
        }
        if (
          !response.headers.get("content-type")?.includes("application/json")
        ) {
          throw new Error(
            `Swiggy did not return menu JSON (HTTP ${response.status}).`,
          );
        }

        const body = await response.json();
        if (!Array.isArray(body?.data?.cards)) {
          throw new Error("Swiggy's response did not contain a menu.");
        }
        if (!controller.signal.aborted) {
          setResult({ resId, menuData: body.data });
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setResult({ resId, requestError: error.message });
        }
      }
    };

    fetchMenuData();
    return () => controller.abort();
  }, [resId]);

  return result?.resId === resId ? result : {};
};

export default useRestaurantMenu;
