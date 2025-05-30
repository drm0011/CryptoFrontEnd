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

export const fetchCoinInfo = async (id, token) => {
  const res = await fetch(`${API_URL}/coininfo?id=${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Failed to fetch coin info");
  return res.json();
};

export const fetchCoinChart = async (id, token) => {
  const res = await fetch(`${API_URL}/coincandles?id=${id}&vsCurrency=usd&days=7`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) throw new Error("Failed to fetch coin chart");
  return res.json();
};