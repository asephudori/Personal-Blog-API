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
articleRouter.put('/update/:id', updateArticle);
articleRouter.patch('/update-publish-status/:id', updatePublishStatus);
articleRouter.delete('/delete/:id', deleteArticle);
articleRouter.get('/search', findArticles);
articleRouter.get('/', getAllArticles);

module.exports = articleRouter;
