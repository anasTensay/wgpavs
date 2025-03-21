import Contractor from "../contractor/authContractor.model.js";
import Project from "./project.model.js";

export const getSafetyReport = async (req, res, next) => {
  try {
    const projects = await Project.find().populate("contractor_id");
    const safetyReport = projects.map((project) => ({
      contractorName: project.contractor_id?.name || "N/A",
      contractorId: project.contractor_id?._id || "N/A",
      ytdFAI: project.ytdFAI,
      ofFAINotCompleted: project.ofFAINotCompleted,
      ytdObservation: project.ytdObservation,
      ofObservationNotCompleted: project.ofObservationNotCompleted,
      ytdIncident: project.ytdIncident,
      ofIncidentNotCompleted: project.ofIncidentNotCompleted,
      totalNotClosed: project.totalNotClosed,
    }));
    res.status(200).json(safetyReport);
  } catch (error) {
    next(error);
  }
};

export const getContractorsWithProjectCounts = async (req, res) => {
  try {
    const contractors = await Contractor.find();
    const projects = await Project.find();

    const contractorsWithCounts = contractors.map((contractor) => {
      const contractorProjects = projects.filter(
        (project) => project.contractor_id === contractor._id.toString()
      );

      return {
        ...contractor.toObject(),
        totalProjects: contractorProjects.length,
        activeProjects: contractorProjects.filter(
          (project) => project.status === "Active"
        ).length,
        expiredProjects: contractorProjects.filter(
          (project) => project.status === "Expired"
        ).length,
        completedProjects: contractorProjects.filter(
          (project) => project.status === "Completed"
        ).length,
      };
    });

    res.status(200).json(contractorsWithCounts);
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
};
// في ملف الـ API (مثل api/project.js)
export const getSafetyStats = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const safetyStats = [
      {
        type: "FAI",
        incidents: project.ytdFAI,
        observations: project.ofFAINotCompleted,
        investigations: project.totalNotClosed,
      },
      {
        type: "Observation",
        incidents: project.ytdObservation,
        observations: project.ofObservationNotCompleted,
        investigations: project.totalNotClosed,
      },
      {
        type: "Incident",
        incidents: project.ytdIncident,
        observations: project.ofIncidentNotCompleted,
        investigations: project.totalNotClosed,
      },
    ];

    res.status(200).json(safetyStats);
  } catch (error) {
    next(error);
  }
};
export const createHandler = async (req, res, next) => {
  try {
    const {
      name,
      project_number,
      start_date,
      end_date,
      location,
      assigned_location,
      companyId,
      contractor_id,
      status,
      notes,
      contractorWillWorkNextWeek,
    } = req.body;

    const newProject = new Project({
      name,
      project_number,
      start_date,
      end_date,
      location,
      assigned_location,
      companyId,
      contractor_id,
      status,
      notes,
      contractorWillWorkNextWeek,
    });

    await newProject.save();
    res.json({ message: "Project created successfully", project: newProject });
  } catch (error) {
    next(error);
  }
};

export const updateHandler = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project updated successfully", project });
  } catch (error) {
    next(error);
  }
};

// حذف مشروع
export const deleteHandler = async (req, res, next) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// جلب جميع المشاريع
export const getHandler = async (req, res, next) => {
  try {
    const projects = await Project.find().populate("companyId", "name");
    if (!projects) {
      return res.status(404).json({ message: "No projects found" });
    }
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectsByContractorId = async (req, res, next) => {
  try {
    const { contractorId } = req.params;
    const projects = await Project.find({ contractor_id: contractorId });
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectsByCompanyId = async (req, res, next) => {
  try {
    const { companyId } = req.params;
    const projects = await Project.find({  companyId }).populate(
      "contractor_id",
      "name"
    );
    res.status(200).json(projects);
  } catch (error) {
    next(error);
  }
};
export const updateProjectStatus = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { status, start_date, end_date } = req.body;

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { status, start_date, end_date },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    next(error);
  }
};

