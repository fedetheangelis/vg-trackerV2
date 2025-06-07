export enum GameStatus {
  DA_INIZIARE = 'Da Iniziare', // For backlog
  MASTERATO_PLATINATO = 'Masterato/Platinato',
  COMPLETATO_100 = 'Completato (100%)',
  FINITO = 'Finito',
  IN_PAUSA = 'In Pausa',
  DROPPATO = 'Droppato',
  IN_CORSO = 'In Corso',
  ONLINE_SENZA_FINE = 'Online/Senza Fine',
  ARCHIVIATO = 'Archiviato',
}

// Note: The old Difficulty enum is removed as 'difficolta' is now number (0-10)

export interface Game {
  id: string;
  titolo: string;
  piattaforma: string[]; // Changed from string to string[]
  oreDiGioco?: string; // Changed from number to string
  votoTotale?: number; // Range 0-100
  votoAesthetic?: number; // Range 0-100
  votoOST?: number; // Range 0-100
  difficolta?: number; // Changed from Difficulty enum to number (0-10)
  stato: GameStatus; // Enum values will change
  percentualeTrofei?: number; // Range 0-100, optional
  platinatoMasterato?: boolean;
  platinatoMasteratoIn?: string; // Added new field
  replayCompletati?: number;
  primaVoltaGiocato?: string; // Kept as string (can be date or text)
  ultimaVoltaFinito?: string; // Kept as string (can be date or text)
  coverImageUrl?: string; // Will hold TSV link or RAWG cropped link
  rawgId?: number; // RAWG game ID for more accurate fetching if needed
}

export type GameToSave = Omit<Game, 'id'>;

export type SortKey = keyof Game;

export interface SortConfig {
  key: SortKey;
  direction: 'asc' | 'desc';
}

// For RAWG API response
export interface RawgGameResult {
  id: number;
  slug: string;
  name: string;
  background_image: string | null;
  // Add other fields if needed
}

export interface RawgGamesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: RawgGameResult[];
}

export const GAME_STATUS_OPTIONS = Object.values(GameStatus);
// DIFFICULTY_OPTIONS is removed as difficulty is now a number 0-10

// TSV Headers mapping
export const TSV_HEADERS: { [key: string]: keyof Game | 'coverImageUrlDirect' } = { // coverImageUrlDirect is temporary
  'Titolo': 'titolo',
  'Piattaforma': 'piattaforma', // Will be parsed as comma-separated string
  'Ore di gioco': 'oreDiGioco', // Will be parsed as string
  'Voto Totale': 'votoTotale', // Parsed as number 0-100
  'Voto Aesthetic': 'votoAesthetic', // Parsed as number 0-100
  'Voto OST': 'votoOST', // Parsed as number 0-100
  'Difficoltà': 'difficolta', // Parsed as number 0-10
  'Stato': 'stato', // Parsed to new GameStatus
  '% Trofei': 'percentualeTrofei', // Parsed as number 0-100
  'Platino/Masterato': 'platinatoMasterato', // Parsed as boolean
  'Dettagli Platinato/Masterato': 'platinatoMasteratoIn', // New field
  'Replay completati': 'replayCompletati', // Parsed as number
  'Prima volta giocato': 'primaVoltaGiocato', // Parsed as string
  'Ultima volta finito': 'ultimaVoltaFinito', // Parsed as string
  'Link Copertina': 'coverImageUrl', // Direct cover URL from TSV
};

// Required fields for a game to be valid from TSV or form
// 'stato' will use the new GameStatus enum, which includes DA_INIZIARE for backlog.
export const REQUIRED_GAME_FIELDS: (keyof Game)[] = ['titolo', 'piattaforma', 'stato'];
