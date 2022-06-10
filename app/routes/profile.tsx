import type { LoaderFunction } from "@remix-run/node";
import {json, MetaFunction} from "@remix-run/node";
import { Form, Link, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useUser } from "~/utils";
import { getProfile } from "~/models/profile.server";
import { getUserById } from "~/models/user.server";
import {getTicketListItems} from "~/models/ticket.server";
import * as React from "react";


type LoaderData = {
    profile: Awaited<ReturnType<typeof getProfile>>;
    user : Awaited<ReturnType<typeof getUserById>>;
    ticketListItems: Awaited<ReturnType<typeof getTicketListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
    const id_user = await requireUserId(request);
    const profile = await getProfile(id_user);
    const user = await getUserById(id_user);
    const ticketListItems = await getTicketListItems({ id_user });
    return json<LoaderData>({ profile, user, ticketListItems });
};
export const meta: MetaFunction = () => {
    return {
        title: "User Profile - TiKiT",
        charSet: "utf-8",
    };
};
export default function ProfileIndexPage() {
    const data = useLoaderData() as LoaderData;
    const user = useUser();
    //let ticket_url ="tickets";
    // const ticketsRef = React.useRef<HTMLInputElement>(null);

    return (
        <div className="flex h-full min-h-screen flex-col">
            <header className="flex items-center justify-between bg-purple-800 p-4 text-white">
                <h1 className="text-3xl font-bold">
                    <Link to="/tickets">TIKIT</Link>
                </h1>
                <Link to="" className="block p-4 text-xl text-white underline border-slate-900" >
                    <p className="text-white">{user.email}</p>
                </Link>
                <Form action="/logout" method="post">
                    <button
                        type="submit"
                        className="rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
                    >
                        Logout
                    </button>
                </Form>
            </header>

            <main className="flex h-full loginGradient">
                <div className="h-full w-80 border-r border-slate-900 bg-slate-800">
                    {data.user.userType.name == "Client" ? (
                        <p className="text-3xl text-white">Tikets</p>
                        ):(
                            <><Link to="/tickets/new" className="block p-4 text-xl text-white underline border-slate-900">
                                Create Ticket
                            </Link>
                                <hr/>
                            </>
                    )};

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
                                        to={"/tickets/"+ ticket.id}

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