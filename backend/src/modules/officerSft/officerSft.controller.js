import Officer from "./officerSft.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../../utils/error.js";
import jwt from "jsonwebtoken";

export const registerHandler = async (req, res, next) => {
  const { id, name, phoneNumber, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newOfficer = new Officer({
    id,
    name,
    phoneNumber,
    email,
    password: hashedPassword,
  });

  try {
    await newOfficer.save();
    res.json("login successFully");
  } catch (error) {
    next(error);
  }
};

export const loginHandler = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validOfficer = await Officer.findOne({ email });
    if (!validOfficer) {
      return next(errorHandler(404, "Account Officer not found"));
    }

    const validPassword = bcryptjs.compareSync(
      password,
      validOfficer.password
    );
    if (!validPassword) {
      return next(errorHandler(400, "password incorrect"));
    }

    const token = jwt.sign(
      { id: validOfficer._id, isOfficer: validOfficer.isOfficer },
      process.env.JWT_SECRET
    );

    const { password: pass, ...rest } = validOfficer._doc;

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
    const officers = await Officer.find();
    res.json(officers);
  } catch (error) {
    next(error);
  }
};
export const getCompanyOfficer = async (req, res, next) => {
  try {
    const officers = await Officer.find();
    res.json(officers);
  } catch (error) {
    next(error);
  }
};
export const updateHandler = async (req, res, next) => {
  try {
    const updatedOfficer = await Officer.findByIdAndUpdate(
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
    res.json(updatedOfficer);
  } catch (error) {
    next(error);
  }
};

export const deleteHandler = async (req, res, next) => {
  try {
    await Officer.findByIdAndDelete(req.params.id);
    res.json({ message: "delete success" });
  } catch (error) {
    next(error);
  }
};
