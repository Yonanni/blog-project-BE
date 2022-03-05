import prisma, { userAuthMiddleware } from "../lib/index.js";
import { Router } from "express";
import createError from "http-errors";

const articleRouter = Router()

articleRouter.post("/register", async (req, res) => {
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
  
  articleRouter.post("/", userAuthMiddleware, async (req, res, next) => {
    try {
      const { content, first_paragraph, title, category, cover, free, authorId } = req.body;
     console.log("req.user", req.user)
      const user = await prisma.user.findFirst({
          where: {
              id: req.user.id
          }
      })
      if (user.role === "Author" || user.role === "Admin") {
        const article = await prisma.article.create({
            data: {
                content, 
                first_paragraph, 
                title, 
                category, 
                cover, 
                free: true,
                authorId: req.user.id
            }
        })
  
        // console.log({"acc&ref": "helo", accessToken, refreshT })
  
        res.sendStatus(201).send();
      } else {
        next(createError(401, "Register as an Author first"));
      }
    } catch (error) {
      console.log(error);
    }
  });

export default articleRouter