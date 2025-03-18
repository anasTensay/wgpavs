import Contractor from "../contractor/authContractor.model.js";
import Worker from "./workers.model.js";

export const getContractorsWithWorkerCounts = async (req, res) => {
  try {
    const contractors = await Contractor.find(); // جلب جميع المقاولين
    const workers = await Worker.find(); // جلب جميع العمال

    const contractorsWithCounts = contractors.map((contractor) => {
      const contractorWorkers = workers.filter(
        (worker) =>
          worker.contractor_id.toString() === contractor._id.toString()
      );

      return {
        ...contractor.toObject(),
        totalWorkers: contractorWorkers.length,
        saudiWorkers: contractorWorkers.filter(
          (worker) => worker.nationality === "Saudi"
        ).length,
        nonSaudiWorkers: contractorWorkers.filter(
          (worker) => worker.nationality === "Non-Saudi"
        ).length,
        wprWorkers: contractorWorkers.filter(
          (worker) => worker.job_title === "WPR"
        ).length,
        supervisorWorkers: contractorWorkers.filter(
          (worker) => worker.job_title === "Supervisor"
        ).length,
        safetyOfficerWorkers: contractorWorkers.filter(
          (worker) => worker.job_title === "Safety Officer"
        ).length,
        helperWorkers: contractorWorkers.filter(
          (worker) => worker.job_title === "Helper"
        ).length,
        hvacWorkers: contractorWorkers.filter(
          (worker) => worker.job_title === "HVAC"
        ).length,
        electWorkers: contractorWorkers.filter(
          (worker) => worker.job_title === "Elect"
        ).length,
        pcstWorkers: contractorWorkers.filter(
          (worker) => worker.job_title === "PCST"
        ).length,
        welderWorkers: contractorWorkers.filter(
          (worker) => worker.job_title === "Welder"
        ).length,
        fabricatorWorkers: contractorWorkers.filter(
          (worker) => worker.job_title === "Fabricator"
        ).length,
        metalWorkers: contractorWorkers.filter(
          (worker) => worker.job_title === "Metal"
        ).length,
        machinistWorkers: contractorWorkers.filter(
          (worker) => worker.job_title === "Machinist"
        ).length,
      };
    });

    res.status(200).json(contractorsWithCounts);
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};
const convertIdsToObjectId = async () => {
  try {
    const workers = await Worker.find();

    for (const worker of workers) {
      worker.contractor_id = new mongoose.Types.ObjectId(worker.contractor_id);
      worker.project_id = new mongoose.Types.ObjectId(worker.project_id);
      await worker.save();
    }

    console.log("Data updated successfully!");
  } catch (error) {
    console.error("Error updating data:", error);
  }
};

convertIdsToObjectId();
// إنشاء عامل جديد
export const createWorker = async (req, res, next) => {
  try {
    const { id, name, contractor_id, contact_info, nationality, job_title } =
      req.body;

    // Check if a worker with the same ID already exists
    const existingWorker = await Worker.findOne({ id });
    if (existingWorker) {
      return res
        .status(400)
        .json({ message: "Worker ID must be unique. This ID already exists." });
    }

    const newWorker = new Worker({
      id,
      name,
      contractor_id,
      contact_info,
      nationality,
      job_title,
    });

    await newWorker.save();
    res
      .status(201)
      .json({ message: "Worker created successfully", worker: newWorker });
  } catch (error) {
    if (error.code === 11000) {
      // Handle duplicate key error
      return res
        .status(400)
        .json({ message: "Worker ID must be unique. This ID already exists." });
    }
    next(error);
  }
};

// تحديث بيانات عامل
export const updateWorker = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const worker = await Worker.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.status(200).json({ message: "Worker updated successfully", worker });
  } catch (error) {
    next(error);
  }
};

// حذف عامل
export const deleteWorker = async (req, res, next) => {
  try {
    const { id } = req.params;

    const worker = await Worker.findByIdAndDelete(id);
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.status(200).json({ message: "Worker deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// جلب جميع العمال
export const getWorkers = async (req, res, next) => {
  try {
    const workers = await Worker.find().populate("contractor_id"); // إزالة project_id
    res.status(200).json(workers);
  } catch (error) {
    next(error);
  }
};
// جلب عامل بواسطة ID
export const getWorkerById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const worker = await Worker.findById(id).populate("contractor_id"); // إزالة project_id
    if (!worker) {
      return res.status(404).json({ message: "Worker not found" });
    }

    res.status(200).json(worker);
  } catch (error) {
    next(error);
  }
};