import React from "react";

const Hero = () => {
  return (
    <section className="h-screen bg-black text-white flex flex-col justify-center items-center">
      <div className="relative w-48 h-48">
        <div className="absolute inset-0 border-4 border-gray-300 rounded-full animate-spin"></div>
        <h1 className="absolute inset-0 flex items-center justify-center text-4xl font-bold">
          Xaymaca
        </h1>
      </div>
      <p className="mt-6 text-xl">Land of Wood and Water</p>
      <div className="mt-8">
        <button className="bg-green-500 px-6 py-3 mx-2 rounded hover:bg-green-700">
          Stake Now
        </button>
        <button className="bg-yellow-500 px-6 py-3 mx-2 rounded hover:bg-yellow-700">
          Explore Tokenomics
        </button>
      </div>
    </section>
  );
};

export default Hero;
