import type { Password, User, UserType} from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";
// READ ------------------------------------------------------------------------------------------------
export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({
      where: { id },
      include: {
          userType: true
      }
  });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({where: {email}});
}
// CREATE ---------------------------------------------------------------------------------------------
export async function createUser(email: User["email"], password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function createTechnician(email: User["email"], password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);

    return prisma.user.create({
        data: {
            email: email,
            password: {
                create: {
                    hash: hashedPassword,
                },
            },
            id_userType: "cl3ycqrmc0247ca2l92hfqbqv",
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
