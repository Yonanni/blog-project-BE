import { Router } from "express";
import { checkCredential } from "../lib/index.js";
import prisma from "../lib/index.js";
import bcrypt from "bcrypt"

import { jwtAuthenticate } from "../lib/tokenVerify.js";
import createHttpError from "http-errors";

const userRouter = Router();

userRouter.get("/", async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      username: true,
      Comment: true,
    },
  });
  res.send(users);
});

userRouter.post("/register", async (req, res) => {
  const { firstName, lastName, email, role, password} = req.body;
  const pass = await bcrypt.hash(password, 10)
  const isUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUser) {
    return res.send("user exist");
  }
  const newUser = await prisma.user.create({
    data: {
      email,
      firstName,
      lastName,
      role,
      password: pass
    },
  });
  
  res.send(newUser);
});

userRouter.post("/login", async (req, res) => {
  try {
    const { password, email } = req.body;
   
    const user = await checkCredential(email, password);
    if (user) {
      const { accessToken, refreshT } = await jwtAuthenticate(user);

      console.log({"acc&ref": "helo", accessToken, refreshT })

      res.send({ accessToken, refreshT });
    } else {
      createHttpError(401, "Invalid email/password");
    }
  } catch (error) {
    console.log(error);
  }
});

export default userRouter;
