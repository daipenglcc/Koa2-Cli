const Router = require('koa-router')
const cheerio = require('cheerio')
const charset = require('superagent-charset')
const superagent = charset(require('superagent'))
const fs = require('fs')
const request = require('request')
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

router.get('/download', async ctx => {
	// var imgUrl = 'http://www.google.com.hk/images/srpr/logo3w.png'
	let imgUrl = 'http://s0.hao123img.com/res/img/logo/logonew.png'

	// for (let i = 1; i < 3; i++) {
	// 	let filename = `test${i}.png`
	// 	request(imgUrl).pipe(fs.createWriteStream('./images/' + filename))
	// }

	// request(imgUrl).pipe(fs.createWriteStream('./images/123.png'))

	var writeStream = fs.createWriteStream('image.png')
	var readStream = request(imgUrl)
	readStream.pipe(writeStream)
	readStream.on('end', function (response) {
		console.log('文件写入成功')
		writeStream.end()
	})

	writeStream.on('finish', function () {
		console.log('ok')
	})
	ctx.body = 'download'
})

router.post('/login', login)
router.post('/register', register)

module.exports = router
