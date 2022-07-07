const cheerio = require('cheerio')
const charset = require('superagent-charset')
const superagent = charset(require('superagent'))
const fs = require('fs')
const request = require('request')
const chalk = require('chalk')
const log = console.log

class BilibiliController {
	// 山东省特产
	// http://127.0.0.1:3001/bilibili
	static async bilibili(ctx) {
		try {
			let urlList = await list()
			urlList.forEach(async item => {
				await biliData('http://shop.bytravel.cn/produce/' + item)
			})
		} catch (err) {
			log(err)
		}
		ctx.body = '开始获取...'
	}
}

async function list(ctx) {
	try {
		let data = await getlist('http://shop.bytravel.cn/produce/index123_list.html')
		return data
	} catch (err) {
		log(err)
	}
}

function getlist(baseUrl) {
	return new Promise((resolve, reject) => {
		superagent
			.get(baseUrl)
			.charset('gb2312') // 当前页面编码格式
			.buffer(true)
			.end((err, data) => {
				let html = data.text
				let $ = cheerio.load(html, {
					decodeEntities: false,
					ignoreWhitespace: false,
					xmlMode: false,
					lowerCaseTags: false
				}) //用cheerio解析页面数据

				let arr = []
				// cheerio的使用类似jquery的操作
				$('#list-page li').each((index, element) => {
					let $element = $(element)
					$element.find('a').attr('href')
					arr.push($element.find('a').attr('href'))
				})

				resolve(arr)
			})
	})
}

function biliData(baseUrl) {
	return new Promise((resolve, reject) => {
		superagent
			.get(baseUrl)
			.charset('gb2312') // 当前页面编码格式
			.buffer(true)
			.end((err, data) => {
				//页面获取到的数据
				if (err) {
					// return next(err);
					reject(err)
					log('页面不存在', err)
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
					//保存图片
					saveImg($element.find('a.blue14b').text(), $element.find('#bright img').attr('src')).then(
						data => {
							log(`
下载成功: ${chalk.green(data.title)}
成功URL: ${chalk.green(baseUrl)}
Url: ${chalk.yellow(data.path)}
							`)
						},
						err => {
							log(`
下载失败: ${chalk.red(data.path)}
失败URL: ${chalk.red(baseUrl)}
Error: ${chalk.red(err)}
							`)
						}
					)
				})

				resolve(arr)
			})
	})
}

function saveImg(title, imgUrl) {
	return new Promise(resolve => {
		let nameSuffix = imgUrl.split('/').pop()
		var writeStream = fs.createWriteStream(`./images/${title + nameSuffix}`)
		var readStream = request(imgUrl)
		readStream.pipe(writeStream)
		readStream.on('end', function (response) {
			writeStream.end()
			resolve({
				title: title + nameSuffix,
				path: imgUrl
			})
		})
	})
}

module.exports = BilibiliController
