require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./Routes/authRoutes');
const carRoutes = require('./Routes/carRoutes');
const rentalRoutes = require('./Routes/rentalRoutes');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Test Supabase connection
supabase.from('cars').select('*').limit(1).then(({ data, error }) => {
    if (error) {
        console.error('Supabase connection failed:', error);
    } 
    else {
        console.log('Connected to Supabase database');
    }
});

// Basic route
app.get('/', (req, res) => {
    res.send('Car Rental System API');
});

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/rentals', rentalRoutes);

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});