const Router = require('koa-router')
const UploadFile = require('../service/file')

const router = new Router({ prefix: '/upload' })
const uploadFile = new UploadFile()

router.post('/',  uploadFile.upload)

module.exports = router