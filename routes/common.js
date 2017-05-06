var express = require('express');
var router = express.Router();
var uploadFileModel = require('../modules/uploadFile'); //导入上传文件模块

//上传文件
router.post('/upload', uploadFileModel.upload);
module.exports = router;