import type { ActionFunction } from "@remix-run/node";
import {json, LoaderFunction, redirect} from "@remix-run/node";
import {Form, NavLink, useActionData, useLoaderData} from "@remix-run/react";
import * as React from "react";

import {Machine, Ticket} from "@prisma/client";
import { User } from "@prisma/client";

import {createTicket, getTicketListItems} from "~/models/ticket.server";
import { getPriorityTypes } from "~/models/ticket.server";
import { requireUserId } from "~/session.server";
import is from "@sindresorhus/is";
import integer = is.integer;
import {getUsersByUserType} from "~/models/user.server";
import {getAllMachines, getMachineListItems} from "~/models/machine.server";


type LoaderData = {
    priorityTypes: Awaited<ReturnType<typeof getPriorityTypes>>;
    technicians: Awaited<ReturnType<typeof getUsersByUserType>>;
    clients : Awaited<ReturnType<typeof getUsersByUserType>>;
    machines : Awaited<ReturnType<typeof getAllMachines>>;
};

export const loader: LoaderFunction = async ({ request }) => {
    const id_user = await requireUserId(request);
    const technicians = await getUsersByUserType("Technician");
    const clients = await getUsersByUserType("Client");
    const priorityTypes = await getPriorityTypes();
    const machines = await getAllMachines()

    return json<LoaderData>({ priorityTypes, technicians, clients,machines });
};

type ActionData = {
    errors?: {
        title?: string;
        desc?: string;
        clients ?: string;
    };
};

export const action: ActionFunction = async ({ request }) => {
    const userId = await requireUserId(request);
    const formData = await request.formData();
    const title = formData.get("title");
    const desc = formData.get("desc");
    let prioridadeN = formData.get("priority");
    let techId = userId;
    let clientId= formData.get("clients");


    if (typeof title !== "string" || title.length === 0) {
        return json<ActionData>(
            { errors: { title: "Title is required" } },
            { status: 400 }
        );
    }

    if (typeof desc !== "string" || desc.length === 0) {
        return json<ActionData>(
            { errors: { desc: "desc is required" } },
            { status: 400 }
        );
    }
    if (typeof prioridadeN !== "number" || desc.length === 0){
        return json<ActionData>(
            { errors: { desc: "priority is required" } },
            { status: 400 }
        );
    }



    const ticket = await createTicket({ title, desc, techId,clientId,prioridadeN });

    return redirect(`/tickets/${ticket.id}`);
};

export default function NewTicketPage() {
    const data = useLoaderData() as LoaderData;
    const actionData = useActionData() as ActionData;
    const titleRef = React.useRef<HTMLInputElement>(null);
    const bodyRef = React.useRef<HTMLTextAreaElement>(null);
    const priorityRef = React.useRef<HTMLInputElement>(null);
    const clientsRef = React.useRef<HTMLSelectElement>(null);
    const machinesRef = React.useRef<HTMLSelectElement>(null);



    React.useEffect(() => {
        if (actionData?.errors?.title) {
            titleRef.current?.focus();
        } else if (actionData?.errors?.desc) {
            bodyRef.current?.focus();
        }
    }, [actionData]);

    return (
        <Form
            method="post"
            style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
                width: "100%",
            }}
        >
            <div>
                <label className="flex w-full flex-col gap-1">
                    <span>Title: </span>
                    <input
                        ref={titleRef}
                        name="title"
                        className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
                        aria-invalid={actionData?.errors?.title ? true : undefined}
                        aria-errormessage={
                            actionData?.errors?.title ? "title-error" : undefined
                        }
                    />
                </label>
                {actionData?.errors?.title && (
                    <div className="pt-1 text-red-700" id="title-error">
                        {actionData.errors.title}
                    </div>
                )}
            </div>
            <div>
                <label htmlFor="checkboxes" className="block text-sm font-medium text-gray-700"> Prioridade: </label>
                <div id="checkboxes" className="inline-flex w-full">
                        <p className="p-4 text-white">No priorities</p>
                            {data.priorityTypes.map((prioridade) => (
                                    <label className="mr-6 p-6">
                                        <input className="mr-1" name="priority" type="radio" value={prioridade.name} ref={priorityRef} defaultChecked={true} />
                                        {prioridade.name}
                                    </label>
                            ))}
                </div>
            </div>
            <div>
                <label htmlFor="clients" className="block text-sm font-medium text-gray-700"> Clients </label>
                <select name="clients" onSelect={machinesRef.current.options=} ref={clientsRef}>
                    {data.clients.map((client) => (
                        <option value={client.id}>{client.profile.first_name} {client.profile.last_name}</option>
                    ))};
                </select>
            </div>
            <label htmlFor="Machines" className="block text-sm font-medium text-gray-700"> Machine </label>
            <select name="Machines" ref={machinesRef}>
                {data.machines.map((machine) => (
                    <option value={machine.id}>{machine.title}</option>
                ))};
            </select>
            <div>
                {/*}
                <label htmlFor="Machines" className="block text-sm font-medium text-gray-700"> Machine </label>
                <select name="Machines" ref={clientsRef}>
                    {data.clients.map((client) => (
                        <option value={client.users.profile.id_user}>{client.users.profile.first_name} + ' ' + {client.users.profile.last_name}</option>
                    ))};
                </select> */}
            </div>
            <div>
                <label className="flex w-full flex-col gap-1">
                    <span>Body: </span>
                    <textarea
                        ref={bodyRef}
                        name="desc"
                        rows={8}
                        className="w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6"
                        aria-invalid={actionData?.errors?.desc ? true : undefined}
                        aria-errormessage={
                            actionData?.errors?.desc ? "body-error" : undefined
                        }
                    />
                </label>
                {actionData?.errors?.desc && (
                    <div className="pt-1 text-red-700" id="body-error">
                        {actionData.errors.desc}
                    </div>
                )}
            </div>

            <div className="text-right">
                <button
                    type="submit"
                    className="rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
                >
                    Save
                </button>
            </div>
        </Form>
    );
}
