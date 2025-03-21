import Payment from "./payment.model.js";

// دالة للتحقق من أن مجموع النسب المئوية لا يتجاوز 100%
const validatePaymentAmount = async (project_id, amount, paymentId = null) => {
  const payments = await Payment.find({ project_id });
  const totalAmount = payments.reduce((sum, payment) => {
    if (payment._id.toString() !== paymentId) {
      return sum + payment.amount;
    }
    return sum;
  }, 0);

  return totalAmount + amount <= 100;
};

export const createHandler = async (req, res, next) => {
  try {
    const { companyId, project_id, amount, payment_status, payment_date, contractor_id } = req.body;

    // التحقق من أن المجموع لا يتجاوز 100%
    const isValid = await validatePaymentAmount(project_id, amount);
    if (!isValid) {
      return res.status(400).json({ message: "Total payment amount cannot exceed 100%" });
    }

    const newPayment = new Payment({
      companyId,
      project_id,
      amount,
      payment_status,
      payment_date,
      contractor_id,
    });

    await newPayment.save();
    res.status(201).json({ message: "Payment added successfully", payment: newPayment });
  } catch (error) {
    next(error);
  }
};

export const updateHandler = async (req, res, next) => {
  try {
    const { amount, project_id } = req.body;

    // التحقق من أن المجموع لا يتجاوز 100%
    const isValid = await validatePaymentAmount(project_id, amount, req.params.id);
    if (!isValid) {
      return res.status(400).json({ message: "Total payment amount cannot exceed 100%" });
    }

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

export const getComanyPayement = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const payments = await Payment.find({ companyId }).populate("project_id", "name").populate("contractor_id", "name");
    res.json(payments);
  } catch (error) {
    next(error);
  }
};
export const getHandler = async (req, res, next) => {
  try {
    const payments = await Payment.find()
      .populate("project_id", "name")
      .populate("contractor_id", "name");
    res.json(payments);
  } catch (error) {
    next(error);
  }
};