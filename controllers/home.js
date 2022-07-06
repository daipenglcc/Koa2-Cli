const jwt = require('jsonwebtoken')
const assert = require('http-assert')
const cheerio = require('cheerio')
const charset = require('superagent-charset')
const superagent = charset(require('superagent'))
const fs = require('fs')
const request = require('request')
const User = require('../models/User')

const { JWT_SECRET } = require('../config/')

class HomeController {
	static async home(ctx) {
		// ctx.body = 'data21122222222222222'
		// return
		// ctx.body = 'hello world, I am build by docker and jenkins'
		// getData
		// 	.then(data => {
		// 		ctx.body = data
		// 	})
		// 	.catch(err => {
		// 		console.log(err)
		// 	})
		let data = await getData
		try {
			ctx.body = data
		} catch (err) {
			console.log(err)
		}
	}
	static async login(ctx) {
		const { username, password } = ctx.request.body

		// 1.根据用户名找用户
		const user = await User.findOne({ username }).select('+password')
		// console.log('user', user)
		assert(user, 422, '用户不存在')
		// 2.校验密码
		const isValid = require('bcrypt').compareSync(password, user.password)
		assert(isValid, 422, '密码错误')
		const token = jwt.sign({ id: user._id }, JWT_SECRET)
		ctx.body = { token }
	}
	static async register(ctx) {
		ctx.body = 'Register Controller'
	}
}

// let arr = []
// router.get('/', (ctx, next) => {
// 	url = 'http://shop.bytravel.cn/produce/index226.html' //target地址
// 	superagent
// 		.get(url)
// 		.charset('gbk') // 当前页面编码格式
// 		.buffer(true)
// 		.end((err, data) => {
// 			//页面获取到的数据
// 			if (err) {
// 				// return next(err);
// 				console.log('页面不存在', err)
// 			}
// 			let html = data.text,
// 				$ = cheerio.load(html, {
// 					decodeEntities: false,
// 					ignoreWhitespace: false,
// 					xmlMode: false,
// 					lowerCaseTags: false
// 				}) //用cheerio解析页面数据
// 			// cheerio的使用类似jquery的操作
// 			$('table tbody').each((index, element) => {
// 				let $element = $(element)
// 				$element.find('#tctitle').next().find('a').addClass('link').attr('class', 'link').text('')
// 				arr.push({
// 					title: $element.find('a.blue14b').text(),
// 					image: $element.find('#bright img').attr('src'),
// 					summary: $element.find('#tctitle').next().text(),
// 					is_cgiia: $element.find('#tctitle font').attr('color') === 'green' ? 1 : 0
// 				})
// 			})
// 		})
// 	ctx.body = arr
// })

let getData = new Promise((resolve, reject) => {
	url = 'http://shop.bytravel.cn/produce/index226.html' //target地址
	superagent
		.get(url)
		.charset('gbk') // 当前页面编码格式
		.buffer(true)
		.end((err, data) => {
			//页面获取到的数据
			if (err) {
				// return next(err);
				reject(err)
				console.log('页面不存在', err)
			}

			let html = data.text
			let $ = cheerio.load(html, {
				decodeEntities: false,
				ignoreWhitespace: false,
				xmlMode: false,
				lowerCaseTags: false
			}) //用cheerio解析页面数据

			let arr = []
			// cheerio的使用类似jquery的操作
			$('table tbody').each((index, element) => {
				let $element = $(element)
				$element.find('#tctitle').next().find('a').addClass('link').attr('class', 'link').text('')
				arr.push({
					title: $element.find('a.blue14b').text(),
					image: $element.find('#bright img').attr('src'),
					summary: $element.find('#tctitle').next().text(),
					is_cgiia: $element.find('#tctitle font').attr('color') === 'green' ? 1 : 0
				})
			})

			resolve(arr)
		})
})

// 断言处理
// if (!user) {
//   ctx.status = 401
//   ctx.body = { message: '用户名不存在' }
// }

// assert(user, 422, '用户不存在')

module.exports = HomeController
