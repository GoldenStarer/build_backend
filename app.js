var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ueditor = require("ueditor");
var winston = require('winston'),expressWinston = require('express-winston');
var app = express();

//chy
var mongoose = require('mongoose'); //导入mongoose模块
mongoose.connect('mongodb://localhost:27017/test') //连接本地数据库

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", 'http://localhost:8020');
	res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.header("Access-Control-Allow-Credentials", "true");
	res.header("X-Powered-By", ' 3.2.1');
	if(req.method === "OPTIONS") {
		res.sendStatus(200);
	} else {
		next();
	}
});


// 正常请求的日志
app.use(expressWinston.logger({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/success.log'
    })
  ]
}));

// 路由
app.use('/', require('./routes/index'));
app.use('/theme', require('./routes/theme'));
app.use('/industry', require('./routes/industry'));
app.use('/norm', require('./routes/norm'));
app.use('/ueditor/ue', ueditor(path.join(__dirname, 'public'),require('./routes/ueditor')));

// 错误请求的日志
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/error.log'
    })
  ]
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	console.log(404);
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};
	console.log(500);
	// render the error page
	//res.status(err.status || 500);
	//res.render('error');
	res.status(err.status || 500).json({
		result: err,
		msg: '服务器异常',
		code: 1
	});
});

	/*app.use(function (req, res, next) {
		return res.status(404).json({
			result: false,
			msg: '404 not found'
		});
	});
	app.use(function (err, req, res) {
		return res.status(500).json({
			result: false,
			msg: '500 server error'
		});
	});*/
	
module.exports = app;