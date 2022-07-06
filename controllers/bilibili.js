const cheerio = require('cheerio')
const charset = require('superagent-charset')
const superagent = charset(require('superagent'))
const fs = require('fs')
const request = require('request')

class BilibiliController {
	static async bilibili(ctx) {
		try {
			let data = await biliData('http://shop.bytravel.cn/produce/index123_list14.html')
			ctx.body = data
		} catch (err) {
			console.log(err)
		}
	}
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
					console.log('页面不存在', err)
				}

				let html = data.text
				console.log('html', html)

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
							console.log('data', data)
						},
						err => {
							console.log('err', err)
						}
					)
				})

				resolve(arr)
			})
	})
}

function saveImg(title, imgUrl) {
	return new Promise(resolve => {
		// let imgUrl2 = imgUrl.split('heads/')[1]
		var writeStream = fs.createWriteStream(`./images/${title}.png`)
		var readStream = request(imgUrl)
		readStream.pipe(writeStream)
		readStream.on('end', function (response) {
			writeStream.end()
			resolve('文件写入成功')
		})
	})
}

module.exports = BilibiliController
