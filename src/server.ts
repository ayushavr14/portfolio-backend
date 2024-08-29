import express, { Application } from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import connectDB from "./config/db";
import authRoutes from "./routes/authRoutes";
import projectRoutes from "./routes/projectRoutes";
import skillRoutes from "./routes/skillRoutes";
import experienceRoutes from "./routes/experienceRoutes";
import { Server } from "socket.io";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
const server = http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/experiences", experienceRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { io };
