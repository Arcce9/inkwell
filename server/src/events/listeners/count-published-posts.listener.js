// server/src/events/listeners/count-published-posts.listener.js
//
// A second post.published listener (alongside Section 2.3's logging
// listener) — proves listeners compose without touching PostService
// or each other.
import { EventBus } from "../event-bus.js";
import { PostStats } from "../../stats/post-stats.js";

EventBus.on("post.published", () => {
  PostStats.increment();
});
