import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

export default function App() {
  const [status, setStatus] = useState("Checking the API...");

  useEffect(() => {
    fetch(`${API}/health`)
      .then((res) => res.json())
      .then((data) => setStatus(data.ok ? "API is up" : "API returned an error"))
      .catch(() => setStatus("Cannot reach the API"));
  }, []);

  return (
    <main>
      <h1>cric11</h1>
      <p>{status}</p>
    </main>
  );
}