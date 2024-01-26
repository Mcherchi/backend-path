import express from 'express';
import { getFileSpecs } from '../controllers/fileMetadataController';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const route = express.Router();

route.post('/file-specs', upload.single('upfile'), getFileSpecs);

export { route as fileMetadataRoute };
