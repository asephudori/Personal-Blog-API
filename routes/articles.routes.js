const Router = require('express');
const {
  addArticle,
  updateArticle,
  updatePublishStatus,
  deleteArticle,
  findArticles,
  getAllArticles,
} = require('../controllers/articles.controllers');

const articleRouter = Router();

articleRouter.post('/post', addArticle);
articleRouter.put('/update/:article_id', updateArticle);
articleRouter.patch('/update-publish-status/:article_id', updatePublishStatus);
articleRouter.delete('/delete/:article_id', deleteArticle);
articleRouter.get('/search', findArticles);
articleRouter.get('/', getAllArticles);

module.exports = articleRouter;
