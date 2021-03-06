import type { Password, User, UserType, Profile} from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";
import {Simulate} from "react-dom/test-utils";
import select = Simulate.select;

export type { User } from "@prisma/client";
// READ ------------------------------------------------------------------------------------------------
export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({
      where: { id },
      include: {
          userType: true,
      }
  });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({
    where: {email},
    include: {
      userType: true,
    }
  });
}

export async function getUsersByUserType (name : UserType["name"]){
  return prisma.user.findMany({
    where: {
      userType:{
        name: name,
      }
    },include : {
      profile: true,
      userType: true,
    }

  })
}

// CREATE ---------------------------------------------------------------------------------------------
export async function createUser(email: User["email"], password: string, userType: User["id_userType"], fsName:string, lsName:string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const hashedEmail    = await bcrypt.hash(email, 10)
  return prisma.user.create({
    data: {
      email : email,
      id_userType: userType,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      profile: {
        create: {
          first_name:fsName,
          last_name:lsName,
          profilePic:{
            create:{
              name: fsName.toLowerCase() + "-" + lsName.toLowerCase()  + "_profile",
              url: "https://www.gravatar.com/avatar/"+ hashedEmail +"?s=320&d=identicon&r=PG",
              createdBy : fsName + " " + lsName,
            }
          },
          contacts:{
            create:{
              assignedBy:fsName + " " + lsName,
              contact:{
                create:{
                  email:true,
                  phone:false,
                  name: "Email",
                  info: email,
                }
              }
            }


          }
        },
      }
    },
  });
}

// DESTROY -----------------------------------------------------------------------------------------
export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

// HELPER ------------------------------------------------------------------------------------------
export async function verifyLogin(
  email: User["email"],
  password: Password["hash"]
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash
  );

  if (!isValid) {
    return null;
  }

  const { password: _password, ...userWithoutPassword } = userWithPassword;

  return userWithoutPassword;
}
