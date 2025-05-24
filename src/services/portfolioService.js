
const API_URL = import.meta.env.VITE_API_URL;

export const getPortfolio = async (token) => {
  const res = await fetch(`${API_URL}/portfolio`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch portfolio");
  return res.json();
};

export const removeCoin = async (coinId, token) => {
  const res = await fetch(`${API_URL}/remove/${coinId}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to remove coin");
};

export const addToPortfolio = async (coinId, coinName, token) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const res = await fetch(`${API_URL}/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ coinId, coinName, amount: 1 }),
    });
  
    if (!res.ok) throw new Error("Failed to add to portfolio");
  };
  