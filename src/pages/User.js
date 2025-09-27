import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  username: String,
  linkedin: String,
  github: String,
  portfolio: String,
  skillsProficient: String,
  skillsToLearn: String,
});

export default mongoose.model("User", userSchema);
