import React from "react";
import Image from "next/image";
function Institute() {
  return (
    <div className="flex flex-row items-center">
      <div className="mr-2">
        <Image width={40} height={40} src="/myinstitution.svg" alt="" />
      </div>
      <div className="flex flex-col">
        <div className="text-black text-base font-bold">My Institute</div>

        <div className="flex flex-row text-xs text-black gap-1">
          <div>My Class</div>
          <div> | </div>
          <div>Home</div>
        </div>
      </div>
    </div>
  );
}

export default Institute;
