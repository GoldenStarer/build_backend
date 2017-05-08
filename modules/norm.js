let mongoose = require('mongoose');
let IndustrySchema = require('../schemas/industry'); //拿到导出的数据集模块
let Industry = mongoose.model('Industry', IndustrySchema); // 编译生成Movie模型
let ThemeSchema = require('../schemas/theme'); //拿到导出的数据集模块
let Theme = mongoose.model('Theme', ThemeSchema); // 编译生成Movie 模型
let NormSchema = require('../schemas/norm'); //拿到导出的数据集模块
let Norm = mongoose.model('Norm', NormSchema); // 编译生成Movie 模型

module.exports = {
	findAll: function(req, res, next) {
		Norm.find()
			.populate('industryIds', '_id name')
			.populate('themeIds', '_id name')
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
	findNormsByPid: function(req, res, next) {
		Norm.find({
				pid: req.params.id
			})
			.sort({
				_id: -1
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
	findNormById: function(req, res, next) {
		Industry.findOne({
				id: req.params.postId
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
	createNorm: function(req, res, next) {
		let themeList=req.body.themeList?req.body.themeList:[],
    		industryList=req.body.industryList?req.body.industryList:[];
		let qdata = {
			title:req.body.title,
    		number:req.body.number,
    		content:req.body.content,
    		industryIds:[],
    		themeIds:[]
		};
		if(!qdata.title){
    		return res.status(200).json({
				result: '',
				msg: "标题不能为空",
				code: 1
			});
    	}
    	if(!qdata.content){
    		return res.status(200).json({
				result: '',
				msg: "内容不能为空",
				code: 1
			});
    	}
		
		if(themeList.length>0){
			for(var i=0,len=themeList.length;i<len;i++){
				if(themeList[i] && themeList[i]!='0')
				qdata.themeIds.push(mongoose.Types.ObjectId(themeList[i]));
			}
		}
		if(industryList.length>0){
			for(var i=0,len=industryList.length;i<len;i++){
				if(industryList[i] && industryList[i]!='0')
				qdata.industryIds.push(mongoose.Types.ObjectId(industryList[i]));
			}
		}
		
		Norm.findOne({title:qdata.title}, function(err, result) {
			if(err) {
				return next(err);
			}
			if(!result) {
				var node = new Norm(qdata);
				console.log(qdata);
				console.log(node);
				
				node.save(function(err) {
					if(err) {
						return res.status(500).json({
							result: err,
							msg: '保存失败',
							code: 1
						});
					}
					return res.status(200).json({
						result: null,
						msg: '保存成功',
						code: 0
					});
				})
			}else{
				return res.status(200).json({
					result: null,
					msg: '保存失败，已存在，不能重复',
					code: 1
				});
			}
		})
    },
	modifyData:function(req, res, next){//修改name: id:id,img:img
		let themeList=req.body.themeList?req.body.themeList:[],
    		industryList=req.body.industryList?req.body.industryList:[];
		let qdata = {
			title: req.body.title,
			id:req.body.id,
			img:req.body.img,
			content:req.body.content,
			industryIds:[],
    		themeIds:[]
		};//post 是req.body

		if(!qdata.title){
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

		if(themeList.length>0){
			for(var i=0,len=themeList.length;i<len;i++){
				if(themeList[i] && themeList[i]!='0')
				qdata.themeIds.push(mongoose.Types.ObjectId(themeList[i]));
			}
		}
		if(industryList.length>0){
			for(var i=0,len=industryList.length;i<len;i++){
				if(industryList[i] && industryList[i]!='0')
				qdata.industryIds.push(mongoose.Types.ObjectId(industryList[i]));
			}
		}
		
		Norm.findOne({_id:qdata.id}, function(err, result) {
			if(err) {
				return next(err);
			}
			let oldValue  = {_id:qdata.id};
			let newData = {'$set':qdata};
			Norm.update(oldValue,newData,function(err,res1){
				if(err) {
					return next(err);
				}
				return res.status(200).json({
					result: null,
					msg: '保存成功',
					code: 0
				});
			})
		})
	},
	search: function(req, res, next) {
		let val = req.query.value;
		Norm.find()
			.$where('this.name.indexOf("' + val + '")>-1')
			//.$where('this.name.indexOf("'+val+'")>-1||this.name.indexOf("'+val+'")==-1')
			//find( {"$where" :  "this.x + this.y === 10"})
			//find( {"$where" : " function(){ return this.x + this.y ===10; }"})
			.limit(10) //限制10条记录
			.sort({
				_id: -1
			}) //排序
			/*.select('name occupation')*/
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
	}

	/*var User = require("./user.js");
	function getByPager(){
	    
	    var pageSize = 5;                   //一页多少条
	    var currentPage = 1;                //当前第几页
	    var sort = {'logindate':-1};        //排序（按登录时间倒序）
	    var condition = {};                 //条件
	    var skipnum = (currentPage - 1) * pageSize;   //跳过数
	    
	    User.find(condition).skip(skipnum).limit(pageSize).sort(sort).exec(function (err, res) {
	        if (err) {
	            console.log("Error:" + err);
	        }
	        else {
	            console.log("Res:" + res);
	        }
	    })
	}
	getByPager();
	mongoexport -d test -c themes -o file.json --type json -f field
	* */
	
};