import React from "react";

const Footer = () => {
  return (
    <footer className="bg-black text-white p-4 text-center">
      <p>&copy; 2024 Xaymaca Cryptocurrency. All rights reserved.</p>
      <div className="mt-2 flex justify-center space-x-4">
        <a href="#" className="hover:text-green-500">
          Twitter
        </a>
        <a href="#" className="hover:text-green-500">
          Discord
        </a>
        <a href="#" className="hover:text-green-500">
          Telegram
        </a>
      </div>
    </footer>
  );
};

export default Footer;
