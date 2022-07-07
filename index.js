const path = require('path')
const Koa = require('koa')
const bobyParser = require('koa-bodyparser') // 请求体解析
const koaStatic = require('koa-static') // 提供静态资源服务
const cors = require('@koa/cors') // 跨域
const error = require('koa-json-error') // 处理错误
const parameter = require('koa-parameter') // 参数校验
const views = require('koa-views')
const routing = require('./routes')
const db = require('./db/')

const app = new Koa()

db.connect()

app.use(
	error({
		// 非生产环境，多返回一个stack(堆栈)
		postFormat: (e, { stack, ...rest }) => (process.env.NODE_ENV === 'production' ? rest : { stack, ...rest })
	})
)
app.use(bobyParser())
app.use(koaStatic(path.join(__dirname, 'static')))
app.use(cors())
app.use(parameter(app))
// 加载模板引擎
// 注意：配置模板引擎的代码需要移动到所有与路由相关的代码之前
app.use(
	views(path.join(__dirname, './views'), {
		extension: 'ejs'
	})
)
routing(app)

app.listen(3001, () => {
	console.log('3001端口已启动')
})
