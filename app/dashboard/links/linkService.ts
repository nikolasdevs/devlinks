import { firestore } from "@/app/firebase/config";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
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
