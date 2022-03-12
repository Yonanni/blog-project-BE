import prisma, { userAuthMiddleware } from "../lib/index.js";
import { Router } from "express";
import createError from "http-errors";

const commentRouter = Router()

commentRouter.post("/", userAuthMiddleware, async (req, res, next) => {
    const { comment, userId, article_Id } = req.body;
    const isUser = await prisma.user.findUnique({
      where: {
        id: req.user.id
      },
    });
  
    if (isUser) {
        const newComment = await prisma.comment.create({
          data: {
            comment,
            userId: req.user.id,
            article_Id,
          },
        });
      return res.send();
    } else {
        next(createError(401, "You need to login first"))
    }
    
    
  });
  
  

export default commentRouter