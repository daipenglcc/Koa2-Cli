const Router = require('koa-router')
const { home, login, register } = require('../controllers/home')
const { bilibili } = require('../controllers/bilibili')
const router = new Router()

router.get('/', home)
router.get('/bilibili', bilibili)
router.get('/download', async ctx => {
	let imgUrl = 'https://bucket.vues.cn/images/111111.png'
	var writeStream = fs.createWriteStream('./images/111111.png')
	var readStream = request(imgUrl)
	readStream.pipe(writeStream)
	readStream.on('end', function (response) {
		console.log('文件写入成功1')
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
