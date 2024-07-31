const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const pagination = require('../helper/pagination');

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
          published: false
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
      let articleId = parseInt (req.params.id);

      // validate articles
      let existingArticles = await prisma.articles.findUnique({
        where: {
          id: articleId,
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
          id: articleId,
        },
        data: {
          title,
          content,
          updatedAt: new Date().toISOString(), // Correct ISO-8601 format
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
    // Extract articleId from req.params
    let articleId = parseInt(req.params.id, 10);

    // Validate article existence
    let isExist = await prisma.articles.findUnique({
      where: { id: articleId },
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

  // searching articles with pagination
  findArticles: async (req, res, next) => {
    try {
      let { title, content, authorName, page = 1, limit = 8 } = req.query;
      page = parseInt(page);
      limit = parseInt(limit);

      let skip = (page - 1) * limit;

      let withPagination = {
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
      };

      let articles = await prisma.articles.findMany({
        where: withPagination,
        include: {
          author: true,
        },
        skip: skip,
        limit: limit,
      });

      // count total articles matching the criteria
      let count = await prisma.articles.count({ where: withPagination });

      if (articles.length === 0) {
        return res.status(404).json({
          status: false,
          message: 'Bad request!',
          error: 'No articles found matching the criteria',
        });
      }

      // get pagination links
      let paginationResult = pagination.getPagination(
        req,
        res,
        count,
        page,
        limit
      );

      return res.status(200).json({
        status: true,
        message: 'Articles found successfully',
        data: articles,
        pagination: paginationResult,
      });
    } catch (error) {
      next(error);
    }
  },

  // all articles without pagination
  getAllArticles: async (req, res, next) => {
    try {
      let getAllArticles = await prisma.articles.findMany({
        include: {
          author: true,
        },
      });

      if (getAllArticles.length === 0) {
        return res.status(404).json({
          status: false,
          message: 'No articles found',
          data: null,
        });
      }

      return res.status(200).json({
        status: true,
        message: 'Article successfully found',
        data: getAllArticles,
      });
    } catch (error) {
      next(error);
    }
  },
};
