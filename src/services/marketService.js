const API_URL = import.meta.env.VITE_API_URL;

export const getMarketData = async (token, vsCurrency, perPage, page) => {
  const res = await fetch(
    `${API_URL}/market?vsCurrency=${vsCurrency}&perPage=${perPage}&page=${page}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) throw new Error("Failed to fetch market data");
  return res.json();
};