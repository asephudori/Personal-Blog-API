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

  // update articles
  updateArticle: async (req, res, next) => {
    try {
      let { title, content, updatedAt, authorId } = req.body;
      let articleId = req.params;

      // validate articles
      let existingArticles = await prisma.articles.findUnique({
        where: {
          id: Number(articleId),
        },
      });

      // validate response
      if (!existingArticles) {
        return res.status(404).json({
          status: false,
          message: 'Bad request!',
          error: 'Articles not found!',
        });
      }

      let article = await prisma.articles.update({
        where: {
          id: Number(articleId),
        },
        data: {
          title,
          content,
          updatedAt,
          authorId,
        },
      });

      // success response
      return res.status(201).json({
        status: true,
        message: 'Article is updated!',
        data: article,
      });
    } catch (error) {
      next(error);
    }
  },
};
