import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchCoinInfo, fetchCoinChart } from "../services/marketService";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const CoinDetail = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [coin, setCoin] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id || !token) return;

    const loadData = async () => {
      try {
        const coinData = await fetchCoinInfo(id, token);
        const chartRaw = await fetchCoinChart(id, token);

        const formattedChart = chartRaw.prices.map(([timestamp, price]) => ({
          time: new Date(timestamp).toLocaleDateString(),
          price,
        }));

        setCoin(coinData);
        setChartData(formattedChart);
      } catch (err) {
        console.error(err);
        setError("Failed to load coin data");
      }
    };

    loadData();
  }, [id, token]);

  if (!token) return <p className="text-center mt-4">Please log in to view coin details.</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!coin) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <div className="d-flex align-items-center mb-3">
        <img src={coin.image} alt={coin.name} className="me-2" />
        <h2>{coin.name} ({coin.symbol.toUpperCase()})</h2>
      </div>
      <p>Price: ${coin.price.toFixed(2)}</p>
      <p>Market Cap: ${coin.marketCap.toLocaleString()}</p>
      <p className={coin.change24h >= 0 ? "text-success" : "text-danger"}>
        24h Change: {coin.change24h.toFixed(2)}%
      </p>

      <h4 className="mt-4">7-Day Price Chart</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <XAxis dataKey="time" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#007bff" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CoinDetail;
