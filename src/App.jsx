import { useState } from "react";
import "./App.css";
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
      <h1>Crypto Market Data</h1>
      {token ? (
        <>
          <div className="controls">
            <label>
              Currency:
              <input
                type="text"
                value={vsCurrency}
                onChange={(e) => setVsCurrency(e.target.value)}
              />
            </label>
            <label>
              Per Page:
              <input
                type="number"
                value={perPage}
                onChange={(e) => setPerPage(e.target.value)}
              />
            </label>
            <label>
              Page:
              <input
                type="number"
                value={page}
                onChange={(e) => setPage(e.target.value)}
              />
            </label>
            <button onClick={fetchData}>Fetch Data</button>
            <button onClick={handleLogout}>Logout</button>
          </div>

          {loading && <p>Loading...</p>}
          {error && <p style={{ color: "red" }}>{error}</p>}
          {data && (
            <div className="crypto-list">
              {data.map((coin) => (
                <div key={coin.id} className="crypto-item">
                  <img src={coin.image} alt={coin.name} width={50} />
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
          <button onClick={() => setShowLogin(!showLogin)}>
            {showLogin ? "Need to register?" : "Already have an account?"}
          </button>
        </>
      )}
    </div>
  );
}

export default App;