import React from "react";
import { NavLink } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-black text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Xaymaca</h1>
      <nav>
        <ul className="flex gap-4">
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "text-green-500 font-bold" : "hover:text-gray-400"
              }
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                isActive ? "text-green-500 font-bold" : "hover:text-gray-400"
              }
            >
              About
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/staking"
              className={({ isActive }) =>
                isActive ? "text-green-500 font-bold" : "hover:text-gray-400"
              }
            >
              Staking
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
