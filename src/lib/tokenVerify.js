import jwt from "jsonwebtoken";
import prisma from "./index.js"
// import pkg from "@prisma/client";

// const {PrismaClient} = pkg
// const prisma = new PrismaClient()

//access token
const newToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.SECRET_ACCESS,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    )
  );

//refresh token
const refreshToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.sign(
      payload,
      process.env.SECRET_REFRESH,
      { expiresIn: "7d" },
      (err, token) => {
        if (err) reject(err);
        resolve(token);
      }
    )
  );

//verifying token
export const verifyToken = (payload) =>
  new Promise((resolve, reject) =>
    jwt.verify(payload, process.env.SECRET_ACCESS, (err, decodedToken) => {
      if (err) reject(err);
      resolve(decodedToken);
    })
  );

//jwt authenticate
export const jwtAuthenticate = async(user) => {
    const accessToken = await newToken({id: user.id})
    const refreshT =  await refreshToken({id: user.id})
    // user.refresh_token = refreshT
    await prisma.user.update({
        where: {
            id: user.id
        },
        data: {
            refresh_token: refreshT
        }
    })
    console.log("jwtAut",accessToken, refreshT);
    return {accessToken, refreshT}
}

//refresh token authenticate
export const refreshTokenAuthenticate = async(refresh) => {
    try {
        const decodedRefreshT = await verifyToken(refresh)
        const currentUser = await prisma.user.findUnique({
            where: {
                id: decodedRefreshT.id
            }
        })
        if (!currentUser) throw new Error("User not found!")
        if (refresh === currentUser.refresh_token) {
            const {accessToken, refreshT} = jwtAuthenticate(currentUser)
            return {accessToken, refreshT}
        }
    } catch (error) {
        console.log(error)
    }
}
