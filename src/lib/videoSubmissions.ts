export interface VideoSubmission {
  id: string;
  gameId: string;
  url: string;
  videoId: string;
  submittedBy: string;
  userEmail: string;
  submittedAt: string;
}

const STORAGE_KEY = 'retroplay_game_videos';

function getStore(): VideoSubmission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as VideoSubmission[]) : [];
  } catch {
    return [];
  }
}

function saveStore(items: VideoSubmission[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function getVideosByGame(gameId: string): VideoSubmission[] {
  const items = getStore();
  return items.filter((item) => item.gameId === gameId).sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));
}

export function getVideoIdFromYouTubeUrl(url: string): string | null {
  const normalized = url.trim();
  const match = normalized.match(
    /(?:youtu\.be\/|youtube(?:-nocookie)?\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([A-Za-z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export function saveVideoSubmission(
  gameId: string,
  url: string,
  submittedBy: string,
  userEmail: string
): VideoSubmission {
  const videoId = getVideoIdFromYouTubeUrl(url);
  const submission: VideoSubmission = {
    id: `${gameId}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    gameId,
    url: url.trim(),
    videoId: videoId ?? '',
    submittedBy,
    userEmail,
    submittedAt: new Date().toISOString(),
  };
  const items = getStore();
  items.push(submission);
  saveStore(items);
  return submission;
}
