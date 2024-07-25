import create from "zustand";
import {
  addLink,
  deleteLink,
  fetchLinks as fetchLinksFromAPI,
  updateLink,
  updateProfile as updateProfileInService,
} from "@/app/dashboard/links/linkService";
import { Link, Profile } from "./interfaces"; // Adjust the path as needed
import { getErrorMessage } from "@/utils/errorHandler";
// Adjust the path as needed

interface LinksState {
  profile: Profile;
  links: Link[];
  fetchLinks: () => Promise<Link[]>;
  addLink: (platform: string, link: string) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  updateLink: (id: string, platform: string, link: string) => Promise<void>;
  updateLinkLocally: (id: string, platform: string, link: string) => void;
  updateProfile: (
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    profileImage: string | null
  ) => Promise<void>;
}

export const useLinksStore = create<LinksState>((set) => ({
  profile: {
    id: "",
    firstName: "",
    lastName: "",
    email: "",
    profileImage: "",
  },
  links: [],
  fetchLinks: async () => {
    const links = await fetchLinksFromAPI();
    set({ links });
    return links;
  },
  addLink: async (platform, link) => {
    try {
      const id = await addLink(platform, link);
      if (id) {
        set((state) => ({
          links: [...state.links, { id, platform, link }],
        }));
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error("Failed to add link:", errorMessage);
      alert("Failed to add link: " + errorMessage);
    }
  },
  deleteLink: async (id) => {
    try {
      const deletedId = await deleteLink(id);
      if (deletedId) {
        set((state) => ({
          links: state.links.filter((link) => link.id !== deletedId),
        }));
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error("Failed to delete link:", errorMessage);
      alert("Failed to delete link: " + errorMessage);
    }
  },
  updateLink: async (id, platform, link) => {
    try {
      const success = await updateLink(id, platform, link);
      if (success) {
        set((state) => ({
          links: state.links.map((l) =>
            l.id === id ? { ...l, platform, link } : l
          ),
        }));
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error("Failed to update link:", errorMessage);
      alert("Failed to update link: " + errorMessage);
    }
  },
  updateLinkLocally: (id, platform, link) => {
    set((state) => ({
      links: state.links.map((l) =>
        l.id === id ? { ...l, platform, link } : l
      ),
    }));
  },
  updateProfile: async (userId, firstName, lastName, email, profileImage) => {
    try {
      const image = profileImage ?? ""; // Handle null case by assigning an empty string
      const updatedProfile = await updateProfileInService(
        userId,
        firstName,
        lastName,
        email,
        image
      );
      set({ profile: updatedProfile });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      console.error("Failed to update profile:", errorMessage);
      alert("Failed to update profile: " + errorMessage);
    }
  },
}));
