import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { routes } from './Routes/routes.js';
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3000;

const __dirname = path.resolve();

const uploadPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

//  CORS and Body Parsing
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//  MongoDB
// mongoose.connect('mongodb://localhost:27017/YouTube');
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));
mongoose.connection.once('open', () => console.log('MongoDB connected'));

// Routes
routes(app, upload);

app.listen(port, () => console.log(`Server is running at http://localhost:${port}`));
