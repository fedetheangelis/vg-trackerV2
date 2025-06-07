import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from './components/Navbar';
import GameList from './components/GameList';
import GameFormModal from './components/GameFormModal';
import ImportSection from './components/ImportSection';
import SortControls from './components/SortControls';
import { Game, GameToSave, GameStatus, SortConfig, SortKey } from './types';
import { LOCAL_STORAGE_PLAYED_KEY, LOCAL_STORAGE_BACKLOG_KEY, NAV_ITEMS } from './constants';

const GAME_PROPERTIES_FOR_SORT: { key: SortKey; label: string }[] = [
  { key: 'titolo', label: 'Titolo' },
  { key: 'piattaforma', label: 'Piattaforma' }, // Will sort by first platform
  { key: 'stato', label: 'Stato' },
  { key: 'votoTotale', label: 'Voto Totale (0-100)' },
  { key: 'oreDiGioco', label: 'Ore di Gioco' }, // String sort
  { key: 'difficolta', label: 'Difficoltà (0-10)' }, // Numeric sort
  { key: 'percentualeTrofei', label: '% Trofei (0-100)' },
  { key: 'platinatoMasterato', label: 'Platinato/Masterato' },
  { key: 'platinatoMasteratoIn', label: 'Dettagli Platinato' },
  { key: 'primaVoltaGiocato', label: 'Prima Giocato' },
  { key: 'ultimaVoltaFinito', label: 'Ultima Finito' },
  { key: 'votoAesthetic', label: 'Voto Estetica (0-100)' },
  { key: 'votoOST', label: 'Voto OST (0-100)' },
  { key: 'replayCompletati', label: 'Replay' },
];


