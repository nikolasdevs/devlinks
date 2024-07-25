"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Image as ImagePng } from "@phosphor-icons/react/dist/ssr";
import Preview from "@/components/preview";
import Header from "@/components/Header";
import { updateProfile, fetchUserProfile } from "../links/linkService";
import { useLinksStore } from "@/lib/store";
import { storage } from "@/app/firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "firebase/auth";
import Image from "next/image";
import { getErrorMessage } from "@/utils/errorHandler";

const Profile: React.FC = () => {
  const { updateProfile: updateProfileStore } = useLinksStore();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [profileImage, setProfileImage] = useState<File | null>(null); // Updated to File | null
  const [imagePreview, setImagePreview] = useState<URL | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      fetchUserProfile(user.uid).then((profileData) => {
        if (profileData) {
          setFirstName(profileData.firstName);
          setLastName(profileData.lastName);
          setEmail(profileData.email);
          setImagePreview(
            profileData.profileImage ? new URL(profileData.profileImage) : null
          );
        }
      });
    }
  }, []);

  const handleProfileSubmit = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        throw new Error("No authenticated user found");
      }
      const userId = user.uid;
      let imageURL = imagePreview ? imagePreview.toString() : "";

      if (profileImage) {
        const imageRef = ref(storage, `images/${profileImage.name + uuidv4()}`);
        const uploadTask = uploadBytesResumable(imageRef, profileImage);
        await new Promise<void>((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            () => {}, // Handle upload progress if needed
            (error) => {
              console.error("Upload failed:", error);
              reject(error);
            },
            async () => {
              try {
                imageURL = await getDownloadURL(uploadTask.snapshot.ref);
                console.log("File available at", imageURL);
                resolve();
              } catch (error) {
                console.error("Failed to get download URL:", error);
                reject(error);
              }
            }
          );
        });
      }

      await updateProfile(userId, firstName, lastName, email, imageURL);
      updateProfileStore(userId, firstName, lastName, email, imageURL);
      setImagePreview(new URL(imageURL));

      console.log("Profile updated successfully");
    } catch (e) {
      const errorMessage = getErrorMessage(e);
      console.error("Update failed:", errorMessage);
      alert("Update failed: " + errorMessage);
    }
  };


  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(new URL(reader.result as string)); // Updated to URL
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Header />
      <div className="flex gap-6">
        <Preview />
        <form
          onSubmit={handleProfileSubmit}
          className="p-10 flex flex-col gap-10 bg-grey-100 h-full w-full rounded-xl"
        >
          <div>
            <h1 className="text-[2rem] font-semibold text-grey-500">
              Profile Details
            </h1>
            <p className="text-grey-400">
              Add your details to create a personal touch to your profile.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <div className="bg-grey-200 p-5 gap-3 rounded-xl w-full">
              <div className="flex items-center justify-between">
                <p className="w-1/3">Profile picture</p>
                <div className="flex items-center gap-6">
                  <div
                    className="flex flex-col justify-center items-center gap-2 w-[193px] h-[193px] bg-primary-light rounded-xl"
                    onClick={() =>
                      document.getElementById("imageInput")?.click()
                    }
                  >
                    {imagePreview ? (
                      <Image
                        src={imagePreview.toString()}
                        alt="Profile picture"
                        className="w-full h-full object-cover rounded-xl"
                        width={193}
                        height={193}
                      />
                    ) : (
                      <>
                        <ImagePng width={40} height={40} color="#633cff" />
                        <p className="font-semibold">+ Upload Image</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    id="imageInput"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <p className="text-xs px-2">
                    Image must be below 1024x1024px.
                    <br /> Use PNG or JPG format.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-grey-200 p-5 gap-3 flex flex-col rounded-xl w-full">
              <div className="flex w-full justify-between items-center">
                <label className="text-grey-400 w-full" htmlFor="firstName">
                  First Name*
                </label>
                <input
                  className="py-3 px-4 border border-grey-300 rounded-lg profileInput"
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. John"
                  required
                />
              </div>
              <div className="flex w-full justify-between items-center">
                <label className="text-grey-400 w-full" htmlFor="lastName">
                  Last Name*
                </label>
                <input
                  className="py-3 px-4 border border-grey-300 rounded-lg profileInput"
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Appleseed"
                  required
                />
              </div>
              <div className="flex w-full justify-between items-center">
                <label className="text-grey-400 w-full" htmlFor="email">
                  Email*
                </label>
                <input
                  className="py-3 px-4 border border-grey-300 rounded-lg profileInput"
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. email@example.com"
                  required
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end py-6 px-10 border-t border-t-[#d9d9d9]">
            <button
              type="submit"
              className="btn bg-primary-dark text-grey-100 py-2 px-4 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Profile;
