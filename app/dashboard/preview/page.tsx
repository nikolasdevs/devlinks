"use client";
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { fetchUserProfile } from "../links/linkService";
import Image from "next/image";
import { useLinksStore } from "@/lib/store";
import {
  GithubLogo,
  LinkedinLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string;
}

export interface Link {
  id: string;
  platform: string;
  link: string;
}

const ProfilePreview: React.FC = () => {
  const [profileData, setProfileData] = useState<Profile | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      fetchUserProfile(user.uid)
        .then((data) => {
          setProfileData(data);
        })
        .catch((error) => {
          console.error("Failed to fetch profile:", error);
        });
    }
  }, []);

  if (!profileData) {
    return <div>Loading...</div>;
  }

  const LinksPreview: React.FC = () => {
    const { links, fetchLinks } = useLinksStore();
    const [fetchedLinks, setFetchedLinks] = useState<Link[]>([]);

    useEffect(() => {
      const loadLinks = async () => {
        try {
          const fLinks = await fetchLinks();
          setFetchedLinks(fLinks);
        } catch (error) {
          console.error("Failed to fetch links:", error);
        }
      };
      loadLinks();
    }, [fetchLinks]);

    return (
      <ul className="flex flex-col gap-5">
        {fetchedLinks.map((link) => (
          <li
            key={link.id}
            className={`flex items-center gap-4 p-4 rounded-lg ${
              link.platform === "github"
                ? "bg-[#1a1a1a]"
                : link.platform === "youtube"
                ? "bg-[#EE3939]"
                : link.platform === "linkedin"
                ? "bg-[#2D68FF]"
                : "bg-grey-200"
            }`}
          >
            {link.platform === "github" && (
              <GithubLogo weight="fill" color="white" width={24} height={24} />
            )}
            {link.platform === "youtube" && (
              <YoutubeLogo weight="fill" color="white" width={24} height={24} />
            )}
            {link.platform === "linkedin" && (
              <LinkedinLogo
                weight="fill"
                color="white"
                width={24}
                height={24}
              />
            )}
            <div className="flex flex-col">
              <p className="text-white font-semibold">{link.platform}</p>
              <a href={link.link} className="text-grey-100">
                {link.link}
              </a>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-primary-dark max-w-[1440] m-auto h-[357px] rounded-b-[2rem]">
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
      <div className="w-[380px] text-center rounded-3xl px-14 py-12 h-[569px] bg-grey-100 previewBox">
        <div className="flex flex-col items-center justify-center gap-[25px]">
          <div className="w-[104px] h-[104px] rounded-full bg-grey-400">
            {profileData.profileImage ? (
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
          <div className="flex flex-col gap-2 items-center justify-center ">
            <div className="text-[2rem] font-bold text-grey-500">
              {profileData.firstName} {profileData.lastName}
            </div>
            <div className="text-grey-400">{profileData.email}</div>
          </div>
          <LinksPreview />
        </div>
      </div>
    </div>
  );
};

export default ProfilePreview;
