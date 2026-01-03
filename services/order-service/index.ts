import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3007;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Order Service is running!" });
});

app.get("/health", (req, res) => {
  res.json({ status: "Order Service is healthy" });
});

app.listen(PORT, () => {
  console.log(`Order service listening on port ${PORT}`);
});
