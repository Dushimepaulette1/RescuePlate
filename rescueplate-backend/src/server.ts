import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config();

const app: Application = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "success", message: "RescuePlate API is running" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
