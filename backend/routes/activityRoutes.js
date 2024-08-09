import express from 'express';
import multer from 'multer'; // For file uploads
import path, { dirname } from 'path'; // For file saving
import fs from 'fs';
import * as url from 'url';
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = url.fileURLToPath(new URL('.',import.meta.url));

import {
    newActivity,
    getActivities,
    deleteActivity,
    setFavourites,
    editActivity,
    publicActivity,
    setRating
} from '../controllers/activityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

const upload = multer({
    storage: multer.diskStorage({ // Use diskStorage for more control
        destination: (req, file, cb) => {
            const uploadsDir = path.join(__dirname, '../uploads');
            if (!fs.existsSync(uploadsDir)) {
                try {
                    fs.mkdirSync(uploadsDir, { recursive: true });
                    console.log('Uploads directory created successfully.');
                } catch (err) {
                    console.error('Error creating uploads directory:', err);
                }
            }
            cb(null, uploadsDir);
        },
        filename: (req, file, cb) => {
            //console.log(file);
            cb(null, `${Date.now()}-${file.originalname}`);
        },
    }),
});

router
  .route('/')
    .get(protect, getActivities)
    .post(protect, upload.fields([{ name: 'video', maxCount: 1 }, { name: 'image', maxCount: 1 },{name:"thumbnail",maxCount:1}]), newActivity)
    .delete(protect,deleteActivity)
    .put(protect,editActivity);
router
  .route('/favorites')
    .post(protect, setFavourites)
router.get('/public',publicActivity)
router.route('/rating/:id')
    .get(protect,setRating)

export default router;