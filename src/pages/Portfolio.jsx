import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getPortfolio, removeCoin } from "../services/portfolioService";

const Portfolio = () => {
  const { token } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [error, setError] = useState(null);

  const loadPortfolio = async () => {
    try {
      const data = await getPortfolio(token);
      setPortfolio(data);
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

  useEffect(() => {
    if (token) {
      loadPortfolio();
    }
  }, [token]);

  if (!token) return <p className="text-center mt-4">Please log in to view your portfolio.</p>;

  return (
    <div>
      <h2>Your Portfolio</h2>
      {error && <p className="text-danger">{error}</p>}
      {portfolio?.portfolioItems?.length > 0 ? (
        <div className="portfolio-list">
          {portfolio.portfolioItems.map((item) => (
            <div key={item.coinId} className="portfolio-item mb-3 p-3 border rounded">
              <h4>{item.coinName}</h4>
              <p>Amount: {item.amount}</p>
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
