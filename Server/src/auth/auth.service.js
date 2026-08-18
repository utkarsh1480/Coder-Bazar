import prisma from '../lib/prisma.js'
import {hashPassword, verifyPassword} from '../utils/password.js'
import {createAccessToken, verifyAccessToken} from '../utils/jwt.js'

export async function RegisterUserService(data = {}) {
    const { name = '', email = '', password = '' } = data;

    if (!name || !email || !password) {
        const error = new Error('Name, email and password are required');
        error.statusCode = 400;
        throw error;
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const existUser = await prisma.User.findUnique({
        where: {
            email: normalizedEmail,
        },
    });

    if (existUser) {
        const error = new Error('Email already registered');
        error.statusCode = 409;
        throw error;
    }

    const newhashPassword = await hashPassword(password);
    const user = await prisma.User.create({
        data: {
            name: String(name).trim(),
            email: normalizedEmail,
            password: newhashPassword,
        },
    });
    const accessToken = createAccessToken(user);

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        accessToken,
    };
}

export async function loginUserService(data = {}) {
    const { email = '', password = '' } = data;

    if (!email || !password) {
        const error = new Error('Email and password are required');
        error.statusCode = 400;
        throw error;
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await prisma.User.findUnique({
        where: {
            email: normalizedEmail,
        },
    });

    if (!user) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    const isPasswordValid = await verifyPassword(user.password, password);

    if (!isPasswordValid) {
        const error = new Error('Invalid email or password');
        error.statusCode = 401;
        throw error;
    }

    const accessToken = createAccessToken(user);


    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
        },
        accessToken,
    };
}


export async function getCurrentUserService(req){
    const _id = req.user.sub;
    if(!_id){
        return resizeBy.status().json({
            status : false,
            message : "Please login first"
        })
    }
const user = await prisma.user.findUnique({
      where :{
        id : _id
      },
      select :{
        id : true,
        name : true,
        email: true,
      }
    })

if (!user) {
     const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }
    return {
        user
    }

}