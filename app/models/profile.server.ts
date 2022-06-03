import type { User, Profile, Ticket, UserType, Image } from "@prisma/client";

import { prisma } from "~/db.server";
// import {Ticket} from "@prisma/client";

export type { Profile } from "@prisma/client";
//READ
export function getProfile({
                              id,
                              id_user,
                          }: Pick<Profile, "id"> & { id_user: User["id"];
}) {
    return prisma.profile.findFirst({
        where: { id, id_user },
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
