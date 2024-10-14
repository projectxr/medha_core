import React from "react";
import Institute from "./Institute";
import Personal from "./Personal";
function Navbar() {
  return (
    <div>
      <div className=" flex flex-row justify-between">
        <Institute />
        <Personal />
      </div>
    </div>
  );
}

export default Navbar;
