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

export const fetchLinks = async () => {
  try {
    const linkCollection = collection(firestore, "links");
    const querySnapshot = await getDocs(
      query(linkCollection, orderBy("platform"))
    );
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error fetching links: ", error);
    return [];
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

export const updateLink = async (
  id: string,
  platform: string,
  siteLink: string
) => {
  try {
    const linkRef = doc(firestore, "links", id);
    await updateDoc(linkRef, { platform, link: siteLink });
    return true;
  } catch (error) {
    console.error("Error updating link: ", error);
    return false;
  }
};
// linkService.ts

export const updateProfile = async (
  userId: string,
  firstName: string,
  lastName: string,
  email: string,
  profileImage: File | null
): Promise<{
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
}> => {
  const userDocRef = doc(firestore, "users", userId);

  let imageUrl = "";

  if (profileImage) {
    const imageRef = ref(storage, `profileImages/${userId}`);
    await uploadBytes(imageRef, profileImage);
    imageUrl = await getDownloadURL(imageRef);
  }

  await updateDoc(userDocRef, {
    firstName,
    lastName,
    email,
    profileImage: imageUrl,
  });

  return { firstName, lastName, email, profileImage: imageUrl };
};


  export const fetchUserProfile = async (userId: string) => {
    try {
      const userDoc = doc(firestore, "users", userId);
      const userSnapshot = await getDoc(userDoc);
      if (userSnapshot.exists()) {
        return userSnapshot.data();
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching profile: ", error);
      return null;
    }
  };