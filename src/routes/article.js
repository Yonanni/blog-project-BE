import prisma, { userAuthMiddleware } from "../lib/index.js";
import { Router } from "express";
import createError from "http-errors";

const articleRouter = Router()

articleRouter.get("/:articleId", async (req, res) => {
    try {
      const article = await prisma.article.findFirst({
        where: {
          id: req.params.articleId
        }
      })
      if (article){
        res.sendStatus(200).send(article)
      } else {
        res.sendStatus(404).send(`${req.params.articleId} NOT found!`)
      }
    } catch (error) {
      console.log(error)
    }
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