import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Inventory Service is running!" });
});

app.get("/health", (req, res) => {
  res.json({ status: "Inventory Service is healthy" });
});

app.listen(PORT, () => {
  console.log(`Inventory service listening on port ${PORT}`);
});
