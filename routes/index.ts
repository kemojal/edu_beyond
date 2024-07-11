import { Router } from "express";
import { Express } from "express";
import { uploadRoutes } from "./upload";
// import { upload, rateLimiter } from "./middleware";

// const router = Router();

// router.get("/", (req, res) => {
//   res.json({ success: true });
// });

// router.post("/upload", rateLimiter, upload.single("file"), (req, res) => {
//   res.json({ success: true });
// });

// router.use((err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     return res.status(400).json({ error: err.message });
//   }
//   if (err) {
//     return res.status(400).json({ error: err.message });
//   }
//   next();
// });

// export default router;

export function useRoutes(app: Express) {
    uploadRoutes(app);
    // other routes 

}


