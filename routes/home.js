const Router = require('koa-router')
const cheerio = require('cheerio')
const charset = require('superagent-charset')
const superagent = charset(require('superagent'))
const { home, login, register } = require('../controllers/home')
const router = new Router()

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
			console.log('arr', arr)
		})
})

router.get('/', async ctx => {
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
})

router.post('/login', login)
router.post('/register', register)

module.exports = router
