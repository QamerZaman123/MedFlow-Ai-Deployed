//Importing packages
import express from 'express'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import cors from 'cors'

//Importing Files
import connectDB from './Config/DBConfig.js'
import router from './Routes/Route.js'
import { ensureCollectionExists } from './Config/QdrantConfig.js'

dotenv.config()

const app = express();
const port = process.env.PORT || 3000;

// Render sits behind a reverse proxy. Trusting its first proxy keeps request
// protocol information correct in production.
app.set("trust proxy", 1);

const localOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001'
];

// Comma-separated production frontend origins, for example:
// FRONTEND_URLS=https://medflowai.vercel.app,https://www.medflowai.com
const configuredOrigins = (process.env.FRONTEND_URLS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const allowedOrigins = [
  ...new Set(
    process.env.NODE_ENV === "production"
      ? configuredOrigins
      : [...localOrigins, ...configuredOrigins]
  ),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permit same-server probes (Render) and explicit frontend origins only.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(cookieParser())

// Used by Render health checks and external uptime monitors.
app.get("/health", (req, res) => {
  res.status(200).json({ success: true, service: "medflowai-api", status: "healthy" });
});

app.use("/api", router);

// Initialize DB and Qdrant before starting server
const startServer = async () => {
  await connectDB();
  await ensureCollectionExists();

  app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
  });
};

startServer();
