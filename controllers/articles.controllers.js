const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  // create articles
  addArticle: async (req, res, next) => {
    try {
      let { title, content, createdAt, authorId } = req.body;

      let article = await prisma.articles.create({
        data: {
          title,
          content,
          createdAt: new Date(createdAt),
          updatedAt: new Date(),
          authorId,
        },
      });

      // success response
      res.status(201).json({
        status: true,
        message: 'Article created successfully',
        data: article,
      });
    } catch (error) {
      next(error);
    }
  },
};
