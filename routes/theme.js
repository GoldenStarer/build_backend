var express = require('express');
var mongoose = require('mongoose'); //导入mongoose模块
var router = express.Router();
var ThemeModel = require('../modules/theme'); //导入模型数据模块

/* GET users listing. */
router.get('/', function(req, res, next) {
	res.send('respond with a theme resource');
});

router.get('/type/all', ThemeModel.findAll);//找出所有类别

router.get('/id/:postId', ThemeModel.findDataById);//找出类别id的所有行业

router.post('/save', ThemeModel.saveData);//新增类别

router.post('/modify', ThemeModel.modifyData);//修改类别名称

router.post('/del', ThemeModel.delData);//删除类别名称

router.get('/industrys', ThemeModel.getThemeIndustrys);

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