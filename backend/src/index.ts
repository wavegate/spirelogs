import express from "express";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import corsOptions from "./middleware/corsOptions.js";

const app = express();

dotenv.config();

app.use(cors(corsOptions));

app.use(express.json());

app.enable("trust proxy");

app.use(
  session({
    secret: process.env.SECRET_KEY || "your_secret_key", // Use a secure secret in production
    resave: false, // Prevents session from being saved back to the session store if it wasn’t modified
    saveUninitialized: false, // Prevents empty sessions from being saved
    cookie: {
      secure: process.env.NODE_ENV === "production", // Set secure cookies in production
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    },
  })
);

const PORT = process.env.PORT || 3456;

// app.use("/auth", authRouter);
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
