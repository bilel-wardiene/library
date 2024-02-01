const express = require('express')
const router = express.Router()
const bookController = require('../controllers/bookController')
const guardAuth = require('../routes/guarAuth')
const multer = require('multer')                // puisque bech neb3ath data mech kolha string fiha image so on utilise multer fi blaset bodyparser

router.get('/', bookController.getLimitBooks)
router.get('/books', guardAuth.isAuth, bookController.getAllBooks)
router.get('/books/:id', guardAuth.isAuth, bookController.getBook)
router.get('/mybooks', guardAuth.isAuth, bookController.getMyBooks)
router.get('/deleteBooks/:id', guardAuth.isAuth, bookController.deleteBook)
router.get('/addbook', guardAuth.isAuth, bookController.getAddBook)
router.get('/updateBooks/:id', guardAuth.isAuth, bookController.getupdateBook)
router.post('/update/:id', multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'assets/uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, uniqueSuffix + ' ' + file.originalname)
    }
  })
}).single('image'), guardAuth.isAuth, bookController.postUpdate)

router.post('/addbook',
  multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'assets/uploads')
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + ' ' + file.originalname)
      }
    })
  }).single('image'), guardAuth.isAuth, bookController.addBook)
// image esmha fel fichier ejs li bech neb3athha kena ja 3andi barcha na3mel .arry w n7otha fi tableau [image,image 2, image 3,....]
module.exports = router;