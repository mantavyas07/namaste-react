import React, { useState } from "react";
import { IMG_HEADER_URL } from "../utils/constants";
import { Link } from "react-router-dom";
import useOnlineStatus from "../utils/useOnlineStatus";

export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  const onlineStatus = useOnlineStatus();

  const toggleTheme = () => {
    const nextIsDark = !isDark;
    document.documentElement.classList.toggle("dark", nextIsDark);
    setIsDark(nextIsDark);

    try {
      localStorage.setItem("theme", nextIsDark ? "dark" : "light");
    } catch {
      // The theme can still change for the current page.
    }
  };

  return (
    <div className="flex justify-between bg-white shadow-lg dark:bg-zinc-900 dark:shadow-black/40">
      <div className="logo-container">
        <img className="w-32" src={IMG_HEADER_URL} alt="logo" />
      </div>

      <div className="flex items-center">
        <ul className="m-4 flex flex-wrap items-center gap-y-2 p-4">
          <li className="px-4 py-2">
            Online Status: {onlineStatus ? "✅" : "🔴"}
          </li>
          <li className="px-4 py-2">
            <Link to="/">Home</Link>
          </li>
          <li className="px-4 py-2">
            <Link to="/about">About</Link>
          </li>
          <li className="px-4 py-2">
            <Link to="/contact">Contact</Link>
          </li>
          <li className="px-4 py-2">
            <Link to="/grocery">Grocery</Link>
          </li>
          <li className="px-4 py-2">
            <Link to="/cart">Cart</Link>
          </li>
          <li className="ml-4">
            <button
              type="button"
              aria-pressed={isDark}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-zinc-600 dark:bg-zinc-800 dark:hover:bg-zinc-700 dark:focus-visible:outline-blue-400"
              onClick={toggleTheme}
            >
              <span aria-hidden="true">☾</span>
              Dark mode
            </button>
          </li>
          <li className="ml-4">
            <button
              type="button"
              className="min-w-24 cursor-pointer rounded-lg bg-blue-100 px-4 py-2 text-center font-medium transition-colors hover:bg-blue-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-blue-950 dark:text-blue-100 dark:hover:bg-blue-900 dark:focus-visible:outline-blue-400"
              onClick={() => setIsLoggedIn(!isLoggedIn)}
            >
              {isLoggedIn ? "Logout" : "Login"}
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;
