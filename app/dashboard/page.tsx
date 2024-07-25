"use client";
import { onAuthStateChanged, User, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { auth, firestore } from "../firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Link from "next/link";
import Header from "../../components/Header";
import Preview from "@/components/preview";
import Image from "next/image";
import startImg from "../../public/start-image.svg";

const HomePage = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        if (user.emailVerified) {
          const userDoc = await getDoc(doc(firestore, "users", user.uid));
          if (!userDoc.exists()) {
            const regData = localStorage.getItem("regData");
            const { email = "" } = regData ? JSON.parse(regData) : {};
            console.log(email);

            if (email) {
              await setDoc(doc(firestore, "users", user.uid), {
                email: user.email,
              });
              localStorage.removeItem("regData");
            }
          }

          setUser(user);
          router.push("/dashboard");
        } else {
          setUser(null);
          router.push("/register");
        }
      } else {
        setUser(null);
        router.push("/register");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (loading) {
    return <p>Loading.. </p>;
  }

  return (
    <div>
      {user ? (
        <>
          <Header />
          <div className="flex gap-6 ">
            <Preview />
            <div className=" flex justify-between bg-grey-100 rounded-lg w-full flex-col">
              <div className="flex flex-col gap-5 p-10  h-full">
                <div className="flex flex-col gap-10 h-1/3 ">
                  <div className=" flex flex-col gap-2">
                    <h1 className="text-[2rem] font-bold text-grey-500">
                      Customize your links
                    </h1>
                    <p className="text-grey-400">
                      Add, edit, or remove links below and share your profiles
                      with the world!
                    </p>
                  </div>
                  <button
                    // onClick={handleAddLink}
                    className="btn border border-primary-dark text-primary-dark w-full font-semibold"
                  >
                    + Add new link
                  </button>
                </div>
                <div className="w-full flex flex-col gap-10 items-center justify-center p-5 bg-grey-200 rounded-xl">
                  <Image src={startImg} alt="" />
                  <div className="flex flex-col gap-6 items-center ">
                    <p className="font-bold text-[2rem]  ">
                      Let’s get you started
                    </p>
                    <p className="text-center px-40  w-full text-[#888888] ">
                      Use the “Add new link” button to get started. Once you
                      have more than one link, you can reorder and edit them.
                      We’re here to help you share your profiles with everyone!
                    </p>
                  </div>
                </div>
              </div>
              <div className=" flex justify-end py-6 px-10 border-t border-t-[#d9d9d9]">
                <button
                  type="button"
                  className="btn bg-primary-dark opacity-25 text-grey-100 py-2 px-4 rounded hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
              {/* <div className="flex flex-col">
            <p>Welcome, {user.email}!</p>
            <Link href="/dashboard/profile">Profile</Link>
            <Link href="/dashboard/links">Links</Link>
            <button onClick={handleLogout}>Logout</button>
          </div> */}
            </div>
          </div>
        </>
      ) : (
        <p>Redirecting to Sign in page...</p>
      )}
    </div>
  );
};

export default HomePage;
