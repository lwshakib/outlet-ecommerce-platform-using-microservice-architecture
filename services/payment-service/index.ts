import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3008;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Payment Service is running!" });
});

app.get("/health", (req, res) => {
  res.json({ status: "Payment Service is healthy" });
});

app.listen(PORT, () => {
  console.log(`Payment service listening on port ${PORT}`);
});
