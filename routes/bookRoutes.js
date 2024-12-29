const express = require('express');
const bookController = require('../controllers/bookController');

const router = express.Router();

router.post('/books', bookController.addBook);
router.get('/books', bookController.getActiveBooks);
router.get('/returned-books', bookController.getReturnedBooks);
router.put('/books/:id', bookController.returnBook);

module.exports = router;