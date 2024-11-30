import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-black text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Xaymaca</h1>
      <nav>
        <ul className="flex gap-4">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/staking">Staking</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
