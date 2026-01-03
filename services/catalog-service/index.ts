import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Catalog Service is running!" });
});

app.get("/health", (req, res) => {
  res.json({ status: "Catalog Service is healthy" });
});

app.listen(PORT, () => {
  console.log(`Catalog service listening on port ${PORT}`);
});
