const mongoose = require("mongoose");

const friendSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId, 
      required: true, 
      ref: "User", 
    },
    firstname: {
      type: String,
      required: true, 
      trim: true, 
    },
    lastname: {
      type: String,
      required: true, 
      trim: true, 
    },
    phonenumber: {
      type: String,
      required: true, 
      trim: true, 
    },
    address: {
      type: String,
      required: true,
      trim: true, 
    },
  },
  { timestamps: true }
); 

module.exports = mongoose.model("Friend", friendSchema);
