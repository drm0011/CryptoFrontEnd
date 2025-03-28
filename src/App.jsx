import { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./components/Login";
import Register from "./components/Register";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [vsCurrency, setVsCurrency] = useState("usd");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [marketData, setMarketData] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [showLogin, setShowLogin] = useState(true);

  // Fetch market data
  const fetchMarketData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_URL}/market?vsCurrency=${vsCurrency}&perPage=${perPage}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch market data");
      const result = await response.json();
      setMarketData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch portfolio data
  const fetchPortfolio = async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/portfolio`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch portfolio");
      const result = await response.json();
      setPortfolio(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add to portfolio
  const addToPortfolio = async (coinId, coinName) => {
    try {
      const response = await fetch(`${API_URL}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          coinId, 
          coinName, 
          amount: 1 // Default amount
        }),
      });
      if (!response.ok) throw new Error("Failed to add to portfolio");
      await fetchPortfolio();
    } catch (err) {
      setError(err.message);
    }
  };

  // Remove from portfolio
  const removeFromPortfolio = async (coinId) => {
    try {
      const response = await fetch(`${API_URL}/remove/${coinId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to remove from portfolio");
      await fetchPortfolio();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const handleRegister = (token) => {
    localStorage.setItem("token", token);
    setToken(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setPortfolio(null);
    setMarketData(null);
  };

  // Fetch portfolio when token changes
  useEffect(() => {
    fetchPortfolio();
  }, [token]);

  return (
    <div className="app">
      <h1 className="text-center mb-4">Crypto Portfolio Tracker</h1>
      {token ? (
        <>
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
              <div className="controls mb-4">
                <div className="mb-3">
                  <label className="form-label">
                    Currency:
                    <input
                      type="text"
                      value={vsCurrency}
                      onChange={(e) => setVsCurrency(e.target.value)}
                      className="form-control"
                    />
                  </label>
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Per Page:
                    <input
                      type="number"
                      value={perPage}
                      onChange={(e) => setPerPage(e.target.value)}
                      className="form-control"
                    />
                  </label>
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Page:
                    <input
                      type="number"
                      value={page}
                      onChange={(e) => setPage(e.target.value)}
                      className="form-control"
                    />
                  </label>
                </div>
                <button
                  onClick={fetchMarketData}
                  className="btn btn-primary me-2"
                >
                  Fetch Market Data
                </button>
                <button
                  onClick={handleLogout}
                  className="btn btn-danger"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>

          {loading && <p className="loading">Loading...</p>}
          {error && <p className="error">{error}</p>}

          <h2 className="mt-4">Your Portfolio</h2>
          {portfolio?.portfolioItems?.length > 0 ? (
            <div className="portfolio-list">
              {portfolio.portfolioItems.map((item) => (
                <div key={item.coinId} className="portfolio-item">
                  <div>
                    <h3>{item.coinName}</h3>
                    <p>Amount: {item.amount}</p>
                    <button
                      onClick={() => removeFromPortfolio(item.coinId)}
                      className="btn btn-sm btn-danger"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Your portfolio is empty. Add some coins!</p>
          )}

          <h2 className="mt-4">Market Data</h2>
          {marketData && (
            <div className="crypto-list">
              {marketData.map((coin) => (
                <div key={coin.id} className="crypto-item">
                  <img src={coin.image} alt={coin.name} className="crypto-image" />
                  <div>
                    <h3>{coin.name} ({coin.symbol.toUpperCase()})</h3>
                    <p>Price: ${coin.current_price.toLocaleString()}</p>
                    <p>Market Cap: ${coin.market_cap.toLocaleString()}</p>
                    <button
                      onClick={() => addToPortfolio(coin.id, coin.name)}
                      className="btn btn-sm btn-success"
                    >
                      Add to Portfolio
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      ) : (
        <>
          {showLogin ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Register onRegister={handleRegister} />
          )}
          <div className="d-flex justify-content-center">
            <button
              onClick={() => setShowLogin(!showLogin)}
              className="btn btn-success mt-4"
            >
              {showLogin ? "Need to register?" : "Already have an account?"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;