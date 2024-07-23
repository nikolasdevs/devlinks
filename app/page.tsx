"use client";
import { onAuthStateChanged, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { auth, firestore } from "./firebase/config";
import { doc, getDoc, setDoc } from "firebase/firestore";

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
            console.log(email)

            await setDoc(doc(firestore, "users", user.uid), {
              email: user.email,
            });

            localStorage.removeItem("regData");
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

  if (loading) {
    return <p>Loading.. </p>;
  }

  return (
    <div>
      {user ? "Redirecting to Dashboard" : "Redirecting to Sign in page "}
    </div>
  );
};

export default HomePage;
