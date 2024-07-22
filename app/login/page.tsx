import React from "react";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { LockKey } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import logo from "../../public/logo.svg";
import Link from "next/link";

const Login = () => {
  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen gap-[51px]">
        <div className="header">
          <Image src={logo} alt="DevLink Logo" />
        </div>
        <div className="formBox bg-grey-100 p-10">
          <div className="flex flex-col gap-10">
            <div className="top-form">
              <h1 className="text-[2rem] font-bold">Login</h1>
              <p className=" text-grey-400">
                Add your details below to get back into the app
              </p>
            </div>
            <form action="">
              <div className="inputBox ">
                <label htmlFor="email">Email address</label>
                <div className="inputGroup">
                  {" "}
                  <span>
                    {" "}
                    <EnvelopeSimple weight="fill" className="text-grey-400" />
                  </span>
                  <input type="email" placeholder="e.g. alex@email.com" />{" "}
                </div>
              </div>
              <div className="inputBox ">
                <label htmlFor="password">Password</label>
                <div className="inputGroup">
                  {" "}
                  <span>
                    {" "}
                    <LockKey weight="fill" className="text-grey-400" />
                  </span>
                  <input type="email" placeholder="Enter your password" />{" "}
                </div>
              </div>
              <button className="auth-btn">Login</button>
              <div className="flex text-center justify-center">
                <p>
                  {" "}
                  Don’t have an account?{" "}
                  <Link className="text-primary-dark" href="/register">Create account</Link>{" "}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