const App: React.FC = () => {
  const [playedGames, setPlayedGames] = useState<Game[]>([]);
  const [backlogGames, setBacklogGames] = useState<Game[]>([]);
  const [currentView, setCurrentView] = useState<string>(NAV_ITEMS[0].id); 
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);

  const [sortConfigPlayed, setSortConfigPlayed] = useState<SortConfig>({ key: 'titolo', direction: 'asc' });
  const [sortConfigBacklog, setSortConfigBacklog] = useState<SortConfig>({ key: 'titolo', direction: 'asc' });

  useEffect(() => {
    const storedPlayedGames = localStorage.getItem(LOCAL_STORAGE_PLAYED_KEY);
    if (storedPlayedGames) {
      setPlayedGames(JSON.parse(storedPlayedGames));
    }
    const storedBacklogGames = localStorage.getItem(LOCAL_STORAGE_BACKLOG_KEY);
    if (storedBacklogGames) {
      setBacklogGames(JSON.parse(storedBacklogGames));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_PLAYED_KEY, JSON.stringify(playedGames));
  }, [playedGames]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_BACKLOG_KEY, JSON.stringify(backlogGames));
  }, [backlogGames]);

  const handleAddOrUpdateGame = useCallback((gameData: GameToSave, id?: string) => {
    // gameData.piattaforma is already string[] from the form's processing
    const gameWithId: Game = id ? { ...gameData, id } : { ...gameData, id: crypto.randomUUID() };

    const updateList = (list: Game[], gameToUpdate: Game): Game[] => {
      const existingIndex = list.findIndex(g => g.id === gameToUpdate.id);
      if (existingIndex > -1) {
        const newList = [...list];
        newList[existingIndex] = gameToUpdate;
        return newList;
      }
      // If not found for update, add it (should only happen if it moved lists)
      return [...list, gameToUpdate]; 
    };
    
    const removeFromList = (list: Game[], gameId: string) => list.filter(g => g.id !== gameId);

    // Determine target list and source list for potential moves
    const isBacklogTarget = gameWithId.stato === GameStatus.DA_INIZIARE;

    if (isBacklogTarget) {
        // Target is backlog
        setBacklogGames(prev => updateList(prev.filter(g => g.id !== gameWithId.id), gameWithId)); // Add/update in backlog
        setPlayedGames(prev => removeFromList(prev, gameWithId.id)); // Remove from played if it was there
    } else {
        // Target is played
        setPlayedGames(prev => updateList(prev.filter(g => g.id !== gameWithId.id), gameWithId)); // Add/update in played
        setBacklogGames(prev => removeFromList(prev, gameWithId.id)); // Remove from backlog if it was there
    }
    
    setEditingGame(null);
    setIsFormModalOpen(false);
  }, []);


  const handleDeleteGame = useCallback((gameId: string) => {
    if (window.confirm("Sei sicuro di voler eliminare questo gioco?")) {
      setPlayedGames(prev => prev.filter(game => game.id !== gameId));
      setBacklogGames(prev => prev.filter(game => game.id !== gameId));
    }
  }, []);

  const handleOpenFormModal = (game?: Game) => {
    setEditingGame(game || null);
    setIsFormModalOpen(true);
  };

  const handleImportGames = useCallback((importedGames: Game[]) => {
    const newPlayedToAdd: Game[] = [];
    const newBacklogToAdd: Game[] = [];
    
    importedGames.forEach(game => {
      // Simple check to avoid adding absolute duplicates by ID if re-importing same items
      // A more robust check might involve title+platform if IDs are not stable from TSV
      const existsInPlayed = playedGames.some(pg => pg.id === game.id);
      const existsInBacklog = backlogGames.some(bg => bg.id === game.id);

      if (existsInPlayed || existsInBacklog) {
        // Optionally update existing or skip, for now skip if ID matches
        console.log(`Game with ID ${game.id} (${game.titolo}) already exists, skipping import.`);
        return;
      }

      if (game.stato === GameStatus.DA_INIZIARE) {
        newBacklogToAdd.push(game);
      } else {
        newPlayedToAdd.push(game);
      }
    });

    setPlayedGames(prev => [...prev, ...newPlayedToAdd]);
    setBacklogGames(prev => [...prev, ...newBacklogToAdd]);
    alert(`${newPlayedToAdd.length + newBacklogToAdd.length} giochi importati con successo!`);
    setCurrentView(NAV_ITEMS[0].id); 
  }, [playedGames, backlogGames]);

  const sortGames = useCallback(<T extends Game,>(games: T[], config: SortConfig): T[] => {
    const sortedGames = [...games];
    sortedGames.sort((a, b) => {
      let valA = a[config.key];
      let valB = b[config.key];

      // Handle specific types for comparison
      if (config.key === 'piattaforma') {
        valA = Array.isArray(valA) && valA.length > 0 ? valA[0] : ''; // Sort by first platform
        valB = Array.isArray(valB) && valB.length > 0 ? valB[0] : '';
      }
      if (config.key === 'oreDiGioco' || config.key === 'platinatoMasteratoIn' || config.key === 'primaVoltaGiocato' || config.key === 'ultimaVoltaFinito') {
        // Ensure string comparison for these potentially textual fields
        valA = String(valA ?? '').toLowerCase();
        valB = String(valB ?? '').toLowerCase();
      }


      let comparison = 0;
      if (valA === undefined || valA === null) comparison = 1; 
      else if (valB === undefined || valB === null) comparison = -1;
      else if (typeof valA === 'number' && typeof valB === 'number') {
        comparison = valA - valB;
      } else if (typeof valA === 'boolean' && typeof valB === 'boolean') {
        comparison = valA === valB ? 0 : valA ? -1 : 1; 
      } else if (typeof valA === 'string' && typeof valB === 'string') {
        // Date check for YYYY-MM-DD formatted strings (e.g. from parseDate)
        if ((config.key === 'primaVoltaGiocato' || config.key === 'ultimaVoltaFinito') && /^\d{4}-\d{2}-\d{2}$/.test(valA) && /^\d{4}-\d{2}-\d{2}$/.test(valB)) {
             comparison = new Date(valA).getTime() - new Date(valB).getTime();
        } else {
            comparison = valA.localeCompare(valB, 'it', { sensitivity: 'base' });
        }
      } else if (Array.isArray(valA) && Array.isArray(valB) && config.key !== 'piattaforma') { // Piattaforma already handled
        // Generic array sort (e.g., by length, or first element if comparable) - not really used by current sort keys
        comparison = valA.length - valB.length; 
      }
      
      return config.direction === 'asc' ? comparison : -comparison;
    });
    return sortedGames;
  }, []);
  
  const handleSortChange = (listType: 'played' | 'backlog', key: SortKey) => {
    const currentConfig = listType === 'played' ? sortConfigPlayed : sortConfigBacklog;
    const setConfig = listType === 'played' ? setSortConfigPlayed : setSortConfigBacklog;
    
    let direction: 'asc' | 'desc' = 'asc';
    if (currentConfig.key === key && currentConfig.direction === 'asc') {
      direction = 'desc';
    }
    setConfig({ key, direction });
  };

  const displayedPlayedGames = useMemo(() => sortGames(playedGames, sortConfigPlayed), [playedGames, sortConfigPlayed, sortGames]);
  const displayedBacklogGames = useMemo(() => sortGames(backlogGames, sortConfigBacklog), [backlogGames, sortConfigBacklog, sortGames]);


  const renderCurrentView = () => {
    switch (currentView) {
      case 'played':
        return (
          <>
            <SortControls 
                sortConfig={sortConfigPlayed} 
                onSortChange={(key) => handleSortChange('played', key)}
                gameProperties={GAME_PROPERTIES_FOR_SORT}
            />
            <GameList 
                games={displayedPlayedGames} 
                onEditGame={handleOpenFormModal} 
                onDeleteGame={handleDeleteGame}
                listType="played"
            />
          </>
        );
      case 'backlog':
        return (
          <>
            <SortControls 
                sortConfig={sortConfigBacklog} 
                onSortChange={(key) => handleSortChange('backlog', key)}
                gameProperties={GAME_PROPERTIES_FOR_SORT}
            />
            <GameList 
                games={displayedBacklogGames} 
                onEditGame={handleOpenFormModal} 
                onDeleteGame={handleDeleteGame}
                listType="backlog"
            />
          </>
        );
      case 'import':
        return <ImportSection onImportGames={handleImportGames} />;
      default:
        return <p>Sezione non trovata.</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Navbar 
        currentView={currentView} 
        onNavigate={setCurrentView} 
        onAddGame={() => handleOpenFormModal()}
      />
      <main className="container mx-auto px-4 py-8 flex-grow">
        {renderCurrentView()}
      </main>
      <GameFormModal
        isOpen={isFormModalOpen}
        onClose={() => { setIsFormModalOpen(false); setEditingGame(null); }}
        onSave={handleAddOrUpdateGame}
        initialGame={editingGame}
      />
      <footer className="bg-gray-800 text-center text-sm text-gray-400 p-4">
        Game Tracker Pro &copy; {new Date().getFullYear()} - Powered by React & TailwindCSS. Game data from RAWG.io.
      </footer>
    </div>
  );
};

export default App;
