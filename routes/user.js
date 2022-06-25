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
userRouter.get('/:id', findById)
userRouter.put('/:id', auth, update)
userRouter.delete('/:id', auth, del)

module.exports = userRouter
