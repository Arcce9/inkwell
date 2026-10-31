
import { Router } from "express";
import { PostService } from "../services/post.service.js";
import { requireAuth } from "../middleware/auth.middleware.js";
const router = Router();

// server/src/routes/post.routes.js — AFTER (hardened)

// STRIDE: GET /api/posts (Denial of Service) — an unbounded pageSize lets a
// client force the DB/response to scale to whatever size it asks for.
// Clamp to a reasonable ceiling instead of trusting the client-supplied value.
const DEFAULT_PAGE_SIZE = 10;
const MAX_PAGE_SIZE = 50;

function resolvePageSize(rawPageSize) {
  const parsed = Number(rawPageSize);

  if (rawPageSize === undefined || !Number.isFinite(parsed) || parsed < 1) {
    return DEFAULT_PAGE_SIZE;
  }

  return Math.min(Math.floor(parsed), MAX_PAGE_SIZE);
}

router.post("/posts", requireAuth, async (req, res, next) => {
  try {
    // Never trust client-supplied identity fields.
    // Derive authorId from the authenticated request,
    // not from the request body.

    const post = await PostService.publish({
      ...req.body,
      authorId: req.user.id, // Set by requireAuth middleware from the verified JWT
    });

    res.status(201).json(post);
  } catch (err) {
    err.status = err.status || 400;
    next(err);
  }
});

// GET: List or search published posts
router.get("/posts", async (req, res, next) => {
  try {
    const { page = 1, pageSize, search } = req.query;
    const resolvedPageSize = resolvePageSize(pageSize);

    const result = search
      ? await PostService.search({
          query: search,
          page: Number(page),
          pageSize: resolvedPageSize,
        })
      : await PostService.listPublished({
          page: Number(page),
          pageSize: resolvedPageSize,
        });

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

// server/src/routes/post.routes.js — AFTER (fixed)

router.delete("/posts/:id", requireAuth, async (req, res, next) => {
  try {
    const post = await PostService.getById(req.params.id);

    if (!post) {
      return res.status(404).json({
        error: { code: "NOT_FOUND" },
      });
    }

    // A01's fix: Verify that the logged-in user owns the post
    // before allowing deletion.
    if (post.authorId !== req.user.id) {
      return res.status(403).json({
        error: { code: "FORBIDDEN" },
      });
    }

    await PostService.delete(req.params.id);

    return res.status(204).end();
  } catch (err) {
    next(err);
  }
});
export default router;
