import React from "react";
import Image from "next/image";



const Logo = () => {
  return (
    <div className="hidden md:flex items-center gap-x-2  ">
      <Image
        src={"/file.svg"}
        className="dark:hidden"
        height={40}
        width={40}
        alt="logo"
      />
      <Image
        src={"/file.svg"}
        className="hidden dark:block"
        height={40}
        width={40}
        alt="logo"
      />

    </div>
  );
};

export default Logo;
