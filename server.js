import express from 'express';
import cors from 'cors'; 
import dotenv from 'dotenv';
import emailRoutes from './src/routes/emailRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1', emailRoutes);

app.get('/', (req, res) => {
    res.send('Malicious Email Scorer API is running...');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
