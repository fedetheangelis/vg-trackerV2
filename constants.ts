
export const RAWG_API_KEY = process.env.RAWG_API_KEY!;
export const RAWG_API_BASE_URL = "https://api.rawg.io/api";
export const DEFAULT_GAME_COVER = "https://picsum.photos/seed/defaultgame/300/400?grayscale"; // More specific placeholder
export const LOCAL_STORAGE_PLAYED_KEY = 'gameTrackerPro_playedGames';
export const LOCAL_STORAGE_BACKLOG_KEY = 'gameTrackerPro_backlogGames';

export const NAV_ITEMS = [
  { id: 'played', label: 'Giochi Giocati' },
  { id: 'backlog', label: 'Backlog' },
  { id: 'import', label: 'Importa TSV' },
];