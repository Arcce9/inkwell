// server/src/repositories/post.repository.js

import { prisma } from "../db/client.js";

export const PostRepository = {
  create({ authorId, title, body, status, publishedAt }) {
    return prisma.post.create({
      data: {
        authorId,
        title,
        body,
        status,
        publishedAt,
      },
    });
  },

  async createWithTags({ authorId, title, body, status, publishedAt, tagNames = [] }) {
    return prisma.$transaction(async (tx) => {
      const post = await tx.post.create({
        data: { authorId, title, body, status, publishedAt },
      });

      if (tagNames.length > 0) {
        for (const name of tagNames) {
          await tx.tag.upsert({
            where: { name },
            update: {},
            create: { name },
          });
        }

        const tags = await tx.tag.findMany({ where: { name: { in: tagNames } } });

        await tx.postTag.createMany({
          data: tags.map((tag) => ({ postId: post.id, tagId: tag.id })),
        });
      }

      return tx.post.findUnique({
        where: { id: post.id },
        include: { tags: { include: { tag: true } } },
      });
    });
  },

  async findPublished({ page, pageSize }) {
    const rows = await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
      },
      orderBy: {
        publishedAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize + 1, // fetch one extra row to compute hasMore
    });

    const hasMore = rows.length > pageSize;

    return {
      posts: rows.slice(0, pageSize),
      hasMore,
    };
  },

  async searchPublished({ query, page, pageSize }) {
    const where = {
      status: "PUBLISHED",
      OR: [
        {
          title: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          body: {
            contains: query,
            mode: "insensitive",
          },
        },
      ],
    };

    const rows = await prisma.post.findMany({
      where,
      include: {
        author: { select: { id: true, displayName: true } },
      },
      orderBy: {
        publishedAt: "desc",
      },
      skip: (page - 1) * pageSize,
      take: pageSize + 1,
    });

    const hasMore = rows.length > pageSize;

    return {
      posts: rows.slice(0, pageSize),
      hasMore,
    };
  },
};