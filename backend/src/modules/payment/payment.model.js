import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comown",
    },
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    amount: { type: Number, required: true },
    payment_status: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
    },
    payment_date: { type: Date, required: true },
    contractor_id: { type: mongoose.Schema.Types.ObjectId, ref: "Contractor", required: true },
  },
  { timestamps: true }
);

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
