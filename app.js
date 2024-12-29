const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./utils/database');
const bookRoutes = require('./routes/bookRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

app.use('/api', bookRoutes);

// Start Server
sequelize.sync()
    .then(() => {
        app.listen(3000, () => console.log('Server running on http://localhost:3000'));
    })
    .catch((error) => console.error('Error syncing database:', error));
