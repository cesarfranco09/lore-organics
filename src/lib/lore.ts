import foundersPhoto from "@/assets/founders.webp";

/**
 * The Lore of LORE: the video series, plus community photos for the homepage
 * row. Add episodes here as they're published (9:16 poster in /public/lore/,
 * caption per language); the homepage row and The Lore page pick them up.
 */

export interface Episode {
  id: string;
  /** 9:16 poster image. */
  poster: string;
  /** Where the episode plays (Instagram / TikTok link). */
  url: string;
  caption: { en: string; nl: string; de: string };
}

export const EPISODES: Episode[] = [];

export interface CommunityPhoto {
  src: string;
  /** i18n key in home.json for the alt text. */
  altKey: string;
}

/** Real photos only: the founders and their friends. */
export const COMMUNITY_PHOTOS: CommunityPhoto[] = [{ src: foundersPhoto, altKey: "founders.imageAlt" }];

export const INSTAGRAM_URL = "https://www.instagram.com/lore.organics/";
export const TIKTOK_URL = "https://tiktok.com/@lore.organics";
