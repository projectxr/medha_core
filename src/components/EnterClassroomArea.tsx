import React from "react";
import Image from "next/image";
function EnterClassroomArea() {
  return (
    <div className="bg-white bg-opacity-60 p-6 rounded-3xl h-[242px]">
      <div className="flex flex-col mb-4">
        <div className="text-lg font-bold">Personalise Medha</div>
      </div>
      <div className="p-4 mt-8 bg-white rounded-xl h-[121px]">
        <div className="grid grid-cols-1 gap-4">
          <form className="flex flex-col space-y-2">
            <label htmlFor="classroom-id" className="font-bold text-sm">
              Upload a PDF of Book
            </label>
            <div className="flex items-center space-x-2">
              {/* <input
                id="classroom-id"
                type="file"
                className="flex-grow  p-2 rounded text-sm "
                placeholder="Classroom ID"
              /> */}
              <button
                type="button"
                className= "flex gap-1 align-middle justify-center items-center border-gray-200 hover:border-black border-2 w-[130px] p-2 rounded-full"
              >
                 <Image width={16} height={16} alt="" src="/Folder.svg" />
                Select File
              </button>
              <select className="border-gray-200 hover:border-black border-2 w-[98px] p-2 rounded-full" name="Subject" id="">
                <option value="subject" disabled>Subject</option>
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="science">Science</option>
              </select>
              <button
                type="submit"
                className="text-white w-[98px] p-2 bg-[#5D233C] rounded-full"
              >
                Connect
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
}

export default EnterClassroomArea;
