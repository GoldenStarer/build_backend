var mongoose = require('mongoose')
var IndustrySchema = require('../schemas/industry') //拿到导出的数据集模块
var Industry = mongoose.model('Industry', IndustrySchema) // 编译生成Movie 模型
var ThemeSchema = require('../schemas/theme') //拿到导出的数据集模块
var Theme = mongoose.model('Theme', ThemeSchema) // 编译生成Movie 模型
var formidable = require("formidable");
var fs = require('fs');
var uploadfile = require('./uploadFile') //上传文件模块
var config = require('config-lite');

module.exports = {
	findAll: function(req, res, next) {
		Industry.find()
			.populate('list', '_id name')
			.populate('pids', '_id name')
			.sort({
				_id: -1
			}) //排序
			//.sort({'meta.updateAt': 'desc'})
			.exec(function(err, data) {
				if(err) {
					return next(err);
				}
				return res.status(200).json({
					result: data,
					msg: "成功",
					code: 0
				});
			});
	},
	findPidsById: function(req, res, next) { //通过id找到所有父级类别
		let id = req.body.id;
		let sid = mongoose.Types.ObjectId(id);
		Industry.findOne({
				_id: sid
			})
			.populate('pids', '_id name')
			.exec(function(err, data) {
				if(err) {
					return next(err);
				}
				return res.status(200).json({
					result: data,
					msg: "成功",
					code: 0
				});
			});
	},
	findDataById: function(req, res, next) {
		let id = req.params.id;
		let sid = mongoose.Types.ObjectId(id);
		Industry.findOne({
				_id: sid
			})
			.exec(function(err, data) {
				if(err) {
					return next(err);
				}
				return res.status(200).json({
					result: data,
					msg: "成功",
					code: 0
				});
			});
	},
	createIndustry: function(req, res, next) {
		let qdata = {
			name: req.body.name,
			pid:req.body.pid,
			img:req.body.img
		};//post 是req.body

		if(!qdata.name){
			return res.status(200).json({
				result: null,
				msg: '名称不能为空',
				code: 1
			});
		}
		if(!qdata.img){
			return res.status(200).json({
				result: null,
				msg: '图片不能为空',
				code: 1
			});
		}
		console.log(qdata.pid);
		let pid = (qdata.pid && qdata.pid!=0)?mongoose.Types.ObjectId(qdata.pid):null;
		let a = {
			name: qdata.name
		};
		Industry.findOne(a, function(err, result) {
			if(err) {
				return next(err);
			}
			if(!result) {
				
				var node = new Industry(qdata);
				
				node.save(function(err) {
					if(err) {
						return res.status(500).json({
							result: null,
							msg: '保存失败',
							code: 1
						});
					}
					if(pid){
						console.log(pid);
						Industry.update({
							_id: node._id
						}, {
							'$addToSet': {
								pids: pid
							}
						}, function(err, re) {
							if(err) {
								return next(err);
							}
							return res.status(200).json({
								result: re,
								msg: '保存成功',
								code: 0
							});
						})
					}else{
						return res.status(200).json({
								result: null,
								msg: '保存成功',
								code: 0
							});
					}
				});
			} else {
				return res.status(200).json({
					result: null,
					msg: '保存失败，已存在，不能重复',
					code: 1
				});
			}
		});
	},
	getIndustryNorms: function(req, res, next) {
		if(!req.body.id){
			return res.status(200).json({
				result: null,
				msg: 'id不能为空',
				code: 1
			});
		}
		let id = mongoose.Types.ObjectId(req.body.id);
		Industry.findOne({
				id: id
			})
			.populate('list', '_id name title content number img')
			.exec(function(err, industry) {
				if(err) {
					return next(err);
				}
				if(!industry) {
					return next();
				}

				return res.status(200).json({
					result: industry,
					msg: "成功",
					code: 0
				});
			})
	},
	modifyData:function(req, res, next){//修改行业name: id:id,img:img,pid:pid
		let qdata = {
			name: req.body.name,
			id:req.body.id,
			pid:req.body.pid,
			img:req.body.img
		};//post 是req.body

		if(!qdata.name){
			return res.status(200).json({
				result: null,
				msg: '名称不能为空',
				code: 1
			});
		}
		if(!qdata.id){
			return res.status(200).json({
				result: null,
				msg: '保存失败，没有该类别',
				code: 1
			});
		}
		if(!qdata.img){
			return res.status(200).json({
				result: null,
				msg: '图片不能为空',
				code: 1
			});
		}
		let id = mongoose.Types.ObjectId(qdata.id);
		let pid = (qdata.pid && qdata.pid!=0)?mongoose.Types.ObjectId(qdata.pid):null;
		Industry.findOne({_id: id}, function (err, result) {
			if(err){
				return next(err);
			}
			if(!result){
				return res.status(200).json({
					result: null,
					msg: '保存失败，不存在该类别',
					code: 1
				});
			}else{
				let oldValue  = {name:result.name,img:result.img};
				let newData = {'$set':{name:qdata.name,img:qdata.img}};
				// 多条件更新 var newData = {$set:{name:"内容",age:2}};
				Industry.update(oldValue,newData,function(err,res1){
					if(err){
						return next(err);
					}
					if(pid){
						console.log(1234);
						console.log(result._id);
						Industry.update({_id: id}, {
							'$addToSet': {
								pids: pid
							}
						}, function(err, re) {
							if(err) {
								return next(err);
							}
							return res.status(200).json({
								result: re,
								msg: '保存成功',
								code: 0
							});
						})
					}else{
						console.log(12341);
						return res.status(200).json({
								result: null,
								msg: '保存成功',
								code: 0
							});
					}
				});
			}
		});
	},
	delData: function(req, res, next) { //删除行业
		let qdata = {
			id: req.body.id
		}; //post 是req.body
		let id = mongoose.Types.ObjectId(qdata.id);

		if(!qdata.id) {
			return res.status(200).json({
				result: null,
				msg: '删除失败，没有该类别',
				code: 1
			});
		}
		// 要删除的条件
		var del = {
			_id: id
		};
		Industry.remove(del, function(err, result) {
			if(err) {
				return res.status(200).json({
					result: result,
					msg: '删除失败，不存在该类别',
					code: 1
				});
			} else {
				return res.status(200).json({
					result: result,
					msg: "删除成功",
					code: 0
				});
			}
		});
	},
	delTheme: function(req, res, next) { //删除行业类别
		let qdata = {
			id: req.body.id,
			pid: req.body.pid
		}; //post 是req.body

		if(!qdata.id || !qdata.pid) {
			return res.status(200).json({
				result: null,
				msg: '删除失败，没有该类别',
				code: 1
			});
		}
		let id = mongoose.Types.ObjectId(qdata.id);
		let pid = mongoose.Types.ObjectId(qdata.pid);
		// 要删除的条件
		var del = {
			_id: id
		};
		Industry.update(del, {'$pull':{'pids':pid}},function(err, result) {
			if(err) {
				return res.status(200).json({
					result: result,
					msg: '删除失败，不存在该类别',
					code: 1
				});
			} else {
				return res.status(200).json({
					result: result,
					msg: "删除成功",
					code: 0
				});
			}
		});
	},
	uploadFile: function (req, res, next) {
		function callback (uploadFolderName, fileName) {
			return res.status(200).json({
				result: config.server + uploadFolderName + '/' + fileName,
				msg: "上传成功",
				code: 0
			});
		}
		uploadfile.upload(req, res, next, callback);
	}
};