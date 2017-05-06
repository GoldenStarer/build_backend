let mongoose = require('mongoose');
let db = require('../lib/db');
let Schema = mongoose.Schema;

//申明一个mongoons对象
var NormSchema = new mongoose.Schema({
	// 文章标题
	title: {
		type: String,
		trim: true,
		unique: true
	},
	tag:[{
		type: String,
		trim: true,
		default: ''
	}],
	number : {
		type: String,
		default: ''
	},//规范编号
	industryId : {
		type: Schema.ObjectId,
		ref: 'Industry'
	},//行业id
	themeId : {
		type: Schema.ObjectId,
		ref: 'Theme'
	},//类别id
	industryIds : [{
		type: Schema.ObjectId,
		ref: 'Industry'
	}],//行业id
	themeIds : [{
		type: Schema.ObjectId,
		ref: 'Theme'
	}],//类别id
	img : {
		type: String,
		default: ''
	},
	// 文章标题
	name: {
		type: String,
		default: '',
		trim: true
	},
	// 文章内容
	content: {
		type: String, 
		default: ''
	},
	meta: {
		createAt: {
			type: Date,
			default: Date.now()
		},
		updateAt: {
			type: Date,
			default: Date.now()
		}
	}
})

//每次执行都会调用,时间更新操作
NormSchema.pre('save', function(next) {
	console.log('一次save');
	console.log(this.isNew);
	if(this.isNew) {
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	if(!this.name) {
		this.name = this.title;
	}
	next();
})

//查询的静态方法
NormSchema.statics = {
	fetch: function(cb) { //查询所有数据
		return this
			.find()
			.sort('meta.updateAt') //排序
			.exec(cb) //回调
	},
	findById: function(id, cb) { //根据id查询单条数据
		return this
			.findOne({ _id: id })
			.exec(cb)
	}
}

module.exports = NormSchema;