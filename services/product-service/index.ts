import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3009;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Product Service is running!" });
});

app.get("/health", (req, res) => {
  res.json({ status: "Product Service is healthy" });
});

app.listen(PORT, () => {
  console.log(`Product Service listening on port ${PORT}`);
});