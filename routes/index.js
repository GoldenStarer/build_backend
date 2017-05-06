var express = require('express');
var router = express.Router();
var IndustryModel = require('../modules/uploadFile'); //导入上传文件模块

//上传文件
router.get('', function(req, res, next) {
	res.status(404).render('404');
});

module.exports = router;