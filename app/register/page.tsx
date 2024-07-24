/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useState } from "react";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { LockKey } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import logo from "../../public/logo.svg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth } from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState<string | null>("");
  const [error, setError] = useState<string | null>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignup = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await sendEmailVerification(user);

      //TEMPORARILY STORE USER DATA IN LOCAL STORAGE

      localStorage.setItem(
        "redData",
        JSON.stringify({
          // uid: user.uid,
          email,
          password,
        })
      );

      setMessage(
        "Registration Successful. Please check your email for verification!"
      );

      console.log({ user });

      //Clear form fields
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (e) {
      if (e instanceof Error) {
        let errorMessage =
          "An unexpected error occurred. Please try again later.";

        switch (e.message) {
          case "Firebase: Error (auth/network-request-failed).":
            errorMessage =
              "Network error. Please check your internet connection.";
            break;
          case "Firebase: Error (auth/email-already-in-use).":
            errorMessage = "Email already in use. Please try logging in.";
            break;
          case "Firebase: Error (auth/invalid-email).":
            errorMessage = "Invalid email address. Please enter a valid email.";
            break;
          case "Firebase: Error (auth/weak-password).":
            errorMessage = "Weak password. Please enter a stronger password.";
            break;
          default:
            break;
        }
        setError(errorMessage);
      } else {
        setError("Unknown error");
      }
    }
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center h-screen gap-[51px]">
        <div className="header">
          <Image src={logo} alt="DevLink Logo" />
        </div>
        <div className="formBox bg-grey-100 p-10  rounded-xl">
          <div className="flex flex-col gap-10">
            <div className="top-form">
              <h1 className="text-[2rem] font-bold">Create account</h1>
              <p className=" text-grey-400">
                Let's get you started sharing your links!
              </p>
            </div>
            <form action="" onSubmit={handleSignup}>
              <div className="inputBox ">
                <label htmlFor="email">Email address</label>
                <div className="inputGroup">
                  {" "}
                  <span>
                    {" "}
                    <EnvelopeSimple weight="fill" className="text-grey-400" />
                  </span>
                  <input
                    type="email"
                    placeholder="e.g. alex@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />{" "}
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
                  <input
                    type="password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />{" "}
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
                  <input
                    type="password"
                    placeholder="At least 8 characters"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />{" "}
                </div>
              </div>
              <p> Password must contain at least 8 characters</p>
              <button className="auth-btn">Create new account</button>
              <div className="flex text-center justify-center">
                <p>
                  {" "}
                  Already have an account?{" "}
                  <Link className="text-primary-dark" href="/login">
                    Login
                  </Link>{" "}
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
