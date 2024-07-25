"use client";
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { fetchUserProfile } from "../links/linkService";
import Image from "next/image";
import LinksPreview from "@/components/LinkPreview";


const ProfilePreview: React.FC = () => {
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      fetchUserProfile(user.uid).then((data) => {
        setProfileData(data);
      });
    }
  }, []);

  if (!profileData) {
    return <div>Loading...</div>;

  }

  return (
    <>
      <div className="bg-primary-dark max-w-[1440px] m-auto h-[357px] rounded-b-[2rem] flex flex-col items-center">
        <div className="w-full bg-primary-dark p-6">
          <div className="flex items-center justify-between py-4 pr-4 pl-6 rounded-xl bg-grey-100">
            <button className="btn border border-primary-dark text-primary-dark">
              Back to Editor
            </button>
            <button className="btn bg-primary-dark text-grey-100">
              Share Link
            </button>
          </div>
        </div>
        <div className="w-[380px] text-center rounded-3xl px-14 py-12 h-[569px] bg-grey-100 previewBox mt-32">
          <div className="flex flex-col items-center justify-center gap-[25px]">
            <div className="w-[104px] h-[104px] rounded-full bg-grey-400">
              {profileData.imagePreview ? (
                <Image
                  src={profileData.profileImage}
                  alt="Profile picture"
                  className="w-full h-full object-cover rounded-xl"
                  width={193}
                  height={193}
                />
              ) : (
                <p>No image uploaded</p>
              )}
            </div>
            <div className="flex flex-col gap-2 items-center justify-center">
              <div className="text-[2rem] font-bold text-grey-500">
                {profileData.firstName} {profileData.lastName}
              </div>
              <div className="text-grey-400">{profileData.email}</div>
            </div>
            <LinksPreview />
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePreview;
