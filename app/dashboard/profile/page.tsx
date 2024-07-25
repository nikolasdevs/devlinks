"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { Image as ImagePng } from "@phosphor-icons/react/dist/ssr";
import Preview from "@/components/preview";
import Header from "@/components/Header";
import { useLinksStore } from "@/lib/store";
import { storage } from "@/app/firebase/config";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { getAuth } from "firebase/auth";
import Image from "next/image";

const Profile: React.FC = () => {
  const { updateProfile: updateProfileStore } = useLinksStore();

  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      fetchUserProfile(user.uid).then((profileData) => {
        if (profileData) {
          setFirstName(profileData.firstName);
          setLastName(profileData.lastName);
          setEmail(profileData.email);
          setImagePreview(profileData.profileImage);
        }
      });
    }
  }, []);

  const handleProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const auth = getAuth();
    const user = auth.currentUser;
    const userId = user?.uid;
    if (userId) {
      let imageURL = imagePreview;
      if (profileImage) {
        const imageRef = ref(storage, `images/${profileImage.name}`);
        const uploadTask = uploadBytesResumable(imageRef, profileImage);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
            switch (snapshot.state) {
              case "paused":
                console.log("Upload is paused");
                break;
              case "running":
                console.log("Upload is running");
                break;
            }
          },
          (error) => {
            console.error("Error uploading file:", error);
          },
          async () => {
            imageURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File available at", imageURL);
            // await updateProfile(userId, firstName, lastName, email, imageURL);
            // updateProfileStore(userId, firstName, lastName, email, imageURL);
            setImagePreview(imageURL);
          }
        );
      } else {
        // await updateProfile(userId, firstName, lastName, email, imageURL);
        // updateProfileStore(userId, firstName, lastName, email, imageURL);
      }
    }
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Example function (update according to your backend structure)
  const fetchUserProfile = async (userId: string) => {
    // Replace this with your actual API call or database query
    const response = await fetch(`/api/user/${userId}`);
    const data = await response.json();
    return data;
  };
  const handleUploadClick = () => {
    const inputElement = document.getElementById(
      "imageInput"
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.click();
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
                    onClick={handleUploadClick}
                  >
                    {imagePreview ? (
                      <Image
                        src={imagePreview}
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
