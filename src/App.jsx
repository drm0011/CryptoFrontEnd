import { useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import Login from "./components/Login";
import Register from "./components/Register";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [vsCurrency, setVsCurrency] = useState("usd");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [showLogin, setShowLogin] = useState(true);

  const fetchData = async () => {
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
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
  };

  return (
    <div className="app">
      <h1 className="text-center mb-4">Crypto Market Data</h1>
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
                  onClick={fetchData}
                  className="btn btn-primary me-2"
                >
                  Fetch Data
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
          {data && (
            <div className="crypto-list">
              {data.map((coin) => (
                <div key={coin.id} className="crypto-item">
                  <img src={coin.image} alt={coin.name} className="crypto-image" />
                  <div>
                    <h3>{coin.name} ({coin.symbol.toUpperCase()})</h3>
                    <p>Price: ${coin.current_price.toLocaleString()}</p>
                    <p>Market Cap: ${coin.market_cap.toLocaleString()}</p>
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