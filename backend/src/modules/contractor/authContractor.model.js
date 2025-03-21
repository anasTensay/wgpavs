import mongoose from "mongoose";

const contractorSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comown",
    },
    id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true },
    password: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    amount: { type: Number, required: true },
    Iktva: { type: Number, required: true },
    profilePicture: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
    },
    isContractor: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Contractor = mongoose.model("Contractor", contractorSchema);

export default Contractor;