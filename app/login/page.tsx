"use client";

import React, { useState } from "react";
import { EnvelopeSimple, LockKey } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import logo from "../../public/logo.svg";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, firestore } from "../firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc } from "@firebase/firestore";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface Users {
  email: string;
  password: string;
}
const validationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Can’t be empty"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Please check again"),
});

const Login: React.FC<{}> = () => {
  const initialValues: Users = { email: "", password: "" };
  const router = useRouter();

  const handleLogin = async (
    values: { email: string; password: string },
    { setSubmitting, setErrors }: any
  ) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        values.email,
        values.password
      );
      const user = userCredential.user;

      if (user.emailVerified) {
        const regData = localStorage.getItem("regData");
        const { email = "" } = regData ? JSON.parse(regData) : {};

        console.log(email);

        const userDoc = await getDoc(doc(firestore, "users", user.uid));
        if (!userDoc.exists()) {
          await setDoc(doc(firestore, "users", user.uid), {
            email: user.email,
          });
        }
        router.push("/dashboard");
      } else {
        setErrors({ general: "Please verify your email before you log in" });
      }
    } catch (error) {
      if (error instanceof Error) {
        let errorMessage =
          "An unexpected error occurred. Please try again later.";

        switch (error.message) {
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
          case "Firebase: Error (auth/invalid-password).":
            errorMessage = "Invalid password. Enter a valid password.";
            break;
          default:
            break;
        }
        console.log(error);
        setErrors({ general: errorMessage });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-[51px]">
      <div className="header">
        <Image src={logo} alt="DevLink Logo" />
      </div>
      <div className="formBox bg-grey-100 p-10 rounded-xl">
        <div className="flex flex-col gap-10">
          <div className="top-form">
            <h1 className="text-[2rem] font-bold">Login</h1>
            <p className="text-grey-400">
              Add your details below to get back into the app
            </p>
          </div>
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
          >
            {({ isSubmitting, errors, touched }: any) => (
              <Form>
                <div className="inputBox">
                  <label
                    htmlFor="email"
                    className={`label ${
                      touched.email && errors.email
                        ? "text-accent"
                        : "text-grey-400"
                    }`}
                  >
                    Email address
                  </label>
                  <div
                    className={`inputGroup ${
                      touched.email && errors.email
                        ? "border-accent"
                        : "border-grey-300"
                    }`}
                  >
                    <span>
                      <EnvelopeSimple weight="fill" className="text-grey-400" />
                    </span>
                    <Field
                      type="email"
                      name="email"
                      placeholder="e.g. alex@email.com"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>
                <div className="inputBox">
                  <label
                    htmlFor="password"
                    className={`label ${
                      touched.password && errors.email
                        ? "text-accent"
                        : "text-grey-400"
                    }`}
                  >
                    Password
                  </label>
                  <div
                    className={`inputGroup ${
                      touched.password && errors.password
                        ? "border-red-500"
                        : "border-grey-300"
                    }`}
                  >
                    <span>
                      <LockKey weight="fill" className="text-grey-400" />
                    </span>
                    <Field
                      type="password"
                      name="password"
                      placeholder="Enter your password"
                    />{" "}
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                </div>
                {errors.general && (
                  <p className="bg-primary_light px-2 text-danger">
                    {errors.general}
                  </p>
                )}
                <button
                  type="submit"
                  className="auth-btn"
                  disabled={isSubmitting}
                >
                  Login
                </button>
                <div className="flex text-center justify-center">
                  <p>
                    Don’t have an account?{" "}
                    <Link className="text-primary-dark" href="/register">
                      Create account
                    </Link>
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Login;
