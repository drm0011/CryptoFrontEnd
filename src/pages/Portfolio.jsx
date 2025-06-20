import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getPortfolio, removeCoin } from "../services/portfolioService";
import { fetchNotes, saveNote } from "../services/noteService";
import {
  initSignalR,
  onNoteReceived,
  sendNoteSignal,
} from "../services/signalRService";

const Portfolio = () => {
  const { token } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState({});
  const [editingCoinId, setEditingCoinId] = useState(null);
  const [highlightedCoinId, setHighlightedCoinId] = useState(null);

  const loadPortfolio = async () => {
    try {
      const data = await getPortfolio(token);
      setPortfolio(data);

      const userNotes = await fetchNotes(token);
      const noteMap = {};
      userNotes.forEach((n) => {
        noteMap[n.coinId] = n.note;
      });
      setNotes(noteMap);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemove = async (coinId) => {
    try {
      await removeCoin(coinId, token);
      await loadPortfolio();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleNoteChange = async (coinId, newNote) => {
    try {
      setNotes((prev) => ({ ...prev, [coinId]: newNote }));
      await saveNote(coinId, newNote, token);
        sendNoteSignal(coinId, newNote);
    } catch (err) {
      console.error("Failed to save note", err);
    }
  };

  useEffect(() => {
    if (!token) return;

    loadPortfolio();
    initSignalR(token).then(() => {
      onNoteReceived(({ coinId, note }) => {
        setNotes((prev) => ({ ...prev, [coinId]: note }));
        setHighlightedCoinId(coinId);
        setTimeout(() => setHighlightedCoinId(null), 1000);
      });
    });
  }, [token]);

  /* const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return {};
    }
  }; */

  if (!token)
    return <p className="text-center mt-4">Please log in to view your portfolio.</p>;

  return (
    <div>
      <h2>Your Portfolio</h2>
      {error && <p className="text-danger">{error}</p>}
      {portfolio?.portfolioItems?.length > 0 ? (
        <div className="portfolio-list">
          {portfolio.portfolioItems.map((item) => (
            <div key={item.coinId} className="portfolio-item mb-3 p-3 border rounded">
              <h4>{item.coinName}</h4>
                {editingCoinId === item.coinId ? (
                <input
                  className="form-control"
                  value={notes[item.coinId] || ""}
                  onChange={(e) =>
                    setNotes((prev) => ({ ...prev, [item.coinId]: e.target.value }))
                  }
                  onBlur={() => {
                    handleNoteChange(item.coinId, notes[item.coinId]);
                    setEditingCoinId(null);
                  }}
                  autoFocus
                />
              ) : (
                <div
                  className={`note-display ${highlightedCoinId === item.coinId ? "note-flash" : ""}`}
                  onClick={() => setEditingCoinId(item.coinId)}
                  style={{ cursor: "pointer", minHeight: "1.5em", padding: "4px" }}
                >
                  {notes[item.coinId] || <i className="text-muted">Click to add a note</i>}
                </div>
              )}
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleRemove(item.coinId)}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>Your portfolio is empty.</p>
      )}
    </div>
  );
};

export default Portfolio;
