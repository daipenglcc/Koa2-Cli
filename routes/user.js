const Router = require('koa-router')
const jwt = require('koa-jwt')
const { create, find, findById, update, delete: del } = require('../controllers/user')

const userRouter = new Router({ prefix: '/user' })
const { JWT_SECRET } = require('../config/')

// auth加入一层鉴权层(中间件-洋葱-鉴权层)
const auth = jwt({ JWT_SECRET })
const auth2 = async (ctx, next) => {
	if (ctx.url != 'aaa') {
		ctx.throw(401)
	}
	await next()
}

userRouter.post('/', create)
userRouter.get('/', find)
// userRouter.get('/:id', findById)
userRouter.put('/:id', auth, update)
userRouter.delete('/:id', auth, del)
// demo1
userRouter.get('/demo/:id', ctx => {
	ctx.status = 200
	ctx.body = ctx.params
})
// demo2
userRouter.get('/demo2', ctx => {
	// koa 错误处理中间件 koa-json-error
	// a.b
	// ctx.throw(412, '先决条件失败：id大于数据长度')
	ctx.verifyParams({
		name3: { type: 'string', required: true }
	})
	ctx.status = 200
	ctx.body = ctx.request.query
})
// demo3
userRouter.get('/demo3', ctx => {
	ctx.status = 200
	ctx.body = ctx.request.body
})
// demo4
userRouter.get('/demo4', ctx => {
	console.log('ctx.request.body', ctx.request.body)
	console.log('ctx.request.query', ctx.request.query)
	ctx.status = 200
	ctx.body = ctx.request.query
})

// view
// http://127.0.0.1:3000/user/view?name=123
userRouter.get('/view', async ctx => {
	ctx.verifyParams({
		name: { type: 'string', required: true }
	})
	await ctx.render('index', {
		title: ctx.request.query.name
	})
})

module.exports = userRouter
