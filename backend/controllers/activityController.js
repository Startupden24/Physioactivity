import asyncHandler from 'express-async-handler';
import Activity from '../models/activityModel.js';
import User from '../models/userModel.js';
import path,{ dirname } from 'path'; // For file saving
//import { URL } from 'url';
import fs from 'fs';
import * as url from 'url';
    const __filename = url.fileURLToPath(import.meta.url);
    const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const saveFile=function(filename, buffer) {
  //console.log("savign file");
  try {
    // Ensure uploads directory exists
    const uploadsDir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true }); // Create directory recursively if needed
    }

    // Generate a unique filename (optional)
    const uniqueFilename = `${Date.now()}-${filename}`; // Add timestamp to avoid filename conflicts

    // Save the file
    const filePath = path.join(uploadsDir, uniqueFilename);
    fs.writeFileSync(filePath, buffer);

    return filePath; // Return the saved file's path
  } catch (error) {
    console.error('Error saving file:', error);
    throw new Error('Error saving file'); // Re-throw error for handling in the route
  }
}

//console.log(__dirname);

const newActivity = asyncHandler(async (req, res) => {

    const { title, instructions, difficulty, isPrivate, regions } = req.body;
    const video = req.files?.video?.[0];
    const image = req.files?.image?.[0];
    const thumbnail = req.files?.thumbnail?.[0];
    let videoPath = video.filename;
    let imagePath = image.filename;
    let thumbnailPath = thumbnail.filename;
    //console.log();
    /*if (video) {
        videoPath = saveFile(video.filename, video.buffer); // Call saveFile function
    }
    if (image) {
        imagePath = saveFile(image.filename, image.buffer); // Call saveFile function
    }*/
    const exercise = new Activity({
        title,
        instructions,
        difficulty,
        isPrivate,
        regions,
        videoLink: videoPath ? process.env.BASE_URL + '/uploads/' + videoPath.split(path.sep).pop() : null, // Construct video link with base URL
        imageLink: imagePath ? process.env.BASE_URL + '/uploads/' + imagePath.split(path.sep).pop() : null, // Construct image link with base URL
        thumbnailLink: thumbnailPath ? process.env.BASE_URL + '/uploads/' + thumbnailPath.split(path.sep).pop() : null, // Construct image link with base URL
    });

    // Save the exercise data to database
    try {
        exercise.save();
        res.json({ message: 'Exercise submitted successfully!' });
    } catch (error) {
        console.error('Error saving exercise:', error);
        res.status(500).json({ message: 'Error submitting exercise' });
    }

});
const getActivities=asyncHandler(async(req,res)=>{

  const activites=await Activity.find();
  res.status(200).json(activites);
})

const deleteActivity=asyncHandler(async(req,res)=>{
  //console.log(req.body);
  const ids = req.body.ids;
  //console.log(ids);
  if (!Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ message: 'Invalid or missing IDs array' });
  }

  try {
    const result = await Activity.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No activities found with the given IDs' });
    }

    res.json({ message: `${result.deletedCount} activities deleted successfully` });
  } catch (error) {
    console.error('Error deleting activities:', error);
    res.status(500).json({ message: 'Error deleting activities' });
  }
})
const setFavourites=asyncHandler(async(req,res)=>{
  const { ids } = req.body;
  if (!ids || !Array.isArray(ids)) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if all activity IDs are valid and exist
    const validActivities = await Activity.find({ _id: { $in: ids } });
    //console.log(validActivities);
    if (validActivities.length !== ids.length) {
      return res.status(400).json({ message: 'Some activity IDs are invalid' });
    }

    // Add the activities to the user's activities array
    await User.findByIdAndUpdate(req.user._id, {
      $addToSet: { activities: { $each: ids } } // Use $addToSet to avoid duplicates
    });

    res.status(200).json({ message: 'Activities added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
})
const editActivity=asyncHandler(async(req,res)=>{
  const { _id,title, description, regions, isPrivate } = req.body;

  try {
    const updatedExercise = await Activity.findByIdAndUpdate(
      _id,
      {
        title,
        description,
        regions,
        isPrivate
      },
      { new: true, runValidators: true }
    );

    if (!updatedExercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    res.json(updatedExercise);
  } catch (error) {
    console.error('Error updating exercise:', error);
    res.status(500).json({ message: 'Server error' });
  }
})
const publicActivity=asyncHandler(async(req,res)=>{
  const activites=await Activity.find({isPrivate:false});
  res.status(200).json(activites);
})
const setRating=asyncHandler(async(req,res)=>{
  //console.log(req.params);
  //console.log(req.query);
  const { id } = req.params;
  const { rate } = req.query;
  const userId = req.user._id;
  const ratingValue = parseInt(rate, 10);

  try {
    // Find the activity by ID
    const activity = await Activity.findById(id);
    if (!activity) {
      return res.status(404).json({ message: 'Activity not found' });
    }

    // Check if the user has already rated this activity
    const existingRating = activity.ratings.find(r => r.userId.toString() === userId.toString());

    if (existingRating) {
      // Update the existing rating
      existingRating.rating = ratingValue;
    } else {
      // Add a new rating
      activity.ratings.push({ userId, rating: ratingValue });
    }

    // Calculate the average rating
    const totalRatings = activity.ratings.length;
    const sumRatings = activity.ratings.reduce((sum, r) => sum + r.rating, 0);
    console.log(totalRatings);
    console.log(sumRatings);
    const averageRating = sumRatings / totalRatings;
    // Update the average rating field
    activity.averageRating = averageRating;
    console.log(averageRating);
    // Save the updated activity
    await activity.save();

    res.status(200).json({ averageRating, totalRatings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
})
export { 
  newActivity,
  getActivities,
  deleteActivity,
  setFavourites,
  editActivity,
  publicActivity,
  setRating
};

