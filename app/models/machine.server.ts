import type { User, Profile, Machine } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Machine } from "@prisma/client";

export async function getMachineById(id: Machine["id"]) {
    return prisma.machine.findUnique({
        where: { id },
        include: {
            tickets: true,
            user:true,
            
        }
    });
}

export function getMachineListItems({ id_user }: { id_user: Machine["id_user"] }) {
    return prisma.machine.findMany({
        where: { id_user },
        orderBy: { updatedAt: "desc" },
    });
}

export function getAllMachines(){
    return prisma.ticket.findMany();
}
