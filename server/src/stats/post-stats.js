// server/src/stats/post-stats.js
//
// In-memory counter of total posts published. Resets on process
// restart — fine for now, since nothing yet needs it to survive one.
let totalPublished = 0;

export const PostStats = {
  increment() {
    totalPublished += 1;
  },

  getTotalPublished() {
    return totalPublished;
  },
};
