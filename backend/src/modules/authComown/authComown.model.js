import mongoose from "mongoose";

const comownSchema = new mongoose.Schema(
  {
    companyId: {
      type: String,
      required: true,
      unique: true, // تأكد من أن companyId فريد
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    isComown: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Comown = mongoose.model("Comown", comownSchema);

export default Comown;