import dotenv from "dotenv";
dotenv.config();
import express, { Application } from "express";
import cors from "cors";
import http from "http";
import connectDB from "./configs/db";
import authRoutes from "./routes/authRoutes";
import projectRoutes from "./routes/projectRoutes";
import skillRoutes from "./routes/skillRoutes";
import experienceRoutes from "./routes/experienceRoutes";
import { Server } from "socket.io";

const app: Application = express();
const PORT = process.env.PORT || 8000; // Default port if not specified

// Connect to MongoDB
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`A user connected with id: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected with id: ${socket.id}`);
  });

  socket.on("project-created", (createdProject) => {
    io.emit("project-created", createdProject);
  });

  socket.on("project-updated", (updatedProject) => {
    io.emit("project-updated", updatedProject);
  });

  socket.on("project-deleted", (deletedProject) => {
    io.emit("project-deleted", deletedProject);
  });

  socket.on("skill-updated", (updatedSkill) => {
    io.emit("skill-updated", updatedSkill);
  });

  socket.on("skill-deleted", (deletedSkillId) => {
    io.emit("skill-deleted", deletedSkillId);
  });

  socket.on("experience-created", (createdExperience) => {
    io.emit("experience-created", createdExperience);
  });

  socket.on("experience-updated", (updatedExperience) => {
    io.emit("experience-updated", updatedExperience);
  });

  socket.on("experience-deleted", (deletedExperience) => {
    io.emit("experience-deleted", deletedExperience);
  });

  socket.on("user-updated", (updatedUser) => {
    io.emit("user-updated", updatedUser);
  });
});

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/experiences", experienceRoutes);

server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

export { io };
