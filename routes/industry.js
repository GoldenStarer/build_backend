var express = require('express');
var mongoose = require('mongoose'); //导入mongoose模块
var router = express.Router();
var IndustryModel = require('../modules/industry'); //导入模型数据模块

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a industry resource');
});

router.get('/type/all', IndustryModel.findAll);//找出所有类别

router.get('/id/:postId', IndustryModel.findDataById);//找出类别id的所有规范

router.post('/save', IndustryModel.createIndustry);//增加一个行业

router.get('/norms', IndustryModel.getIndustryNorms);

router.get('/pid/:id', IndustryModel.findPidsById);

router.post('/del', IndustryModel.delData);//删除行业

router.post('/delTheme', IndustryModel.delTheme);//删除父级类别

router.post('/modify', IndustryModel.modifyData);//修改类别名称

router.post('/upload', IndustryModel.uploadFile);//上传图片

module.exports = router;

/*var gnr = new Band({
      name: "Guns N' Roses",
      members: ['Axl', 'Slash']
    });

    var promise = gnr.save();
    assert.ok(promise instanceof require('mpromise'));

    promise.then(function (doc) {
      assert.equal(doc.name, "Guns N' Roses");
    });
*/