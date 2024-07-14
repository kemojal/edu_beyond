import express from "express";
import cors from "cors";
import { useRoutes } from "./routes";
import { Code, sendResponse } from "./utils";
import { rateLimiter } from "./middlewares/rateLimiter";
import logger from "./utils/logger";

const app = express();
app.use(
  cors({
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(rateLimiter); // apply rate limiter middleware to all routes

useRoutes(app);

app.get("/", (req, res) => {
  sendResponse(res, Code.Ok, { success: true });
});
app.use((req, res) => {
  sendResponse(res, Code.NotFound, { success: false, message: "Not found" });
});

process.on("uncaughtException", function (error, origin) {
  logger.error(`💥❌ error: ${error.message}`, { error });
  logger.info(`origin: ${origin}`);
  process.exit(1);
});
export default app;
