import React from "react";

const FeatureRow = ({ value }: { value: string }) => {
  return (
    <div className="text-center mb-4">
      <p className="text-base">{value}</p>
    </div>
  );
};

export default FeatureRow;
