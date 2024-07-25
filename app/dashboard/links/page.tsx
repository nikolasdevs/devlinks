"use client";
import { useEffect } from "react";
import { useLinksStore } from "@/lib/store";
import Header from "@/components/Header";
import Image from "next/image";
import dash from "../../../public/dash.svg";
import frame1 from "../../../public/Rectangle1.svg";
import frame2 from "../../../public/Subtract.svg";
import {
  ArrowRight,
  GithubLogo,
  YoutubeLogo,
  LinkedinLogo,
} from "@phosphor-icons/react/dist/ssr";
const Links = () => {
  const {
    links,
    fetchLinks,
    addLink,
    deleteLink,
    updateLink,
    updateLinkLocally,
  } = useLinksStore();

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const handleAddLink = () => {
    addLink("", "");
  };

  const handleSave = async () => {
    for (const link of links) {
      await updateLink(link.id, link.platform, link.link);
    }
    fetchLinks(); // Refresh the list to reflect updates
  };

  return (
    <>
      <Header />
      <div className="pb-6 px-6 h-auto flex gap-6">
        {/* Left Column */}
        <div className="left Column w-[560px] h-screen bg-grey-100 rounded-lg p-6 relative ">
          <div className="absolute top-20 left-20">
            <div>
              <Image className=" relative" src={frame1} alt="frame" />
              <Image
                className=" absolute top-3 left-3"
                src={frame2}
                alt="frame"
              />{" "}
            </div>
            <div className="flex  gap-14  flex-col absolute top-16 w-full">
              <div className="relative top-0 flex flex-col gap-[25px] items-center justify-center w-full ">
                <div className="h-24 w-24 bg-[#eeeeee] rounded-full"></div>
                <div className="flex flex-col gap-[13px] items-center">
                  <div className="w-40 h-4 bg-[#eee] rounded-[104px]"></div>
                  <div className="w-[72px] h-2 bg-[#eee] rounded-[104px]"></div>
                </div>
              </div>
              <div className="flex flex-col gap-5  px-8 left-0">
                <div className="bg-[#eeeeee] h-[44px] rounded-lg"></div>
                <div className="bg-[#eeeeee] h-[44px] rounded-lg"></div>
                <div className="bg-[#eeeeee] h-[44px] rounded-lg"></div>
                <div className="bg-[#eeeeee] h-[44px] rounded-lg"></div>
                <div className="bg-[#eeeeee] h-[44px] rounded-lg"></div>
              </div>
            </div>
            <ul className="absolute top-[280px] w-full px-8 flex flex-col gap-5 ">
              {links.map((link, index) => (
                <li
                  key={link.id}
                  className={
                    link.platform === "github"
                      ? "bg-[#1a1a1a] link"
                      : link.platform === "youtube"
                      ? "bg-[#EE3939]  link"
                      : link.platform === "linkedin"
                      ? "bg-[#2D68FF] link"
                      : ""
                  }
                >
                  <div className=" flex  w-full ">
                    <p className="flex items-center gap-3 text-grey-100 capitalize text-xs justify-between w-full">
                      <div className="flex items-center gap-2">
                        {link.platform === "github" && (
                          <GithubLogo
                            weight="fill"
                            color="white"
                            width={16}
                            height={16}
                          />
                        )}
                        {link.platform === "youtube" && (
                          <YoutubeLogo
                            weight="fill"
                            color="white"
                            width={16}
                            height={16}
                          />
                        )}
                        {link.platform === "linkedin" && (
                          <LinkedinLogo
                            weight="fill"
                            width={16}
                            height={16}
                            color="white"
                          />
                        )}
                        {link.platform}
                      </div>
                      <ArrowRight weight="bold" />
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {/* <button
                    onClick={() => deleteLink(link.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                  >
                    Delete
                  </button> */}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Column */}
        <div className="rightColumn bg-grey-100 rounded-lg p-6 w-4/6">
          <div className="flex flex-col gap-2 mb-4">
            <h1 className="text-[2rem] font-bold text-grey-500">
              Customize your links
            </h1>
            <p className="text-grey-400">
              Add, edit, or remove links below and share your profiles with the
              world!
            </p>
            <button
              onClick={handleAddLink}
              className="btn border border-primary-dark text-primary-dark w-full font-semibold mb-6"
            >
              + Add new link
            </button>
          </div>
          <form className="flex flex-col gap-4">
            <ul className="flex flex-col gap-6">
              {links.map((link, index) => (
                <li key={link.id} className="bg-grey-200 flex flex-col gap-3 p-5 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2 items-center">
                      <Image src={dash} alt="icon" />
                      <span className="font-semibold">Link {index + 1}</span>
                    </div>
                    <p
                      className="text-grey-400 cursor-pointer"
                      onClick={() => deleteLink(link.id)}
                    >
                      Remove
                    </p>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="w-full flex flex-col gap-1">
                      <label
                        htmlFor={`platform-${link.id}`}
                        className="text-grey-500 text-xs"
                      >
                        Platform
                      </label>
                      <select
                        name={`platform-${link.id}`}
                        id={`platform-${link.id}`}
                        value={link.platform}
                        onChange={(e) =>
                          updateLinkLocally(link.id, e.target.value, link.link)
                        }
                        className="w-full px-4 py-3 rounded-lg border border-grey-300 bg-grey-100 outline-none "
                      >
                        <option value="">Select platform</option>
                        <option value="github">
                          {" "}
                          <Image src={dash} alt="'" /> Github
                        </option>
                        <option value="frontendMentor">Frontend Mentor</option>
                        <option value="twitter">Twitter</option>
                        <option value="linkedin">Linkedin</option>
                        <option value="youtube">YouTube</option>
                        <option value="facebook">Facebook</option>
                        <option value="twitch">Twitch</option>
                        <option value="devTo">Dev.to</option>
                      </select>
                    </div>
                    <div className="w-full flex flex-col gap-1">
                      <label
                        htmlFor={`link-${link.id}`}
                        className="text-grey-500 text-xs"
                      >
                        Link
                      </label>
                      <input
                        type="text"
                        name={`link-${link.id}`}
                        id={`link-${link.id}`}
                        value={link.link}
                        onChange={(e) =>
                          updateLinkLocally(
                            link.id,
                            link.platform,
                            e.target.value
                          )
                        }
                        className="w-full px-4 py-3 rounded-lg border border-grey-300 bg-grey-100 outline-none"
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={handleSave}
              className="btn text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Save
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Links;
