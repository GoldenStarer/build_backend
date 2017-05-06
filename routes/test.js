var express = require('express');
var router = express.Router();

// GET /posts/:postId/edit 更新文章页
router.get('/:postId/edit', checkLogin, function(req, res, next) {
	var postId = req.params.postId;
	var author = req.session.user._id;

	PostModel.getRawPostById(postId)
		.then(function(post) {
			if(!post) {
				throw new Error('该文章不存在');
			}
			if(author.toString() !== post.author._id.toString()) {
				throw new Error('权限不足');
			}
			res.render('edit', {
				post: post
			});
		})
		.catch(next);
});

module.exports = router;