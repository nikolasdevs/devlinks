import Image from "next/image";
import frame1 from "../public/Rectangle1.svg";
import frame2 from "../public/Subtract.svg";

import React from "react";

const Preview = () => {
  return (
    <div className="">
      <div className="left Column w-[560px] h-full bg-grey-100 rounded-xl p-6 relative ">
        <div className="absolute top-20 left-[7rem]">
          <div>
            <Image className=" relative" src={frame1} alt="frame" />
            <Image
              className=" absolute top-3 left-3"
              src={frame2}
              alt="frame"
            />{" "}
          </div>
          <div className="flex  gap-14  flex-col absolute top-16 w-full">
            <div className="relative top-0 flex flex-col gap-[25px] items-center justify-center w-full ">
              <div className="h-24 w-24 bg-[#eeeeee] rounded-full"></div>
              <div className="flex flex-col gap-[13px] items-center">
                <div className="w-40 h-4 bg-[#eee] rounded-[104px]">
              
                </div>
                <div className="w-[72px] h-2 bg-[#eee] rounded-[104px]"></div>
              </div>
            </div>
            <div className="flex flex-col gap-5  px-8 left-0">
              <div className="bg-[#eeeeee] h-[44px] rounded-lg"></div>
              <div className="bg-[#eeeeee] h-[44px] rounded-lg"></div>
              <div className="bg-[#eeeeee] h-[44px] rounded-lg"></div>
              <div className="bg-[#eeeeee] h-[44px] rounded-lg"></div>
              <div className="bg-[#eeeeee] h-[44px] rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Preview;
