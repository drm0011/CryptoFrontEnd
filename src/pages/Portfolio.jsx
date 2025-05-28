import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getPortfolio, removeCoin } from "../services/portfolioService";
import { fetchNotes, saveNote } from "../services/noteService";
import Comments from "../components/Comments";

const Portfolio = () => {
  const { token } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [error, setError] = useState(null);
  const [notes, setNotes] = useState({}); // { coinId: noteText }

  // Fetch portfolio + notes on token change
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getPortfolio(token);
        setPortfolio(data);

        const userNotes = await fetchNotes(token);
        const mapped = {};
        userNotes.forEach((n) => {
          mapped[n.coinId] = n.note;
        });
        setNotes(mapped);
      } catch (err) {
        setError(err.message);
      }
    };

    if (token) loadData();
  }, [token]);

  // Remove a coin from portfolio
  const handleRemove = async (coinId) => {
    try {
      await removeCoin(coinId, token);
      const updated = await getPortfolio(token);
      setPortfolio(updated);
    } catch (err) {
      setError(err.message);
    }
  };

  // Update note per coin
  const handleNoteChange = async (coinId, text) => {
    setNotes((prev) => ({ ...prev, [coinId]: text }));
    try {
      await saveNote(coinId, text, token);
    } catch (err) {
      console.error("Failed to save note", err);
    }
  };

  if (!token) return <p className="text-center mt-4">Please log in to view your portfolio.</p>;

  return (
    <div>
      <h2>Your Portfolio</h2>

      {error && <p className="text-danger">{error}</p>}

      {portfolio?.portfolioItems?.length > 0 ? (
        <div className="portfolio-list">
          {portfolio.portfolioItems.map((item) => (
            <div key={item.coinId} className="portfolio-item mb-4 p-4 border rounded">
              <h4>{item.coinName}</h4>
              <p>Amount: {item.amount}</p>

              <button
                className="btn btn-sm btn-danger mb-3"
                onClick={() => handleRemove(item.coinId)}
              >
                Remove
              </button>

              <textarea
                className="form-control"
                placeholder="Add a note for this coin..."
                value={notes[item.coinId] || ""}
                onChange={(e) => handleNoteChange(item.coinId, e.target.value)}
              />
            </div>
          ))}
        </div>
      ) : (
        <p>Your portfolio is empty.</p>
      )}

      {/* Optional global comment section */}
      <div className="mt-5">
        <h4>General Notes or Comments</h4>
        <Comments />
      </div>
    </div>
  );
};

export default Portfolio;
