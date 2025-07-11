import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getMarketData } from "../services/marketService";
import { addToPortfolio } from "../services/portfolioService"; 
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

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
    try {
      const data = await getMarketData(token, vsCurrency, perPage, page);
      setMarketData(data);
    } catch (err) {
      toast.error("Failed to fetch market data.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (coinId, coinName) => {
    try {
      await addToPortfolio(coinId, coinName, token); 
      toast.success(`${coinName} added to your portfolio!`);
    } catch (err) {
      toast.error(err.message || "Failed to add coin.");
    }
  };

  return (
    <div>
      <h2>Market Data</h2>

      <div className="row mb-3">
        <div className="col-md-3">
            <select
      className="form-control"
      value={vsCurrency}
      onChange={(e) => setVsCurrency(e.target.value)}
    >
      <option value="usd">USD</option>
      <option value="eur">EUR</option>
      <option value="gbp">GBP</option>
      <option value="jpy">JPY</option>
      <option value="cad">CAD</option>
      <option value="aud">AUD</option>
      <option value="chf">CHF</option>
      <option value="inr">INR</option>
      <option value="cny">CNY</option>
      <option value="btc">BTC</option>
      <option value="eth">ETH</option>
    </select>
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

      {marketData && (
        <div className="row">
          {marketData.map((coin) => (
            <div key={coin.id} className="col-md-4 mb-4">
              <div className="card h-100">
                <div className="card-body">
                  <img src={coin.image} alt={coin.name} width={30} className="mb-2" />
                  <h5 className="card-title">
                    <Link to={`/coin/${coin.id}?currency=${vsCurrency}`} className="text-decoration-none">
                    {coin.name} ({coin.symbol.toUpperCase()})
                    </Link>
                  </h5>
                  <p className="card-text">
                    Price:{" "}
                    {coin.current_price.toLocaleString(undefined, {
                      style: "currency",
                      currency: vsCurrency.toUpperCase(),
                    })}
                  </p>
                  <p className="card-text">
                    Market Cap:{" "}
                    {coin.market_cap.toLocaleString(undefined, {
                      style: "currency",
                      currency: vsCurrency.toUpperCase(),
                    })}
                  </p>

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
