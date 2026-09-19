// Temporary in-memory database placeholder.
// Replace this module with the real Prisma client when persistence is added.

const users = [];
const posts = [];
let nextUserId = 1;
let nextPostId = 1;

export const prisma = {
  user: {
    async findUnique({ where }) {
      if (!where) return null;
      return (
        users.find((user) => {
          if (where.email) return user.email === where.email;
          if (where.id) return user.id === where.id;
          return false;
        }) ?? null
      );
    },
    async create({ data }) {
      const user = { id: String(nextUserId++), ...data };
      users.push(user);
      return user;
    },
  },
  post: {
    async create({ data }) {
      const post = { id: String(nextPostId++), ...data };
      posts.push(post);
      return post;
    },
    async findMany({ where, orderBy, skip = 0, take } = {}) {
      let result = [...posts];

      // Filter by status if provided
      if (where?.status) {
        result = result.filter((post) => post.status === where.status);
      }

      // Handle sorting safely if orderBy is provided
      if (orderBy) {
        const key = Object.keys(orderBy)[0];
        const direction = orderBy[key]; // expected 'asc' or 'desc'

        result.sort((a, b) => {
          const valA = new Date(a[key]).getTime() || a[key];
          const valB = new Date(b[key]).getTime() || b[key];

          if (valA < valB) return direction === 'asc' ? -1 : 1;
          if (valA > valB) return direction === 'asc' ? 1 : -1;
          return 0;
        });
      }

      // Handle pagination
      return result.slice(skip, take !== undefined ? skip + take : undefined);
    },
  },
};