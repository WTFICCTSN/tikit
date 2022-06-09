import type { User, Profile, UserType, Image, ContactsOnProfile, Contact } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Profile } from "@prisma/client";
//READ
export function getProfile( id_user: User["id"],) {
    return prisma.profile.findFirst({
        where: { id_user },
        include: {
            profilePic : true,
            contacts : {
                include:{
                    contact:true,
                }
            }
        }
    });
}


//Create
export function createProfile({
                                 first_name,
                                 last_name,
                                 id_user,
                             }: Pick<Profile, "first_name" | "last_name"> & {
    id_user: User["id"];
}) {
    return prisma.profile.create({
        data: {
            first_name,
            last_name,
            user: {
                connect: {
                    id: id_user,
                },
            },
        },
    });
}
