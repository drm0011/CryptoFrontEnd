const API_URL = import.meta.env.VITE_API_URL;

export const fetchNotes = async (token) => {
  const res = await fetch(`${API_URL}/notes`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
};

export const saveNote = async (coinId, note, token) => {
  const res = await fetch(`${API_URL}/note`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ coinId, note }),
  });
  if (!res.ok) throw new Error("Failed to save note");
};
