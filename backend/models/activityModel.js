import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const activitySchema = mongoose.Schema({
  title: { type: String, required: true },
  instructions: { type: String, required: true },
  difficulty: { type: String, required: true },
  regions:{type:String, required: true},
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      rating: { type: Number, required: true }
    }
  ],
  averageRating:{type:Number,default:0},
  videoLink: { type: String },
  imageLink: { type: String },
  thumbnailLink: { type: String },
  isPrivate:{
    type:Boolean,
    default:false
  }
});
const Activity = mongoose.model('Activity', activitySchema);

export default Activity;