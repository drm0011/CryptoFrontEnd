import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchCoinInfo, fetchCoinChart } from "../services/marketService";
import { useParams, useSearchParams } from "react-router-dom";
import { addToPortfolio } from "../services/portfolioService";
import { toast } from 'react-toastify';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CoinDetail = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);
  const [searchParams] = useSearchParams();
  const vsCurrency = searchParams.get("currency") || "usd";

  useEffect(() => {
    if (!id || !token) return;

    const loadData = async () => {
      try {
        const coinData = await fetchCoinInfo(id, token, vsCurrency);
        const chartRaw = await fetchCoinChart(id, token, vsCurrency);

        const formattedChart = chartRaw.prices.map(([timestamp, price]) => ({
          time: new Date(timestamp).toLocaleDateString(),
          price,
        }));

        setCoin(coinData);
        setChartData(formattedChart);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load coin data.");
      }
    };

    loadData();
  }, [id, token]);

  // Optional: reset error and added state when switching coins
  useEffect(() => {
    setError(null);
    setAdded(false);
  }, [id]);

  const handleAddToPortfolio = async () => {
    if (!token || !coin) return;
    try {
      await addToPortfolio(coin.id, coin.name, token);
      setAdded(true);
      toast.success("Added to portfolio!");
    } catch (err) {
      toast.error("Failed to add coin to your portfolio.");
    }
  };

  if (!token)
    return <p className="text-center mt-4">Please log in to view coin details.</p>;
  if (error && !added)
    return <p className="text-danger">{error}</p>;
  if (!coin) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <div className="d-flex align-items-center mb-3">
        <img
          src={coin.image}
          alt={coin.name}
          className="me-2"
          style={{ width: "32px", height: "32px" }}
        />
        <h2>
          {coin.name} ({coin.symbol.toUpperCase()})
        </h2>
      </div>

      <p>
  Price:{" "}
  {coin.price.toLocaleString(undefined, {
    style: "currency",
    currency: vsCurrency.toUpperCase(),
  })}
</p>
<p>
  Market Cap:{" "}
  {coin.marketCap.toLocaleString(undefined, {
    style: "currency",
    currency: vsCurrency.toUpperCase(),
  })}
</p>

      <p className={coin.change24h >= 0 ? "text-success" : "text-danger"}>
        24h Change: {coin.change24h.toFixed(2)}%
      </p>

      {/* Error message (only if not a load error) */}
      {error && added === false && (
        <p className="text-danger">{error}</p>
      )}

      <div className="mt-3">
        <button
          className="btn btn-sm btn-primary"
          onClick={handleAddToPortfolio}
          disabled={added}
        >
          {added ? "Added to Portfolio" : "Add to Portfolio"}
        </button>
      </div>

      <h4 className="mt-4">7-Day Price Chart</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="time" />
          <YAxis domain={["auto", "auto"]} />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#007bff"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CoinDetail;
