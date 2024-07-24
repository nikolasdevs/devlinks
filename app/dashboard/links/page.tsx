"use client";
import { useEffect } from "react";
import { useLinksStore } from "@/lib/store";
import Header from "@/app/Header";
import Image from "next/image";
import dash from "../../../public/dash.svg";

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

  const handleSaveAll = async () => {
    for (const link of links) {
      await updateLink(link.id, link.platform, link.link);
    }
    fetchLinks(); // Refresh the list to reflect updates
  };

  return (
    <>
      <Header />
      <div className="pb-6 px-6 flex gap-6">
        {/* Left Column */}
        <div className="leftColumn w-[560px] bg-grey-100 rounded-lg p-6">
          <ul className="space-y-2">
            {links.map((link, index) => (
              <li
                key={link.id}
                className="bg-gray-100 p-4 rounded shadow-sm flex justify-between items-center"
              >
                <div>
                  <strong className="block text-gray-700">
                    {link.platform}
                  </strong>
                  <a href={link.link} className="text-blue-500">
                    {link.link}
                  </a>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => deleteLink(link.id)}
                    className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
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
            <ul className="space-y-4">
              {links.map((link, index) => (
                <li key={link.id} className="bg-grey-200 p-5 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex gap-2 items-center">
                      <Image src={dash} alt="icon" />
                      <span className="font-semibold">Link {index + 1}</span>
                    </div>
                    <p
                      className="text-red-500 cursor-pointer"
                      onClick={() => deleteLink(link.id)}
                    >
                      Remove
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
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
                        className="w-full px-4 py-3 rounded-lg border border-grey-300 bg-grey-100 outline-none"
                      >
                        <option value="">Select platform</option>
                        <option value="github">Github</option>
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
              onClick={handleSaveAll}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Save All
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Links;
