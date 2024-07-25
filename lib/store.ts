import create from "zustand";
import {
  addLink,
  deleteLink,
  fetchLinks as fetchLinksFromService,
  updateLink,
  updateProfile as updateProfileInService,
} from "@/app/dashboard/links/linkService";

interface Link {
  id: string;
  platform: string;
  link: string;
}

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profileImage: string; 
}

interface LinksState {
  profile: Profile;
  links: Link[];
  fetchLinks: () => Promise<void>;
  addLink: (platform: string, link: string) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  updateLink: (id: string, platform: string, link: string) => Promise<void>;
  updateLinkLocally: (id: string, platform: string, link: string) => void;
  updateProfile: (
    userId: string,
    firstName: string,
    lastName: string,
    email: string,
    profileImage: null,
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
    try {
      const links = await fetchLinksFromService(); // Fetch from service
      set({  }); // Update state with fetched links
    } catch (error) {
      console.error("Failed to fetch links:", error);
    }
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
      console.error("Failed to add link:", error);
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
      console.error("Failed to delete link:", error);
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
      console.error("Failed to update link:", error);
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
      const updatedProfile = await updateProfileInService(
        userId,
        firstName,
        lastName,
        email,
        profileImage
        
      );
      set({  });
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  },
}));
