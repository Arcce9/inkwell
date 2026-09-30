// server/src/routes/stats.routes.js
//
// Same thin-route discipline as health.routes.js: no business logic
// here, just reading the in-memory counter the listener maintains.
import { Router } from "express";
import { PostStats } from "../stats/post-stats.js";

const router = Router();

router.get("/stats", (req, res) => {
  res.status(200).json({ totalPostsPublished: PostStats.getTotalPublished() });
});

export default router;
