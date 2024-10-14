import React from "react";
import { features, plans } from "./PricingData";

const PricingTable = () => {
  return (
    <div className="min-h-screen p-8 flex items-center justify-center">
      {/* Outer container for pricing table */}
      <div className="bg-[#EBEBED] rounded-[2rem] p-6 w-full max-w-6xl shadow-lg">
        <table className="w-full table-fixed border-separate border-spacing-x-4 border-spacing-y-0">
          <thead>
            <tr>
              {/* Empty header cell for the label column */}
              <th className="w-1/4 bg-[#EBEBED]"></th>
              {/* Plan headers */}
              {plans.map((plan, index) => (
                <th
                  key={index}
                  className="bg-white text-center rounded-t-lg p-4"
                >
                  <div className="font-bold text-xl">{plan.plan}</div>
                  <div className="text-2xl mt-2">{plan.price}</div>
                  <div className="text-gray-500">{plan.period}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Feature rows */}
            {features.map((feature, index) => (
              <tr key={index}>
                {/* Feature label (first column) */}
                <td
                  className={`bg-[#EBEBED] p-4 text-lg font-semibold text-left
                    ${index === features.length - 1 ? "rounded-bl-lg" : ""}`}
                >
                  {feature.label}
                </td>
                {/* Plan-specific feature values */}
                {feature.values.map((value, i) => (
                  <td
                    key={i}
                    className={`bg-white p-4 text-center border-l border-gray-300
                      ${
                        index === features.length - 1
                          ? i === feature.values.length - 1
                            ? "rounded-b-lg"
                            : "rounded-b-lg"
                          : ""
                      }`}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PricingTable;
