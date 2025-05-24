import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMarketData } from "../services/marketService";
import { addToPortfolio } from "../services/portfolioService"; // ✅

const Market = () => {
  const { token } = useAuth();
  const [vsCurrency, setVsCurrency] = useState("usd");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [marketData, setMarketData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMarket = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMarketData(token, vsCurrency, perPage, page);
      setMarketData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (coinId, coinName) => {
    try {
      await addToPortfolio(coinId, coinName, token); // ✅
      alert(`${coinName} added to your portfolio!`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Market Data</h2>

      <div className="row mb-3">
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Currency (e.g. usd)"
            value={vsCurrency}
            onChange={(e) => setVsCurrency(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Per Page"
            value={perPage}
            onChange={(e) => setPerPage(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <input
            type="number"
            className="form-control"
            placeholder="Page"
            value={page}
            onChange={(e) => setPage(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <button onClick={fetchMarket} className="btn btn-primary w-100">
            Fetch Market Data
          </button>
        </div>
      </div>

      {loading && <p>Loading market data...</p>}
      {error && <p className="text-danger">{error}</p>}

      {marketData && (
        <div className="row">
          {marketData.map((coin) => (
            <div key={coin.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <img src={coin.image} alt={coin.name} width={30} className="mb-2" />
                  <h5 className="card-title">
                    {coin.name} ({coin.symbol.toUpperCase()})
                  </h5>
                  <p className="card-text">Price: ${coin.current_price.toLocaleString()}</p>
                  <p className="card-text">Market Cap: ${coin.market_cap.toLocaleString()}</p>

                  {/* ✅ Add to Portfolio Button */}
                  {token ? (
                    <button
                      onClick={() => handleAdd(coin.id, coin.name)}
                      className="btn btn-sm btn-success mt-2"
                    >
                      Add to Portfolio
                    </button>
                  ) : (
                    <p className="text-muted">Login to add</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Market;
