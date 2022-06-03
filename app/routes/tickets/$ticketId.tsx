import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useCatch, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";

import type { Ticket } from "~/models/ticket.server";
import type { Profile } from "~/models/profile.server";


import {getProfile} from "~/models/profile.server";
import { deleteTicket } from "~/models/ticket.server";
import { getTicket } from "~/models/ticket.server";
import { requireUserId } from "~/session.server";
//CONTENT TO LOAD
type LoaderData = {
    ticket: Ticket;
};

export const loader: LoaderFunction = async ({ request, params }) => {
    const id_user = await requireUserId(request);
    invariant(params.ticketId, "ticketId not found");
    console.log(params.id);

    const ticket = await getTicket({ id: params.ticketId, id_user });
    if (!ticket) {
        throw new Response("Not Found", { status: 404 });
    }
    return json<LoaderData>({ ticket });
};
//CONTENT INJECTION
export default function TicketDetailsPage() {
    const data = useLoaderData() as LoaderData;

    return (
        <div className="p-8 h-full">
            <div className="p-4 pt-8 w-full bg-opacity-75 text-white bg-slate-800">
                <h3 className="text-2xl font-thin">#{data.ticket.id} <span className='font-bold'>{data.ticket.title}</span></h3>
                <hr className="my-4" />
            </div>
            <div className=" my-4 p-4 pt-8 flex w-full bg-opacity-75 text-white bg-slate-800">
                <p className="py-6">{data.ticket.desc}</p>
            </div>
            <Form method="post">
                <button
                    type="submit"
                    className="rounded bg-slate-500  py-2 px-4 text-white hover:bg-slate-600 focus:bg-slate-400"
                >
                    Delete
                </button>
            </Form>
        </div>
    );
}



//ERROR
export function ErrorBoundary({ error }: { error: Error }) {
    console.error(error);

    return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
    const caught = useCatch();

    if (caught.status === 404) {
        return <div>Note not found</div>;
    }

    throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
