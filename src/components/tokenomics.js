import React from "react";

const Tokenomics = () => {
  return (
    <section className="bg-black text-white py-12 px-6">
      <h2 className="text-3xl font-bold text-center mb-8">Tokenomics</h2>
      <div className="flex flex-col items-center">
        <p>Total Supply: 300M XAY</p>
        <div className="w-64 h-64 mt-6">
          {/* Placeholder for interactive pie chart */}
          <div className="w-full h-full bg-green-500 rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Tokenomics;
