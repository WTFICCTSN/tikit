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

export default function TicketsPage() {
    const data = useLoaderData() as LoaderData;
    const user = useUser();
    return (
        <div className="flex h-full min-h-screen flex-col">
            <header className="flex items-center justify-between bg-purple-800 p-4 text-white">
                <h1 className="text-3xl font-bold">
                    <Link to=".">TIKIT</Link>
                </h1>
                <Link to="/profile/'{data.profile.id}'" className="block p-4 text-xl text-white underline border-slate-900" >
                    <p className="text-white">{user.email}</p>
                </Link>
                <Form action="/logout" method="post">
                    <button
                        type="submit"
                        className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-slate-500 active:bg-slate-600"
                    >
                        Logout
                    </button>
                </Form>
            </header>

            <main className="flex h-full loginGradient">
                <div className="h-full w-80 border-r border-slate-900 bg-slate-800">
                    <Link to="new" className="block p-4 text-xl text-white underline border-slate-900" >
                        Create Ticket
                    </Link>

                    <hr />

                    {data.ticketListItems.length === 0 ? (
                        <p className="p-4 text-white">Feels Lonely In Here</p>
                    ) : (
                        <ol>
                            {data.ticketListItems.map((ticket) => (
                                <li key={ticket.id}>
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

                <div className="flex-1 p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}