// server/src/routes/post.routes.js
//
// Wires PostService's publish() and listPublished() to
// the API contract's POST /api/posts and GET /api/posts (Lecture 4).
// Same thin-route discipline as auth.routes.js: no business rules here.

import { Router } from "express";
import { PostService } from "../services/post.service.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

router.post("/posts", authenticate, async (req, res) => {
  try {
    const { title, body, tagNames } = req.body;
    const post = await PostService.publish({ authorId: req.user.id, title, body, tagNames });
    res.status(201).json(post);
  } catch (err) {
    res.status(400).json({
      error: { code: err.code || "VALIDATION_ERROR", message: err.message },
    });
  }
});

router.get("/posts", async (req, res, next) => {
  try {
    const { page = 1, search } = req.query;
    const result = search
      ? await PostService.search({ query: search, page: Number(page) })
      : await PostService.listPublished({ page: Number(page) });
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});


export default router;