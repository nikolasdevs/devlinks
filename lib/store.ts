// import create from "zustand";
// import fetchLinksService from "../app/dashboard/links/page";
// import {
//   addLink,
//   deleteLink,
//   fetchLinks,
//   updateLink,
// } from "@/app/dashboard/links/linkService";

// interface Link {
//   id: string;
//   platform: string;
//   link: string;
// }

// interface LinksState {
//   links: Link[];
//   selectedLink: Link | null;
//   updateMode: boolean;
//   formVisible: boolean;
//   platform: string;
//   link: string;
//   fetchLinks: () => Promise<void>;
//   addLink: (platform: string, link: string) => Promise<void>;
//   deleteLink: (id: string) => Promise<void>;
//   updateLink: (id: string, platform: string, link: string) => Promise<void>;
//   updateLinkLocally: (id: string, platform: string, link: string) => void;
//   setSelectedLink: (link: Link | null) => void;
//   setUpdateMode: (mode: boolean) => void;
//   setFormVisible: (visible: boolean) => void;
//   setPlatform: (platform: string) => void;
//   setLink: (link: string) => void;
//   resetForm: () => void;
// }

// export const useLinksStore = create<LinksState>((set) => ({
//   links: [],
//   selectedLink: null,
//   updateMode: false,
//   platform: "",
//   link: "",
//   formVisible: false,

//   fetchLinks: async () => {
//     const links = await fetchLinks();
//     set({ links });
//   },

//   addLink: async (platform, link) => {
//     const id = await addLink(platform, link);
//     if (id) {
//       set((state) => ({
//         links: [...state.links, { id, platform, link }],
//         platform: "",
//         link: "",
//         selectedLink: null,
//         updateMode: true,
//         formVisible: false,
//       }));
//     }
//   },

//   // addLink: async (platform, link) => {
//   //   const id = await addLinkService(platform, link);
//   //   if (id) {
//   //     set((state) => ({
//   //       links: [...state.links, { id, platform, link }],
//   //     }));
//   //   }
//   // },

//   deleteLink: async (id) => {
//     const deletedId = await deleteLink(id);
//     if (deletedId) {
//       set((state) => ({
//         links: state.links.filter((link) => link.id !== deletedId),
//       }));
//     }
//   },

//   updateLink: async (id, platform, link) => {
//     const success = await updateLink(id, platform, link);
//     if (success) {
//       set((state) => ({
//         links: state.links.map((l) =>
//           l.id === id ? { ...l, platform, link } : l
//         ),
//         platform: "",
//         link: "",
//         selectedLink: null,
//         updateMode: false,
//         formVisible: false,
//       }));
//     }
//   },

//   updateLinkLocally: (id, platform, link) => {
//     set((state) => ({
//       links: state.links.map((l) =>
//         l.id === id ? { ...l, platform, link } : l
//       ),
//     }));
//   },

//   setSelectedLink: (link) => set({ selectedLink: link }),
//   setUpdateMode: (mode) => set({ updateMode: mode }),
//   setPlatform: (platform) => set({ platform }),
//   setLink: (link) => set({ link }),
//   setFormVisible: (visible) => set({ formVisible: visible }),
//   resetForm: () =>
//     set({
//       platform: "",
//       link: "",
//       selectedLink: null,
//       updateMode: false,
//       formVisible: false,
//     }),
// }));

// store/linksStore.ts
import create from "zustand";
import {
  addLink,
  deleteLink,
  fetchLinks,
  updateLink,
} from "@/app/dashboard/links/linkService";

interface Link {
  id: string;
  platform: string;
  link: string;
}

interface LinksState {
  links: Link[];
  fetchLinks: () => Promise<void>;
  addLink: (platform: string, link: string) => Promise<void>;
  deleteLink: (id: string) => Promise<void>;
  updateLink: (id: string, platform: string, link: string) => Promise<void>;
  updateLinkLocally: (id: string, platform: string, link: string) => void;
}

export const useLinksStore = create<LinksState>((set) => ({
  links: [],
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
}));
