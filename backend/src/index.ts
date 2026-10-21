import express from "express";

const app = express();

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

if (!process.env.VERCEL && !process.env.VITEST) {
  const port = Number(process.env.PORT) || 3000;
  app.listen(port, () => console.log(`API listening on port ${port}`));
}

export default app;