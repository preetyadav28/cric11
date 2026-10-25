import express from "express";
import cors from "cors";

const app = express();

const allowedOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(cors({ origin: allowedOrigins }));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

if (!process.env.VERCEL && !process.env.VITEST) {
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => console.log(`API listening on port ${port}`));
}

export default app;