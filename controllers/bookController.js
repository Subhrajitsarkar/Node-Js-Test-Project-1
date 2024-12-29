const Book = require('../models/bookModel');

// Add a new book
exports.addBook = async (req, res) => {
    try {
        const { name, takenOn, returnDue } = req.body;
        const book = await Book.create({ name, takenOn, returnDue });
        res.status(201).json(book);
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get all active books
exports.getActiveBooks = async (req, res) => {
    try {
        const books = await Book.findAll({ where: { returned: false } });
        res.status(200).json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: error.message });
    }
};

// Get all returned books
exports.getReturnedBooks = async (req, res) => {
    try {
        const returnedBooks = await Book.findAll({ where: { returned: true } });
        res.status(200).json(returnedBooks);
    } catch (error) {
        console.error('Error fetching returned books:', error);
        res.status(500).json({ error: error.message });
    }
};

// Mark a book as returned
exports.returnBook = async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByPk(id);

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const now = new Date();
        const overdueTime = Math.max(0, now - new Date(book.returnDue));
        const fine = Math.ceil(overdueTime / (60 * 60 * 1000)) * 10;

        book.fine = fine;
        book.returned = true;
        await book.save();

        res.status(200).json(book);
    } catch (error) {
        console.error('Error returning book:', error);
        res.status(500).json({ error: error.message });
    }
};
