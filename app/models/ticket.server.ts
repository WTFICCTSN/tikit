import type { User, Ticket } from "@prisma/client";

import { prisma } from "~/db.server";
// import {Ticket} from "@prisma/client";

export type { Ticket } from "@prisma/client";
//READ
export function getTicket({
                             id,
                             id_user,
                         }: Pick<Ticket, "id"> & {
    id_user: User["id"];
}) {
    return prisma.ticket.findFirst({
        where: { id, id_user },
    });
}

export function getTicketListItems({ id_user }: { id_user: User["id"] }) {
    return prisma.ticket.findMany({
        where: { id_user },
        select: { id: true, title: true  },
        orderBy: { updatedAt: "desc" },
    });
}
//Create
export function createTicket({
                               title,
                               desc,
                               userId,
                           }: Pick<Ticket, "title" | "desc"> & {
    userId: User["id"];
}) {
    return prisma.ticket.create({
        data: {
            title,
            desc,
            user: {
                connect: {
                    id: userId,
                },
            },
        },
    });
}



//REMOVE
export function deleteTicket({
                               id, id_user,
                           }: Pick<Ticket, "id"> & { id_user: User["id"] }) {
    return prisma.ticket.deleteMany({
        where: { id, id_user },
    });
}
