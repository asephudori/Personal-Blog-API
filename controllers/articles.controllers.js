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
      return res.status(200).json({
        status: true,
        message: 'Article is updated!',
        data: article,
      });
    } catch (error) {
      next(error);
    }
  },

  // Update article publish status
  updatePublishStatus: async (req, res, next) => {
    try {
      let articleId = req.params;

      // validate articles
      let isExist = await prisma.articles.findUnique({
        where: { id: Number(articleId) },
      });

      if (!isExist) {
        return res.status(404).json({
          status: false,
          message: 'Bad request!',
          error: 'Article not found!',
        });
      }

      // update publish status
      let updateArticle = await prisma.articles.update({
        where: { id: Number(articleId) },
        data: { published: true },
      });

      return res.status(200).json({
        status: true,
        message: 'Publish status has been updated!',
        data: updateArticle,
      });
    } catch (error) {
      next(error);
    }
  },

  // delete articles
  deleteArticle: async (req, res, next) => {
    try {
      let articleId = req.params;

      // validate article
      let isExist = await prisma.articles.findUnique({
        where: { id: Number(articleId) },
      });

      if (!isExist) {
        return res.status(404).json({
          status: false,
          message: 'Bad request!',
          error: 'Article not found!',
        });
      }

      // delete articles
      let deleteArticle = await prisma.articles.delete({
        where: { id: Number(articleId) },
      });

      return res.status(200).json({
        status: true,
        message: 'Article has been deleted!',
        data: deleteArticle,
      });

    } catch (error) {
      next(error);
    }
  },

  // searching articles
  findArticles: async (req, res, next) => {
    try {
      let { title, content, authorName } = req.query;

      let articles = await prisma.articles.findMany({
        where: {
          OR: [
            {
              title: {
                contains: title,
                mode: 'insensitive',
              },
            },
            {
              content: {
                contains: content,
                mode: 'insensitive',
              },
            },
            {
              author: {
                name: {
                  contains: authorName,
                  mode: 'insensitive',
                },
              },
            },
          ],
        },
        include: {
          author: true,
        },
      });

      if (articles.length === 0) {
        return res.status(404).json({
          status: false,
          message: 'Bad request!',
          error: 'No articles found matching the criteria',
        });
      }

      return res.status(200).json({
        status: true,
        message: 'Articles found successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
