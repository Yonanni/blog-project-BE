import pkg from "@prisma/client";
import bcrypt from "bcrypt";

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
  export default prisma