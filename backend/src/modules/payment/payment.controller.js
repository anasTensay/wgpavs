import Payment from "./payment.model.js";

export const createHandler = async (req, res, next) => {
  try {
    const { project_id, amount, payment_status, payment_date, contractor_id } = req.body;

    const newPayment = new Payment({
      project_id,
      amount,
      payment_status,
      payment_date,
      contractor_id,
    });

    await newPayment.save();
    res
      .status(201)
      .json({ message: "Payment added successfully", payment: newPayment });
  } catch (error) {
    next(error);
  }
};

// تعديل مشروع
export const updateHandler = async (req, res, next) => {
  try {
    const payment = await Payment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json({ message: "Payment updated successfully", payment });
  } catch (error) {
    next(error);
  }
};

// حذف مشروع
export const deleteHandler = async (req, res, next) => {
  try {
    const payment = await Payment.findByIdAndDelete(req.params.id);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    res.json({ message: "Payment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// جلب جميع المشاريع
// In your backend payment controller
export const getHandler = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate("project_id", "name") // Populate project name
      .populate("contractor_id", "name"); // Populate contractor name
    res.json(payments);
  } catch (error) {
    next(error);
  }
};