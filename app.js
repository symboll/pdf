const path = require('path')
const Koa = require('koa')
const { koaBody } = require('koa-body');
const koaStatic = require('koa-static')
const koaParameter = require('koa-parameter')
const error = require('koa-json-error')
const routing = require('./src/router')

const app = new Koa()


// 静态文件
app.use(koaStatic(path.join(__dirname,'public')))
// 上传文件
app.use(koaBody({
  multipart: true,   // 代表启用文件
  formidable: {
    uploadDir: path.join(__dirname,'/public/uploads'),   // 上传目录
    keepExtensions: true,   // 保留 扩展名
  }
}))
app.use(koaParameter(app))
routing(app)

module.exports = app



 

