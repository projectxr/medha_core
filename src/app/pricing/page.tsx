import React from "react";
import Image from "next/image";
import PricingTable from "@/components/pricing/PricingTable";

function PricingPage() {
  return (
    <div>
      <div>
        <div className="space-y-1">
          <h1 className="text-black text-[40px] font-bold">Pricing</h1>
          <div className="text-[#696969] text-[20px]">
            Select the best plan according for your needs
          </div>
        </div>
        <PricingTable />
      </div>
    </div>
  );
}

export default PricingPage;
