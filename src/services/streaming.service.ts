export interface VideoServer {
  id: string;
  name: string;
  quality: string;
  url: string;
  speed: "Fast" | "Ultra Fast" | "Normal";
  isVip?: boolean;
}

export interface StreamingServerConfig {
  id: string;
  name: string;
  quality: string;
  speed: "Fast" | "Ultra Fast" | "Normal";
  isVip?: boolean;
  getMovieUrl: (tmdbId: number | string) => string;
  getTvUrl: (
    tmdbId: number | string,
    season: number,
    episode: number,
  ) => string;
}

export const STREAMING_PROVIDERS: StreamingServerConfig[] = [
  {
    id: "vidlink",
    name: "Server 1 (VidLink HD)",
    quality: "1080p",
    speed: "Ultra Fast",
    getMovieUrl: (id) => `https://vidlink.pro/movie/${id}`,
    getTvUrl: (id, s, e) => `https://vidlink.pro/tv/${id}/${s}/${e}`,
  },
  {
    id: "vidsrc-net",
    name: "Server 2 (VidSrc)",
    quality: "1080p",
    speed: "Ultra Fast",
    isVip: true,
    getMovieUrl: (id) => `https://vidsrc.net/embed/movie/${id}`,
    getTvUrl: (id, s, e) => `https://vidsrc.net/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "multiembed",
    name: "Server 3 (MultiEmbed)",
    quality: "1080p",
    speed: "Fast",
    getMovieUrl: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
    getTvUrl: (id, s, e) =>
      `https://multiembed.mov/?video_id=${id}&tmdb=1&s=${s}&e=${e}`,
  },
  {
    id: "autoembed",
    name: "Server 4 (AutoEmbed)",
    quality: "1080p",
    speed: "Fast",
    getMovieUrl: (id) => `https://player.autoembed.cc/embed/movie/${id}`,
    getTvUrl: (id, s, e) =>
      `https://player.autoembed.cc/embed/tv/${id}/${s}/${e}`,
  },
  {
    id: "2embed",
    name: "Server 5 (2Embed)",
    quality: "HD",
    speed: "Normal",
    getMovieUrl: (id) => `https://www.2embed.cc/embed/${id}`,
    getTvUrl: (id, s, e) => `https://www.2embed.cc/embedtv/${id}&s=${s}&e=${e}`,
  },
];

export function getStreamingServers(
  tmdbId: number | string,
  isTv = false,
  season = 1,
  episode = 1,
): VideoServer[] {
  return STREAMING_PROVIDERS.map((provider) => ({
    id: provider.id,
    name: provider.name,
    quality: provider.quality,
    speed: provider.speed,
    isVip: provider.isVip,
    url: isTv
      ? provider.getTvUrl(tmdbId, season, episode)
      : provider.getMovieUrl(tmdbId),
  }));
}

export function isEmbedUrl(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  if (
    lower.endsWith(".mp4") ||
    lower.endsWith(".webm") ||
    lower.endsWith(".ogg") ||
    lower.endsWith(".m3u8") ||
    lower.endsWith(".m4v") ||
    lower.endsWith(".ogv")
  ) {
    return false;
  }
  return (
    lower.includes("youtube.com/embed") ||
    lower.includes("player.vimeo.com") ||
    lower.includes("drive.google.com") ||
    lower.includes("embed") ||
    lower.startsWith("http")
  );
}

export function normalizeVideoUrl(url: string): string {
  if (!url) return url;
  const trimmed = url.trim();
  const ytWatch = trimmed.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{6,})/,
  );
  if (ytWatch) return `https://www.youtube.com/embed/${ytWatch[1]}`;
  return trimmed;
}

export function isFullPageUrl(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  const directHints = [
    ".mp4",
    ".webm",
    ".m4v",
    ".ogv",
    ".ogg",
    ".m3u8",
    "youtube.com/embed",
    "youtu.be/",
    "youtube.com/shorts",
    "player.vimeo.com",
    "/embed",
    "embed/",
    "drive.google.com",
    "vidlink.pro",
    "vidsrc",
    "multiembed.mov",
    "autoembed",
    "2embed",
  ];
  if (directHints.some((h) => lower.includes(h))) return false;
  const pageHints = [
    "/drama/",
    "/series/",
    "/tv/",
    "/anime/",
    "/episode-",
    "/episode/",
    "/watch/",
    "/movie/",
    "/show/",
    "?ep=",
    "/episode",
    "/play/",
  ];
  return pageHints.some((h) => lower.includes(h));
}

export function getEmbedUrlForEpisode(options: {
  tmdbId?: number | null;
  isTv?: boolean;
  season?: number;
  episodeNumber: number;
  videoUrl?: string;
}): string {
  const { tmdbId, isTv, season = 1, episodeNumber, videoUrl } = options;
  if (tmdbId) {
    const servers = getStreamingServers(tmdbId, isTv, season, episodeNumber);
    return servers[0]?.url || videoUrl || "";
  }
  return videoUrl || "";
}