import { RegisterUserService, loginUserService, getCurrentUserService } from "./auth.service.js";
import prisma from '../lib/prisma.js'
import {registerSchema, loginSchema} from './auth.validator.js'
export async function registerUser(req, res, next) {
  try {
    const result = registerSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }
    const data = await RegisterUserService(req.body ?? {});

    res.status(201).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const result = loginSchema.safeParse(req.body);
     if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    const data = await loginUserService(req.body ?? {});

    res.cookie("token", data.accessToken)
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
}


export async function getMe(req,res,next){
  try{
    const user = await getCurrentUserService(req)
    res.status(200).json({
      success: true,
      data: {
        user,
      },
    });

  } catch(error){
     next(error)
  }
}

export async function logout(req, res, next) {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict"
        });

        return res.status(200).json({
            success: true,
            message: "User logged out successfully"
        });
    } catch (error) {
        next(error);
    }
}


