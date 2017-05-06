var http = require('http');
var fs = require('fs');
var cheerio = require('cheerio');
var request = require('request');
var iconv = require('iconv-lite');
var firstPage = page = 1111;
var url = "http://jandan.net/ooxx/page-";
//初始url 

function startRequest(x) {
	//采用http模块向服务器发起一次get请求      
	http.get(x, function(res) {
		var html = ''; //用来存储请求网页的整个html内容
		var titles = [];
		res.setEncoding('utf-8'); //防止中文乱码
		//监听data事件，每次取一块数据
		res.on('data', function(chunk) {
			html += chunk;
		});
		//监听end事件，如果整个网页内容的html都获取完毕，就执行回调函数
		res.on('end', function() {
			var $ = cheerio.load(html);
			var list = [];
			$('.commentlist li').each(function(index, item) {
				var link = $(this).find('.text p a.view_img_link').attr('href');
				var vote1 = vote2 = 0;
				$(this).find('.text .vote span').each(function(id, li) {
					if($(li).attr('id').indexOf('cos_support')>-1){
						vote1 = $(li).text().trim();//支持数
					}
					if($(li).attr('id').indexOf('cos_unsupport')>-1){
						vote2 = $(li).text().trim();//不支持数
					}
				});
				list.push({
					url:link,
					vote1:vote1,
					vote2:vote2
				});
			});
			console.log(list);
			
			savedContent($, JSON.stringify(list),page); //存储每篇文章的内容及文章标题
			page +=1;

			if(page-firstPage<10) {
				startRequest(url+page);
			}

		});

	}).on('error', function(err) {
		console.log(err);
	});

}
//该函数的作用：在本地存储所爬取的新闻内容资源
function savedContent($, txt,page) {
	fs.appendFile("new/bb_"+page+".txt",txt,function (err) {
		if (err) console.log(err);
		console.log("File "+page+" Saved !"); //文件被保存
	});
}

startRequest(url+page); //主程序开始运行