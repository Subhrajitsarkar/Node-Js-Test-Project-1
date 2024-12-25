const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./utils/database');
const Book = require('./models/bookModel');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Add a new book
app.post('/api/books', async (req, res) => {
    try {
        const { name, takenOn, returnDue } = req.body;
        const book = await Book.create({ name, takenOn, returnDue });
        res.status(201).json(book);
    } catch (error) {
        console.error('Error adding book:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all active books
app.get('/api/books', async (req, res) => {
    try {
        const books = await Book.findAll({ where: { returned: false } });
        res.status(200).json(books);
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ error: error.message });
    }
});

// Get all returned books
app.get('/api/returned-books', async (req, res) => {
    try {
        const returnedBooks = await Book.findAll({ where: { returned: true } });
        res.status(200).json(returnedBooks);
    } catch (error) {
        console.error('Error fetching returned books:', error);
        res.status(500).json({ error: error.message });
    }
});

// Mark a book as returned
app.put('/api/books/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const book = await Book.findByPk(id);

        if (!book) {
            return res.status(404).json({ error: 'Book not found' });
        }

        const now = new Date();
        const overdueTime = Math.max(0, now - new Date(book.returnDue));
        const fine = Math.ceil(overdueTime / (60 * 60 * 1000)) * 10; // ₹10 per hour

        book.fine = fine;
        book.returned = true;
        await book.save();

        res.status(200).json(book);
    } catch (error) {
        console.error('Error returning book:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start Server
sequelize.sync()
    .then(() => {
        app.listen(3000, () => console.log('Server running on http://localhost:3000'));
    })
    .catch((error) => console.error('Error syncing database:', error));
