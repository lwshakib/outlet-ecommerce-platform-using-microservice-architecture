import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3006;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Cart Service is running!" });
});

app.get("/health", (req, res) => {
  res.json({ status: "Cart Service is healthy" });
});

app.listen(PORT, () => {
  console.log(`Cart service listening on port ${PORT}`);
});
