import { firestore, storage } from "@/app/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "@firebase/firestore";
import { Link, Profile } from "@/lib/interfaces";

export const addLink = async (platform: string, siteLink: string) => {
  try {
    const docRef = await addDoc(collection(firestore, "links"), {
      platform,
      link: siteLink,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding link: ", error);
    return null;
  }
};

// export const fetchLinks = async () => {
//   try {
//     const linkCollection = collection(firestore, "links");
//     const querySnapshot = await getDocs(
//       query(linkCollection, orderBy("platform"))
//     );
//     return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//   } catch (error) {
//     console.error("Error fetching links: ", error);
//     return [];
//   }
// };

export const fetchLinks = async (): Promise<Link[]> => {
  try {
    const linkCollection = collection(firestore, "links");
    const linkQuery = query(linkCollection, orderBy("platform"));
    const querySnapshot = await getDocs(linkQuery);

    return querySnapshot.docs.map((doc) => ({
      ...(doc.data() as Link), // Ensure the type matches
    }));
  } catch (error) {
    console.error("Error fetching links:", error);
    return []; // Return an empty array in case of error
  }
};

export const updateLink = async (
  id: string,
  platform: string,
  link: string
): Promise<boolean> => {
  // Your logic to update the link
  // Example:
  try {
    // Assume you are using a database or some API to update the link
    // await database.updateLink(id, { platform, link });
    return true; // Return true if update is successful
  } catch (error) {
    console.error("Failed to update link:", error);
    return false; // Return false if update fails
  }
};

export const deleteLink = async (linkId: string) => {
  try {
    await deleteDoc(doc(firestore, "links", linkId));
    return linkId;
  } catch (error) {
    console.error("Error deleting link: ", error);
    return null;
  }
};

// linkService.ts

// export const updateProfile = async (
//   userId: string,
//   firstName: string,
//   lastName: string,
//   email: string,
//   profileImage: File | null
// ): Promise<{
//   firstName: string;
//   lastName: string;
//   email: string;
//   profileImage: string;
// }> => {
//   const userDocRef = doc(firestore, "users", userId);

//   let imageUrl = "";

//   if (profileImage) {
//     const imageRef = ref(storage, `profileImages/${userId}`);
//     await uploadBytes(imageRef, profileImage);
//     imageUrl = await getDownloadURL(imageRef);
//   }

//   await updateDoc(userDocRef, {
//     firstName,
//     lastName,
//     email,
//     profileImage: imageUrl,
//   });

//   return { firstName, lastName, email, profileImage: imageUrl };
// };

export const updateProfile = async (
  userId: string,
  firstName: string,
  lastName: string,
  email: string,
  profileImage: string
): Promise<Profile> => {
  const userDocRef = doc(firestore, "users", userId);
  await updateDoc(userDocRef, {
    firstName,
    lastName,
    email,
    profileImage,
  });
  const updatedProfile: Profile = {
    id: userId,
    firstName,
    lastName,
    email,
    profileImage: profileImage ?? "",
  };

  try {
    const userDoc = doc(firestore, "users", userId);
    await updateDoc(userDoc, {
      firstName,
      lastName,
      email,
      profileImage,
    });
  } catch (error) {
    console.error("Failed to update profile:", error);
    throw new Error("Failed to update profile");
  }
  return updatedProfile;
};
// export const fetchUserProfile = async (userId: string) => {
//   try {
//     const userDoc = doc(firestore, "users", userId);
//     const userSnapshot = await getDoc(userDoc);
//     if (userSnapshot.exists()) {
//       return userSnapshot.data();
//     } else {
//       console.log("No such document!");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error fetching profile: ", error);
//     return null;
//   }
// };

export const fetchUserProfile = async (userId: string): Promise<Profile> => {
  try {
    const userDoc = doc(firestore, "users", userId);
    const userSnap = await getDoc(userDoc);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      return {
        id: userId,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        profileImage: userData.profileImage,
      };
    } else {
      throw new Error("No such user!");
    }
  } catch (error) {
    console.error("Failed to fetch user profile:", error);
    throw new Error("Failed to fetch user profile");
  }
};
