import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {Form, NavLink, useCatch, useLoaderData} from "@remix-run/react";
import invariant from "tiny-invariant";

import type { Profile } from "~/models/profile.server";
import { getProfile } from "~/models/profile.server";

import { requireUserId } from "~/session.server";
//CONTENT TO LOAD
type LoaderData = {
    profile: Profile;
};

export const loader: LoaderFunction = async ({ request, params }) => {
    const id_user = await requireUserId(request);
    invariant(params.profileId, "profileId not found");
    console.log(params.id);

    const profile = await getProfile({ id: params.profileId, id_user });
    if (!profile) {
        throw new Response("Not Found", { status: 404 });
    }
    return json<LoaderData>({ profile });
};
//CONTENT INJECTION
export default function TicketDetailsPage() {
    const data = useLoaderData() as LoaderData;

    return (
        <div className="p-8 h-full">
            <div className="p-4 pt-8 flex w-full bg-opacity-75 bg-slate-800">
                <div className="w-1/5 h-1/5">
                    <img className="rounded-full " src={data.profile.profilePic.url} />
                </div>
                <div className="pl-8 w-full">
                    <h3 className="text-6xl text-white font-thin">#{data.profile.id} <span className='font-bold'>{data.profile.first_name} {data.profile.last_name}</span>
                    </h3>
                    <hr className="my-4" />
                    <div className=" text-white">
                        {data.profile.contacts.length === 0 ? (
                            <p className="p-4 text-white">Feels Lonely In Here</p>
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

            {/*<Form method="post">*/}
            {/*    <button*/}
            {/*        type="submit"*/}
            {/*        className="rounded bg-purple-500  py-2 px-4 text-white hover:bg-purple-600 focus:bg-purple-400"*/}
            {/*    >*/}
            {/*        Delete*/}
            {/*    </button>*/}
            {/*</Form>*/}
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
