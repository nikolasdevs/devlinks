import create from "zustand";
import {
  addLink,
  deleteLink,
  fetchLinks,
  updateLink,
  updateProfile,
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
    profileImage: null
  ) => Promise<void>;
}

export const useLinksStore = create<LinksState>((set) => ({
  links: [],
  profile: {
    firstName: "",
    lastName: "",
    email: "",
    profileImage: "",
    id: "",
  },
  fetchLinks: async () => {
    const links = await fetchLinks();
    set({ links });
  },
  addLink: async (platform, link) => {
    const id = await addLink(platform, link);
    if (id) {
      set((state) => ({
        links: [...state.links, { id, platform, link }],
      }));
    }
  },
  deleteLink: async (id) => {
    const deletedId = await deleteLink(id);
    if (deletedId) {
      set((state) => ({
        links: state.links.filter((link) => link.id !== deletedId),
      }));
    }
  },
  updateLink: async (id, platform, link) => {
    const success = await updateLink(id, platform, link);
    if (success) {
      set((state) => ({
        links: state.links.map((l) =>
          l.id === id ? { ...l, platform, link } : l
        ),
      }));
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
    const updatedProfile = await updateProfile(
      userId,
      firstName,
      lastName,
      email,
      profileImage
    );
    set({ profile: updatedProfile });
  },



  
}));
