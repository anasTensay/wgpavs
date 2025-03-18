import Contractor from "./authContractor.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../../utils/error.js";
import jwt from "jsonwebtoken";
import Project from "../project/project.model.js";

export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("contractor_id", "name"); // Populate contractor name
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
};
export const registerHandler = async (req, res, next) => {
  const {
    id,
    name,
    phoneNumber,
    email,
    password,
    end_date,
    start_date,
    amount,
    Iktva
  } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newContractor = new Contractor({
    id,
    name,
    phoneNumber,
    email,
    password: hashedPassword,
    start_date,
    end_date,
    amount,
    Iktva
  });

  try {
    await newContractor.save();
    res.json("login successFully");
  } catch (error) {
    next(error);
  }
};

export const loginHandler = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validContractor = await Contractor.findOne({ email });
    if (!validContractor) {
      return next(errorHandler(404, "Account Contractor not found"));
    }

    const validPassword = bcryptjs.compareSync(
      password,
      validContractor.password
    );
    if (!validPassword) {
      return next(errorHandler(400, "password incorrect"));
    }

    const token = jwt.sign(
      { id: validContractor._id, isContractor: validContractor.isContractor },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validContractor._doc;

    return res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "None",
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const getHandler = async (req, res, next) => {
  try {
    const contractors = await Contractor.find();
    res.json(contractors);
  } catch (error) {
    next(error);
  }
};

export const updateHandler = async (req, res, next) => {
  try {
    const updatedContractor = await Contractor.findByIdAndUpdate(
      req.params.id,
      {
        id: req.body.id,
        name: req.body.name,
        phoneNumber: req.body.number,
        email: req.body.email,
        password: req.body.password,
      },
      { new: true }
    );
    res.json(updatedContractor);
  } catch (error) {
    next(error);
  }
};

export const deleteHandler = async (req, res, next) => {
  try {
    await Contractor.findByIdAndDelete(req.params.id);
    res.json({ message: "delete success" });
  } catch (error) {
    next(error);
  }
};