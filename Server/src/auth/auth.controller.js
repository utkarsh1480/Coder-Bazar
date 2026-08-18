import { RegisterUserService, loginUserService, getCurrentUserService } from "./auth.service.js";
import prisma from '../lib/prisma.js'
export async function registerUser(req, res, next) {
  try {
    const result = await RegisterUserService(req.body ?? {});

    res.status(201).json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const result = await loginUserService(req.body ?? {});

    res.cookie("token", result.accessToken)
    res.status(200).json({
      success: true,
      data: result,
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


