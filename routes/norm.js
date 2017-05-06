var express = require('express');
var mongoose = require('mongoose'); //导入mongoose模块
var router = express.Router();
var NormModel = require('../modules/norm'); //导入模型数据模块

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a norm resource');
});

router.get('/type/all', NormModel.findAll);//找出所有规范

router.get('/id/:postId', NormModel.findNormById);//找出规范

router.post('/save', NormModel.createNorm);//增加一个规范

//router.get('/norms', NormModel.getIndustryNorms);

router.get('/pid/:id', NormModel.findNormsByPid);//找出专业id的所有规范

router.get('/search', NormModel.search);

module.exports = router;