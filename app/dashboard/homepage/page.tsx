// "use client";
// import { onAuthStateChanged, User, signOut } from "firebase/auth";
// import { useRouter } from "next/navigation";
// import React, { useEffect, useState } from "react";
// import { auth, firestore } from "../../firebase/config";
// import { doc, getDoc, setDoc } from "firebase/firestore";

// const HomePage = () => {
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState<User | null>(null);
//   const router = useRouter();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         if (user.emailVerified) {
//           const userDoc = await getDoc(doc(firestore, "users", user.uid));
//           if (!userDoc.exists()) {
//             const regData = localStorage.getItem("regData");
//             const { email = "" } = regData ? JSON.parse(regData) : {};
//             console.log(email);

//             if (email) {
//               await setDoc(doc(firestore, "users", user.uid), {
//                 email: user.email,
//               });
//               localStorage.removeItem("regData");
//             }
//           }

//           setUser(user);
//           router.push("/dashboard");
//         } else {
//           setUser(null);
//           router.push("/register");
//         }
//       } else {
//         setUser(null);
//         router.push("/register");
//       }
//       setLoading(false);
//     });
//     return () => unsubscribe();
//   }, [router]);

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       setUser(null);
//       router.push("/login");
//     } catch (error) {
//       console.error("Error signing out: ", error);
//     }
//   };

//   if (loading) {
//     return <p>Loading.. </p>;
//   }

//   return (
//     <div>
//       {user ? (
//         <div>
//           <p>Welcome, {user.email}!</p>
//           <button onClick={handleLogout}>Logout</button>
//         </div>
//       ) : (
//         <p>Redirecting to Sign in page...</p>
//       )}
//     </div>
//   );
// };

// export default HomePage;
import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page