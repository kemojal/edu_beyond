import express from "express";
import cors from "cors";
import config from "./config";
import { useRoutes } from "./routes";
import { rateLimiter } from "./middlewares";
import { Code, sendResponse } from "./utils";

const PORT = config.port;

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
  console.log("error", error);
  console.log("origin", origin);
  process.exit(1);
});

app.listen(PORT, () => {
  console.log(`🚀  Server is running on port ${PORT}`);
});

export default app;
