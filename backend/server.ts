import express from 'express';
import cors from 'cors';
import authRoutes from './app/routes/authRoutes';
import messagingRoutes from './app/routes/messagingRoutes';

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/notifications', messagingRoutes)


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
