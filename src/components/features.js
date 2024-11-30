import React from "react";

const Features = () => {
  const features = [
    {
      title: "Staking",
      description: "Earn rewards by staking Xaymaca tokens securely.",
    },
    {
      title: "Governance",
      description: "Participate in decision-making through DAO governance.",
    },
    {
      title: "Tokenomics",
      description: "Transparent allocation with burn mechanisms.",
    },
  ];

  return (
    <section className="bg-gray-800 text-white py-12 px-6">
      <h2 className="text-3xl font-bold text-center mb-8">Features</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-gray-700 p-6 rounded shadow hover:bg-gray-600"
          >
            <h3 className="text-xl font-bold">{feature.title}</h3>
            <p className="mt-4">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
