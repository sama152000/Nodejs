const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const connectDB = require('./utils/DB'); 
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');
const errorHandler = require('./middlewares/errorHandler');

dotenv.config(); 

const app = express();
const port = process.env.PORT || 5000;

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

connectDB();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); 
app.use(express.static(path.join(__dirname, 'public'))); 

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server runnig in port ${port}`);
});