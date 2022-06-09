import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {Form, NavLink, useCatch, useLoaderData} from "@remix-run/react";
import invariant from "tiny-invariant";

import type { Profile } from "~/models/profile.server";
import type { Ticket } from "~/models/ticket.server";
import { getProfile } from "~/models/profile.server";
import { getTicketListItems} from "~/models/ticket.server";
import { requireUserId } from "~/session.server";
//CONTENT TO LOAD
type LoaderData = {
    profile: Profile;
    ticketListItems: Awaited<ReturnType<typeof getTicketListItems>>;
};

export const loader: LoaderFunction = async ({ request }) => {
    const id_user = await requireUserId(request);
    const profile = await getProfile( id_user );
    const ticketListItems = await getTicketListItems({ id_user });
    if (!profile) {
        throw new Response("Not Found", { status: 404 });
    }
    return json<LoaderData>({ profile , ticketListItems });
};
//CONTENT INJECTION
export default function ProfilePage() {
    const data = useLoaderData() as LoaderData;
    console.log(data);
    let ticket_url: string;
    return (
        <div className="">
            <div className="p-8 ">
                <div className="p-4 pt-8 flex w-full bg-opacity-75 bg-slate-800">
                    <div className="w-1/5 h-1/5">
                        <img className="rounded-full " src={data.profile.profilePic.url} alt={data.profile.profilePic.name}/>
                    </div>
                    <div className="pl-8 w-full">
                        <h3 className="text-6xl text-white font-thin">#{data.profile.id} <span className='font-bold'>{data.profile.first_name} {data.profile.last_name}</span>
                        </h3>
                        <hr className="my-4" />
                        <div className=" text-white">
                            {data.profile.contacts.length === 0 ? (
                                <p className="p-4 text-white">No Contacts Available Yet</p>
                            ) : (
                                <ol className="inline-flex">
                                    {data.profile.contacts.map((contacto) => (
                                        <li className="pr-6" key={contacto.contact.id}>
                                            <span className="font-bold">{contacto.contact.name} </span> : <span className="underline">{contacto.contact.info}</span>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-8 pt-0">
            <div className=" pl-8 my-4 p-4 flex w-full bg-opacity-75 bg-slate-800">
                {data.ticketListItems.length === 0 ? (
                    <p className="p-4 text-white">Feels Lonely In Here</p>
                ) : (
                    <ol className="w-full">
                        {data.ticketListItems.map((ticket) => (


                            <NavLink to={"/tickets/"+ ticket.id}>
                            <li key={ticket.id} className="p-4 pb-8 w-full">
                                <h3 className="text-2xl text-white font-thin hover:text-slate-600">#{ticket.id} <span className='font-bold'>{ticket.title}</span></h3><hr></hr>
                            </li>
                            </NavLink>
                            ))}
                    </ol>
                )}
            </div>
        </div>
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
        return <div>User not found</div>;
    }

    throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
