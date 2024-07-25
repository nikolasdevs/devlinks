import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "../public/logo.svg";
import { UserCircle } from "@phosphor-icons/react/dist/ssr";
import { Link as LinkSimple } from "@phosphor-icons/react/dist/ssr";
import { signOut } from "firebase/auth";

const Header = () => {
  
  return (
    <div className=" p-6">
      <div className="flex justify-between w-full items-center rounded-lg bg-grey-100 py-4 pr-4 pl-6 ">
        <Image src={logo} alt="Devlinks logo" />

        <div className=" flex items-center gap-4">
          {" "}
          <Link
            className="btn link-btn flex items-center gap-2 font-semibold"
            href="/dashboard/links"
          >
            {" "}
            <span>
              <LinkSimple weight="bold" />
            </span>{" "}
            Links
          </Link>
          <Link
            href="/dashboard/profile"
            className="font-semibold flex items-center btn gap-2"
          >
            <span>
              <UserCircle weight="bold" />
            </span>
            Profile Details
          </Link>
        </div>
        <Link
          className="btn border-primary-dark border text-primary-dark font-semibold"
          href="/dashboard/preview"
        >
          Preview
        </Link>
      </div>{" "}
    </div>
  );
};

export default Header;
