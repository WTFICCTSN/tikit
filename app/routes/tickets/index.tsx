import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getTicketListItems } from "~/models/ticket.server";


type LoaderData = {
    ticketListItems: Awaited<ReturnType<typeof getTicketListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
    const id_user = await requireUserId(request);
    const ticketListItems = await getTicketListItems({ id_user });
    return json<LoaderData>({ ticketListItems });
};

export default function TicketsIndexPage() {
    const data = useLoaderData() as LoaderData;
    // const user = useUser()
    return (
        <div className="p-8 h-full">
            <div className="p-4 pt-8 w-full bg-opacity-75 bg-slate-800">
                {data.ticketListItems.length === 0 ? (
                 <p className="p-4 text-white">Feels Lonely In Here</p>
                ) : (
                <ol className="grid grid-cols-4 gap-2 sm:grid-cols-2">
                    {data.ticketListItems.map((ticket) => (
                        <li className="p-2 bg-purple-800 shadow-xl rounded" key={ticket.id}>
                            <NavLink
                                className={({ isActive }) =>
                                    `block border-b border-slate-900 p-4 text-white text-xl ${isActive ? "bg-purple-700 underline" : ""}`
                                }
                                to={ticket.id}
                            >
                                {ticket.title}
                            </NavLink>
                        </li>
                    ))}
                </ol>
            )}
            </div>
        </div>
    );
}