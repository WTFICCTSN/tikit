import type { User, Ticket, PriorityType, Machine } from "@prisma/client";

import { prisma } from "~/db.server";

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

export function getPriorityTypes(){
    return prisma.priorityType.findMany()
}

//Create
export function createTicket({   title,
                                 desc,
                                 techId ,
                                 clientId,
                                 prioridadeN,
                                 } :
                                 {
                                  title: Ticket["title"],
                                  techId: User["id"] ,
                                  desc: Ticket["desc"],
                                  clientId : User["id"],
                                  prioridadeN : PriorityType["name"],
                                  client_machine : Machine["id"] }
) {
    return prisma.ticket.create({
        data: {
            title,
            desc,
            prioridade: {
              connect: {
                    name : prioridadeN,
                  }
              },
            client: {
                connect: {
                    id : clientId,
                },
            },
            technician:{
                connect:{
                    id: techId,
                }
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
