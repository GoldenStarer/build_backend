let config = require('config-lite');
var mongoose = require('mongoose');
var dbConfig = {
	url: config.db_url,
	collection: config.db_collection
};
var db = mongoose.createConnection(dbConfig.url, dbConfig.collection); //创建一个数据库连接
db.on('error', console.error.bind(console, '连接错误:'));
db.once('open', function() {
	console.log('一次打开记录');//一次打开记录
});
module.exports = db;