import pkg from "@prisma/client";
import bcrypt from "bcrypt";
import createError from "http-errors";
import { verifyToken } from "./tokenVerify.js";

const {PrismaClient} = pkg
const prisma = new PrismaClient()

export const checkCredential = async function (email, plainPassword) {
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    })
    // console.log("chech user--",user);
    if (user) {
   
      const isMatch = await bcrypt.compare(plainPassword, user.password);
    //   console.log("isMatch--",isMatch);
      if (isMatch) return user;
      else null;
    } else {
      return null;
    }
  };

  export const userAuthMiddleware = async(req, res, next) => {
    try {
      if (!req.headers.authorization){
        console.log("bearer", req.headers.authorization)
        next(createError(401, "Login first please!"))
      } else {
        const token = req.headers.authorization.replace("Bearer ", "")
        const decode = await verifyToken(token)
        // console.log("token&decode--", token, decode)
        const user = await prisma.user.findFirst({
          where: {
            id: decode.id
          }
        })
        if (user){
          req.user = user
          next()
        } else {
          next(createError(401, "Unauthorized!!!"))
          console.log("bearer--------")
        }
      }
    } catch (error) {
      console.log(error)
      next(createError(401, "something went wrong"))
      console.log("bearer-------->>>")
    }
  }
  export default prisma