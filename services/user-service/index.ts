import "dotenv/config";
import express from "express";
import cors from "cors";
import userRoutes from "./src/routes/user.routes";

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "User Service is healthy" });
});

// User routes
app.use("/users", userRoutes);

app.listen(PORT, () => {
  console.log(`User service listening on port ${PORT}`);
});