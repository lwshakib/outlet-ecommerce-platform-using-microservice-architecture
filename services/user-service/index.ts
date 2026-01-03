import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "User Service is running!" });
});

app.get("/health", (req, res) => {
  res.json({ status: "User Service is healthy" });
});

app.listen(PORT, () => {
  console.log(`User service listening on port ${PORT}`);
});