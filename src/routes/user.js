import { Router } from "express";
import { checkCredential, userAuthMiddleware } from "../lib/index.js";
import prisma from "../lib/index.js";
import bcrypt from "bcrypt"
import { jwtAuthenticate } from "../lib/tokenVerify.js";
import createError from "http-errors";

const userRouter = Router();

userRouter.get("/allAuthors", async (req, res) => {
  const users = await prisma.user.findMany({
    where: {
      role: "Author"
    }
  });
  res.send(users);
});

userRouter.post("/register", async (req, res, next) => {
  const { firstName, lastName, email, role, password} = req.body;
  const pass = await bcrypt.hash(password, 10)
  const isUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (isUser) {
    return res.send("user exist");
  } else {

    const newUser = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        role,
        password: pass
      },
    });
    
    res.sendStatus(201).send(newUser);
  }
});

userRouter.post("/login", async (req, res, next) => {
  try {
    const { password, email } = req.body;
   
    const user = await checkCredential(email, password);
    if (user) {
      const { accessToken, refreshT } = await jwtAuthenticate(user);

      // console.log({"acc&ref": "helo", accessToken, refreshT })

      res.send({ accessToken, refreshT });
    } else {
      next(createError(401, "Invalid email/password"));
    }
  } catch (error) {
    console.log(error);
  }
});

userRouter.post("/author/toWrite", userAuthMiddleware, async (req, res, next) => {
  try {
    const { about, publication_category, publication_name } = req.body;
    const author = await prisma.user.update({
      where: {
        id:req.user.id,
      },
      data: {
        about,
        publication_category, 
        role: "Author",
        publication_name, 
        
      }
    })
    if (!author){
      res.sendStatus(404).send(`${req.user.id} NOT found`)
    }else {
      res.send(author)
    }
  } catch (error) {
    console.log(error);
  }
});


export default userRouter;
