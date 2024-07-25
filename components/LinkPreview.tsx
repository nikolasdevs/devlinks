import React, { useEffect, useState } from "react";
import { useLinksStore } from "@/lib/store";
 // Adjust the import based on your file structure
import {
  GithubLogo,
  LinkedinLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/dist/ssr";
import { Link } from "@/app/dashboard/preview/page";

const LinksPreview: React.FC = () => {
  const { fetchLinks } = useLinksStore();
  const [fetchedLinks, setFetchedLinks] = useState<Link[]>([]);

  useEffect(() => {
    const loadLinks = async () => {
      try {
        const links = await fetchLinks(); // Fetch links from Firestore
        setFetchedLinks(links); // Set state with fetched links
      } catch (error) {
        console.error("Failed to fetch links:", error);
      }
    };
    loadLinks(); // Call async function
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
            <LinkedinLogo weight="fill" color="white" width={24} height={24} />
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

export default LinksPreview;
