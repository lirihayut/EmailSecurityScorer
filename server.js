import express from 'express';
import emailRoutes from './src/routes/emailRoutes.js';

const app = express();
app.use(express.json());
app.use('/api/v1', emailRoutes);
app.listen(3000, () => console.log('Server running on port 3000'));
;
