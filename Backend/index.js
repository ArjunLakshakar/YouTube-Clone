// // ❌ WRONG
// // import multer from 'multer';
// // const storage = multer.memoryStorage();
// // routes(app, storage); ❌❌❌ wrong

// // ✅ CORRECT:
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// import { routes } from './Routes/routes.js';

// const __dirname = path.resolve();

// // ✅ Ensure "uploads" folder exists
// const uploadPath = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadPath)) {
//   fs.mkdirSync(uploadPath);
// }

// // ✅ Store file to disk, not memory
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads');
//   },
//   filename: function (req, file, cb) {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });

// const upload = multer({ storage }); // ✅ THIS is what multer expects

// // ✅ pass the `upload` instance to your routes
// routes(app, upload);
