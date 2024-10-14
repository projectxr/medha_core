import React from "react";

const PricingHeader = ({
  plan,
  price,
  period,
}: {
  plan: string;
  price: string;
  period: string;
}) => {
  return (
    <div className="text-center">
      <h3 className="text-xl font-bold mb-2">{plan}</h3>
      <p className="text-3xl font-extrabold mt-2">{price}</p>
      {period && <p className="text-sm mt-1">{period}</p>}
    </div>
  );
};

export default PricingHeader;
