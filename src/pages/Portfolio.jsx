import { useEffect, useState } from "react";
import { toast } from 'react-toastify';
import { useAuth } from "../context/AuthContext";
import {
  getPortfolio,
  removeCoin,
  fetchSentiment,
  fetchVolatility,
} from "../services/portfolioService";
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
  const [moodMap, setMoodMap] = useState({});
  const [editingCoinId, setEditingCoinId] = useState(null);
  const [highlightedCoinId, setHighlightedCoinId] = useState(null);
  const [sentiment, setSentiment] = useState({
    bullish: 0,
    neutral: 0,
    bearish: 0,
  });
  const [volatilityData, setVolatilityData] = useState({});
  const [volatilityDays, setVolatilityDays] = useState(7);

  const loadPortfolio = async () => {
    try {
      const data = await getPortfolio(token);
      setPortfolio(data);

      const userNotes = await fetchNotes(token);
      const noteMap = {};
      const moodState = {};
      userNotes.forEach((n) => {
        noteMap[n.coinId] = n.note;
        moodState[n.coinId] = n.mood || "neutral";
      });
      setNotes(noteMap);
      setMoodMap(moodState);
    } catch (err) {
      toast.error("Failed to load your portfolio.");
    }
  };

  const handleRemove = async (coinId) => {
    try {
      await removeCoin(coinId, token);
      await loadPortfolio();
      toast.success("Coin removed from portfolio.");
    } catch (err) {
      toast.error("Could not remove the coin. Try again.");
    }
  };

  const handleNoteChange = async (coinId, newNote) => {
    const mood = moodMap[coinId] || "neutral";
    try {
      setNotes((prev) => ({ ...prev, [coinId]: newNote }));
      await saveNote(coinId, newNote, mood, token);
      sendNoteSignal(coinId, newNote);
      const updatedSentiment = await fetchSentiment(token);
      setSentiment(updatedSentiment);
      toast.success("Note saved.");
    } catch (err) {
      toast.error("Failed to save note.");
    }
  };

  useEffect(() => {
    if (!token) return;

    loadPortfolio();
    fetchSentiment(token).then(setSentiment).catch(console.error);

    initSignalR(token).then(() => {
      onNoteReceived(({ coinId, note }) => {
        setNotes((prev) => ({ ...prev, [coinId]: note }));
        setHighlightedCoinId(coinId);
        setTimeout(() => setHighlightedCoinId(null), 1000);
      });
    });
  }, [token]);

  useEffect(() => {
    if (!token || !portfolio) return;

    fetchVolatility(token, volatilityDays)
      .then((data) => {
        const map = {};
        data.forEach((entry) => {
          map[entry.coinId] = entry.volatilityPercent;
        });
        setVolatilityData(map);
      })
      .catch(toast.error);
  }, [token, portfolio, volatilityDays]);

  const getOverallMood = () => {
    const { bullish, neutral, bearish } = sentiment;

    const max = Math.max(bullish, neutral, bearish);

    if (bullish === max && bullish !== neutral && bullish !== bearish) return "Bullish";
    if (bearish === max && bearish !== neutral && bearish !== bullish) return "Bearish";
    if (neutral === max && neutral !== bullish && neutral !== bearish) return "Neutral";

    return "Mixed";
  };

  const getVolatilityClass = (value) => {
    if (value < 1) return "text-success";
    if (value < 5) return "text-warning";
    return "text-danger";
  };

  if (!token)
    return <p className="text-center mt-4">Please log in to view your portfolio.</p>;

  return (
    <div>
      <h2>Your Portfolio</h2>

      {(sentiment.bullish + sentiment.neutral + sentiment.bearish > 0) && (
        <div className="my-4 p-3 border rounded bg-light">
          <h5>📊 Portfolio Sentiment Summary</h5>
          <div className="d-flex align-items-center gap-4">
            <span>🐂 Bullish: {sentiment.bullish}</span>
            <span>😐 Neutral: {sentiment.neutral}</span>
            <span>🐻 Bearish: {sentiment.bearish}</span>
          </div>
          <strong className="mt-2 d-block">Overall Mood: {getOverallMood()}</strong>
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">
          Volatility Range ($):
          <span
            className="ms-2 text-muted"
            title="Volatility measures price fluctuation. Green = stable, yellow = volatile, red = highly volatile."
            style={{ cursor: "help" }}
          >
            ⓘ
          </span>
        </label>
        <select
          className="form-select w-auto"
          value={volatilityDays}
          onChange={(e) => setVolatilityDays(parseInt(e.target.value))}
        >
          <option value={7}>1W</option>
          <option value={30}>1M</option>
          <option value={90}>3M</option>
          <option value={365}>1Y</option>
        </select>
      </div>

      {error && <p className="text-danger">{error}</p>}
      {portfolio?.portfolioItems?.length > 0 ? (
        <div className="portfolio-list">
          {portfolio.portfolioItems.map((item) => (
            <div key={item.coinId} className="portfolio-item mb-3 p-3 border rounded">
              <h4>{item.coinName}</h4>

              {volatilityData[item.coinId] !== undefined && (
                <div className={`mb-2 ${getVolatilityClass(volatilityData[item.coinId])}`}>
                  <small>
                    Volatility ({volatilityDays}d): {volatilityData[item.coinId]}%
                  </small>
                </div>
              )}

              {editingCoinId === item.coinId ? (
                <>
                  <input
                    className="form-control"
                    data-cy="note-input"
                    value={notes[item.coinId] || ""}
                    onChange={(e) =>
                      setNotes((prev) => ({ ...prev, [item.coinId]: e.target.value }))
                    }
                    autoFocus
                  />
                  <select
                    className="form-select form-select-sm mt-2"
                    data-cy="mood-select"
                    value={moodMap[item.coinId] || "neutral"}
                    onChange={(e) =>
                      setMoodMap((prev) => ({ ...prev, [item.coinId]: e.target.value }))
                    }
                  >
                    <option value="bullish">🐂 Bullish</option>
                    <option value="neutral">😐 Neutral</option>
                    <option value="bearish">🐻 Bearish</option>
                  </select>
                  <button
                    className="btn btn-sm btn-primary mt-2"
                    onClick={() => {
                      handleNoteChange(item.coinId, notes[item.coinId]);
                      setEditingCoinId(null);
                    }}
                  >
                    Save
                  </button>
                </>
              ) : (
                <div
                  className={`note-display ${
                    highlightedCoinId === item.coinId ? "note-flash" : ""
                  }`}
                  onClick={() => setEditingCoinId(item.coinId)}
                  style={{ cursor: "pointer", minHeight: "1.5em", padding: "4px" }}
                >
                  {notes[item.coinId] || <i className="text-muted">Click to add a note</i>}
                  <span className="ms-2">
                    {moodMap[item.coinId] === "bullish"
                      ? "🐂"
                      : moodMap[item.coinId] === "bearish"
                      ? "🐻"
                      : "😐"}
                  </span>
                </div>
              )}

              <button
                className="btn btn-sm btn-danger mt-2"
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
