var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __reExport = (target, module2, copyDefault, desc) => {
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && (copyDefault || key !== "default"))
        __defProp(target, key, { get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable });
  }
  return target;
};
var __toESM = (module2, isNodeMode) => {
  return __reExport(__markAsModule(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", !isNodeMode && module2 && module2.__esModule ? { get: () => module2.default, enumerable: true } : { value: module2, enumerable: true })), module2);
};
var __toCommonJS = /* @__PURE__ */ ((cache) => {
  return (module2, temp) => {
    return cache && cache.get(module2) || (temp = __reExport(__markAsModule({}), module2, 1), cache && cache.set(module2, temp), temp);
  };
})(typeof WeakMap !== "undefined" ? /* @__PURE__ */ new WeakMap() : 0);

// <stdin>
var stdin_exports = {};
__export(stdin_exports, {
  assets: () => assets_manifest_default,
  entry: () => entry,
  routes: () => routes
});

// node_modules/@remix-run/dev/compiler/shims/react.ts
var React = __toESM(require("react"));

// app/entry.server.tsx
var entry_server_exports = {};
__export(entry_server_exports, {
  default: () => handleRequest
});
var import_react = require("@remix-run/react");
var import_server = require("react-dom/server");
function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  const markup = (0, import_server.renderToString)(/* @__PURE__ */ React.createElement(import_react.RemixServer, {
    context: remixContext,
    url: request.url
  }));
  responseHeaders.set("Content-Type", "text/html");
  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders
  });
}

// route:/home/wtficctsn/PhpstormProjects/TIKIT/app/root.tsx
var root_exports = {};
__export(root_exports, {
  default: () => App,
  links: () => links,
  loader: () => loader,
  meta: () => meta
});
var import_node2 = require("@remix-run/node");
var import_react2 = require("@remix-run/react");

// app/styles/tailwind.css
var tailwind_default = "/build/_assets/tailwind-MSOIWHSN.css";

// app/styles/gen.css
var gen_default = "/build/_assets/gen-Z4NRALPD.css";

// app/session.server.ts
var import_node = require("@remix-run/node");
var import_tiny_invariant = __toESM(require("tiny-invariant"));

// app/models/user.server.ts
var import_bcryptjs = __toESM(require("bcryptjs"));

// app/db.server.ts
var import_client = require("@prisma/client");
var prisma;
if (false) {
  prisma = new import_client.PrismaClient();
} else {
  if (!global.__db__) {
    global.__db__ = new import_client.PrismaClient();
  }
  prisma = global.__db__;
  prisma.$connect();
}

// app/models/user.server.ts
async function getUserById(id) {
  return prisma.user.findUnique({ where: { id } });
}
async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}
async function createTechnician(email, password) {
  const hashedPassword = await import_bcryptjs.default.hash(password, 10);
  return prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword
        }
      }
    }
  });
}
async function verifyLogin(email, password) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      password: true
    }
  });
  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }
  const isValid = await import_bcryptjs.default.compare(password, userWithPassword.password.hash);
  if (!isValid) {
    return null;
  }
  const _a = userWithPassword, { password: _password } = _a, userWithoutPassword = __objRest(_a, ["password"]);
  return userWithoutPassword;
}

// app/session.server.ts
(0, import_tiny_invariant.default)(process.env.SESSION_SECRET, "SESSION_SECRET must be set");
var sessionStorage = (0, import_node.createCookieSessionStorage)({
  cookie: {
    name: "__session",
    httpOnly: true,
    maxAge: 0,
    path: "/",
    sameSite: "lax",
    secrets: [process.env.SESSION_SECRET],
    secure: false
  }
});
var USER_SESSION_KEY = "userId";
async function getSession(request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}
async function getUserId(request) {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
}
async function getUser(request) {
  const userId = await getUserId(request);
  if (userId === void 0)
    return null;
  const user = await getUserById(userId);
  if (user)
    return user;
  throw await logout(request);
}
async function requireUserId(request, redirectTo = new URL(request.url).pathname) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw (0, import_node.redirect)(`/login?${searchParams}`);
  }
  return userId;
}
async function createUserSession({
  request,
  userId,
  remember,
  redirectTo
}) {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, userId);
  return (0, import_node.redirect)(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember ? 60 * 60 * 24 * 7 : void 0
      })
    }
  });
}
async function logout(request) {
  const session = await getSession(request);
  return (0, import_node.redirect)("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session)
    }
  });
}

// route:/home/wtficctsn/PhpstormProjects/TIKIT/app/root.tsx
var links = () => {
  return [
    { rel: "stylesheet", href: tailwind_default },
    { rel: "stylesheet", href: gen_default }
  ];
};
var meta = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1"
});
var loader = async ({ request }) => {
  return (0, import_node2.json)({
    user: await getUser(request)
  });
};
function App() {
  return /* @__PURE__ */ React.createElement("html", {
    lang: "en",
    className: "h-full"
  }, /* @__PURE__ */ React.createElement("head", null, /* @__PURE__ */ React.createElement(import_react2.Meta, null), /* @__PURE__ */ React.createElement(import_react2.Links, null)), /* @__PURE__ */ React.createElement("body", {
    className: "h-full"
  }, /* @__PURE__ */ React.createElement(import_react2.Outlet, null), /* @__PURE__ */ React.createElement(import_react2.ScrollRestoration, null), /* @__PURE__ */ React.createElement(import_react2.Scripts, null), /* @__PURE__ */ React.createElement(import_react2.LiveReload, null)));
}

// route:/home/wtficctsn/PhpstormProjects/TIKIT/app/routes/healthcheck.tsx
var healthcheck_exports = {};
__export(healthcheck_exports, {
  loader: () => loader2
});
var loader2 = async ({ request }) => {
  const host = request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");
  try {
    const url = new URL("/", `http://${host}`);
    await Promise.all([
      prisma.user.count(),
      fetch(url.toString(), { method: "HEAD" }).then((r) => {
        if (!r.ok)
          return Promise.reject(r);
      })
    ]);
    return new Response("OK");
  } catch (error) {
    console.log("healthcheck \u274C", { error });
    return new Response("ERROR", { status: 500 });
  }
};

// route:/home/wtficctsn/PhpstormProjects/TIKIT/app/routes/userTypes.tsx
var userTypes_exports = {};

// route:/home/wtficctsn/PhpstormProjects/TIKIT/app/routes/profile.tsx
var profile_exports = {};
__export(profile_exports, {
  default: () => TicketsPage,
  loader: () => loader3
});
var import_node3 = require("@remix-run/node");
var import_react5 = require("@remix-run/react");

// app/utils.ts
var import_react3 = require("@remix-run/react");
var import_react4 = require("react");
var DEFAULT_REDIRECT = "/";
function safeRedirect(to, defaultRedirect = DEFAULT_REDIRECT) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }
  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }
  return to;
}
function useMatchesData(id) {
  const matchingRoutes = (0, import_react3.useMatches)();
  const route = (0, import_react4.useMemo)(() => matchingRoutes.find((route2) => route2.id === id), [matchingRoutes, id]);
  return route == null ? void 0 : route.data;
}
function isUser(user) {
  return user && typeof user === "object" && typeof user.email === "string";
}
function useOptionalUser() {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return void 0;
  }
  return data.user;
}
function useUser() {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error("No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.");
  }
  return maybeUser;
}
function validateEmail(email) {
  return typeof email === "string" && email.length > 3 && email.includes("@");
}

// app/models/ticket.server.ts
function getTicket({
  id,
  id_user
}) {
  return prisma.ticket.findFirst({
    where: { id, id_user }
  });
}
function getTicketListItems({ id_user }) {
  return prisma.ticket.findMany({
    where: { id_user },
    select: { id: true, title: true },
    orderBy: { updatedAt: "desc" }
  });
}
function createTicket({
  title,
  desc,
  userId
}) {
  return prisma.ticket.create({
    data: {
      title,
      desc,
      user: {
        connect: {
          id: userId
        }
      }
    }
  });
}

// route:/home/wtficctsn/PhpstormProjects/TIKIT/app/routes/profile.tsx
var loader3 = async ({ request }) => {
  const id_user = await requireUserId(request);
  const ticketListItems = await getTicketListItems({ id_user });
  return (0, import_node3.json)({ ticketListItems });
};
function TicketsPage() {
  const data = (0, import_react5.useLoaderData)();
  const user = useUser();
  return /* @__PURE__ */ React.createElement("div", {
    className: "flex h-full min-h-screen flex-col"
  }, /* @__PURE__ */ React.createElement("header", {
    className: "flex items-center justify-between bg-purple-800 p-4 text-white"
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "text-3xl font-bold"
  }, /* @__PURE__ */ React.createElement(import_react5.Link, {
    to: "."
  }, "TIKIT")), /* @__PURE__ */ React.createElement(import_react5.Link, {
    to: "/profile/'{data.profile.id}'",
    className: "block p-4 text-xl text-white underline border-slate-900"
  }, /* @__PURE__ */ React.createElement("p", {
    className: "text-white"
  }, user.email)), /* @__PURE__ */ React.createElement(import_react5.Form, {
    action: "/logout",
    method: "post"
  }, /* @__PURE__ */ React.createElement("button", {
    type: "submit",
    className: "rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
  }, "Logout"))), /* @__PURE__ */ React.createElement("main", {
    className: "flex h-full loginGradient"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "h-full w-80 border-r border-slate-900 bg-slate-800"
  }, /* @__PURE__ */ React.createElement(import_react5.Link, {
    to: "new",
    className: "block p-4 text-xl text-white underline border-slate-900"
  }, "Create Ticket"), /* @__PURE__ */ React.createElement("hr", null), data.ticketListItems.length === 0 ? /* @__PURE__ */ React.createElement("p", {
    className: "p-4 text-white"
  }, "Feels Lonely In Here") : /* @__PURE__ */ React.createElement("ol", null, data.ticketListItems.map((ticket) => /* @__PURE__ */ React.createElement("li", {
    key: ticket.id
  }, /* @__PURE__ */ React.createElement(import_react5.NavLink, {
    className: ({ isActive }) => `block border-b border-slate-900 p-4 text-white text-xl ${isActive ? "bg-purple-700 underline" : ""}`,
    to: "/tickets/'{ticket.id}'"
  }, ticket.title))))), /* @__PURE__ */ React.createElement("div", {
    className: "flex-1 p-6"
  }, /* @__PURE__ */ React.createElement(import_react5.Outlet, null))));
}

// route:/home/wtficctsn/PhpstormProjects/TIKIT/app/routes/profile/$profileId.tsx
var profileId_exports = {};
__export(profileId_exports, {
  CatchBoundary: () => CatchBoundary,
  ErrorBoundary: () => ErrorBoundary,
  default: () => TicketDetailsPage,
  loader: () => loader4
});
var import_node4 = require("@remix-run/node");
var import_react6 = require("@remix-run/react");
var import_tiny_invariant2 = __toESM(require("tiny-invariant"));

// app/models/profile.server.ts
function getProfile({
  id,
  id_user
}) {
  return prisma.profile.findFirst({
    where: { id, id_user },
    include: {
      profilePic: true,
      contacts: {
        include: {
          contact: true
        }
      }
    }
  });
}

// route:/home/wtficctsn/PhpstormProjects/TIKIT/app/routes/profile/$profileId.tsx
var loader4 = async ({ request, params }) => {
  const id_user = await requireUserId(request);
  (0, import_tiny_invariant2.default)(params.profileId, "profileId not found");
  console.log(params.id);
  const profile = await getProfile({ id: params.profileId, id_user });
  if (!profile) {
    throw new Response("Not Found", { status: 404 });
  }
  return (0, import_node4.json)({ profile });
};
function TicketDetailsPage() {
  const data = (0, import_react6.useLoaderData)();
  return /* @__PURE__ */ React.createElement("div", {
    className: "p-8 h-full"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "p-4 pt-8 flex w-full bg-opacity-75 bg-slate-800"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "w-1/5 h-1/5"
  }, /* @__PURE__ */ React.createElement("img", {
    className: "rounded-full ",
    src: data.profile.profilePic.url
  })), /* @__PURE__ */ React.createElement("div", {
    className: "pl-8 w-full"
  }, /* @__PURE__ */ React.createElement("h3", {
    className: "text-6xl text-white font-thin"
  }, "#", data.profile.id, " ", /* @__PURE__ */ React.createElement("span", {
    className: "font-bold"
  }, data.profile.first_name, " ", data.profile.last_name)), /* @__PURE__ */ React.createElement("hr", {
    className: "my-4"
  }), /* @__PURE__ */ React.createElement("div", {
    className: " text-white"
  }, data.profile.contacts.length === 0 ? /* @__PURE__ */ React.createElement("p", {
    className: "p-4 text-white"
  }, "Feels Lonely In Here") : /* @__PURE__ */ React.createElement("ol", {
    className: "inline-flex"
  }, data.profile.contacts.map((contacto) => /* @__PURE__ */ React.createElement("li", {
    className: "pr-6",
    key: contacto.contact.id
  }, /* @__PURE__ */ React.createElement("span", {
    className: "font-bold"
  }, contacto.contact.name, " "), " : ", /* @__PURE__ */ React.createElement("span", {
    className: "underline"
  }, contacto.contact.info))))))));
}
function ErrorBoundary({ error }) {
  console.error(error);
  return /* @__PURE__ */ React.createElement("div", null, "An unexpected error occurred: ", error.message);
}
function CatchBoundary() {
  const caught = (0, import_react6.useCatch)();
  if (caught.status === 404) {
    return /* @__PURE__ */ React.createElement("div", null, "User not found");
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

// route:/home/wtficctsn/PhpstormProjects/TIKIT/app/routes/tickets.tsx
var tickets_exports = {};
__export(tickets_exports, {
  default: () => TicketsPage2,
  loader: () => loader5
});
var import_node5 = require("@remix-run/node");
var import_react7 = require("@remix-run/react");
var loader5 = async ({ request }) => {
  const id_user = await requireUserId(request);
  const ticketListItems = await getTicketListItems({ id_user });
  return (0, import_node5.json)({ ticketListItems });
};
function TicketsPage2() {
  const data = (0, import_react7.useLoaderData)();
  const user = useUser();
  return /* @__PURE__ */ React.createElement("div", {
    className: "flex h-full min-h-screen flex-col"
  }, /* @__PURE__ */ React.createElement("header", {
    className: "flex items-center justify-between bg-purple-800 p-4 text-white"
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "text-3xl font-bold"
  }, /* @__PURE__ */ React.createElement(import_react7.Link, {
    to: "."
  }, "TIKIT")), /* @__PURE__ */ React.createElement(import_react7.Link, {
    to: "/profile/'{data.profile.id}'",
    className: "block p-4 text-xl text-white underline border-slate-900"
  }, /* @__PURE__ */ React.createElement("p", {
    className: "text-white"
  }, user.email)), /* @__PURE__ */ React.createElement(import_react7.Form, {
    action: "/logout",
    method: "post"
  }, /* @__PURE__ */ React.createElement("button", {
    type: "submit",
    className: "rounded bg-slate-600 py-2 px-4 text-blue-100 hover:bg-slate-500 active:bg-slate-600"
  }, "Logout"))), /* @__PURE__ */ React.createElement("main", {
    className: "flex h-full loginGradient"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "h-full w-80 border-r border-slate-900 bg-slate-800"
  }, /* @__PURE__ */ React.createElement(import_react7.Link, {
    to: "new",
    className: "block p-4 text-xl text-white underline border-slate-900"
  }, "Create Ticket"), /* @__PURE__ */ React.createElement("hr", null), data.ticketListItems.length === 0 ? /* @__PURE__ */ React.createElement("p", {
    className: "p-4 text-white"
  }, "Feels Lonely In Here") : /* @__PURE__ */ React.createElement("ol", null, data.ticketListItems.map((ticket) => /* @__PURE__ */ React.createElement("li", {
    key: ticket.id
  }, /* @__PURE__ */ React.createElement(import_react7.NavLink, {
    className: ({ isActive }) => `block border-b border-slate-900 p-4 text-white text-xl ${isActive ? "bg-purple-700 underline" : ""}`,
    to: ticket.id
  }, ticket.title))))), /* @__PURE__ */ React.createElement("div", {
    className: "flex-1 p-6"
  }, /* @__PURE__ */ React.createElement(import_react7.Outlet, null))));
}

// route:/home/wtficctsn/PhpstormProjects/TIKIT/app/routes/tickets/$ticketId.tsx
var ticketId_exports = {};
__export(ticketId_exports, {
  CatchBoundary: () => CatchBoundary2,
  ErrorBoundary: () => ErrorBoundary2,
  default: () => TicketDetailsPage2,
  loader: () => loader6
});
var import_node6 = require("@remix-run/node");
var import_react8 = require("@remix-run/react");
var import_tiny_invariant3 = __toESM(require("tiny-invariant"));
var loader6 = async ({ request, params }) => {
  const id_user = await requireUserId(request);
  (0, import_tiny_invariant3.default)(params.ticketId, "ticketId not found");
  console.log(params.id);
  const ticket = await getTicket({ id: params.ticketId, id_user });
  if (!ticket) {
    throw new Response("Not Found", { status: 404 });
  }
  return (0, import_node6.json)({ ticket });
};
function TicketDetailsPage2() {
  const data = (0, import_react8.useLoaderData)();
  return /* @__PURE__ */ React.createElement("div", {
    className: "p-8 h-full"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "p-4 pt-8 w-full bg-opacity-75 text-white bg-slate-800"
  }, /* @__PURE__ */ React.createElement("h3", {
    className: "text-2xl font-thin"
  }, "#", data.ticket.id, " ", /* @__PURE__ */ React.createElement("span", {
    className: "font-bold"
  }, data.ticket.title)), /* @__PURE__ */ React.createElement("hr", {
    className: "my-4"
  })), /* @__PURE__ */ React.createElement("div", {
    className: " my-4 p-4 pt-8 flex w-full bg-opacity-75 text-white bg-slate-800"
  }, /* @__PURE__ */ React.createElement("p", {
    className: "py-6"
  }, data.ticket.desc)), /* @__PURE__ */ React.createElement(import_react8.Form, {
    method: "post"
  }, /* @__PURE__ */ React.createElement("button", {
    type: "submit",
    className: "rounded bg-slate-500  py-2 px-4 text-white hover:bg-slate-600 focus:bg-slate-400"
  }, "Delete")));
}
function ErrorBoundary2({ error }) {
  console.error(error);
  return /* @__PURE__ */ React.createElement("div", null, "An unexpected error occurred: ", error.message);
}
function CatchBoundary2() {
  const caught = (0, import_react8.useCatch)();
  if (caught.status === 404) {
    return /* @__PURE__ */ React.createElement("div", null, "Note not found");
  }
  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}

// route:/home/wtficctsn/PhpstormProjects/TIKIT/app/routes/tickets/new.tsx
var new_exports = {};
__export(new_exports, {
  action: () => action,
  default: () => NewTicketPage
});
var import_node7 = require("@remix-run/node");
var import_react9 = require("@remix-run/react");
var React2 = __toESM(require("react"));
var action = async ({ request }) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const title = formData.get("title");
  const desc = formData.get("desc");
  if (typeof title !== "string" || title.length === 0) {
    return (0, import_node7.json)({ errors: { title: "Title is required" } }, { status: 400 });
  }
  if (typeof desc !== "string" || desc.length === 0) {
    return (0, import_node7.json)({ errors: { desc: "desc is required" } }, { status: 400 });
  }
  const ticket = await createTicket({ title, desc, userId });
  return (0, import_node7.redirect)(`/tickets/${ticket.id}`);
};
function NewTicketPage() {
  var _a, _b, _c, _d, _e, _f;
  const actionData = (0, import_react9.useActionData)();
  const titleRef = React2.useRef(null);
  const bodyRef = React2.useRef(null);
  React2.useEffect(() => {
    var _a2, _b2, _c2, _d2;
    if ((_a2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a2.title) {
      (_b2 = titleRef.current) == null ? void 0 : _b2.focus();
    } else if ((_c2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c2.desc) {
      (_d2 = bodyRef.current) == null ? void 0 : _d2.focus();
    }
  }, [actionData]);
  return /* @__PURE__ */ React2.createElement(import_react9.Form, {
    method: "post",
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      width: "100%"
    }
  }, /* @__PURE__ */ React2.createElement("div", null, /* @__PURE__ */ React2.createElement("label", {
    className: "flex w-full flex-col gap-1"
  }, /* @__PURE__ */ React2.createElement("span", null, "Title: "), /* @__PURE__ */ React2.createElement("input", {
    ref: titleRef,
    name: "title",
    className: "flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose",
    "aria-invalid": ((_a = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a.title) ? true : void 0,
    "aria-errormessage": ((_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.title) ? "title-error" : void 0
  })), ((_c = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c.title) && /* @__PURE__ */ React2.createElement("div", {
    className: "pt-1 text-red-700",
    id: "title-error"
  }, actionData.errors.title)), /* @__PURE__ */ React2.createElement("div", null, /* @__PURE__ */ React2.createElement("label", {
    className: "flex w-full flex-col gap-1"
  }, /* @__PURE__ */ React2.createElement("span", null, "Body: "), /* @__PURE__ */ React2.createElement("textarea", {
    ref: bodyRef,
    name: "desc",
    rows: 8,
    className: "w-full flex-1 rounded-md border-2 border-blue-500 py-2 px-3 text-lg leading-6",
    "aria-invalid": ((_d = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _d.desc) ? true : void 0,
    "aria-errormessage": ((_e = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _e.desc) ? "body-error" : void 0
  })), ((_f = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _f.desc) && /* @__PURE__ */ React2.createElement("div", {
    className: "pt-1 text-red-700",
    id: "body-error"
  }, actionData.errors.desc)), /* @__PURE__ */ React2.createElement("div", {
    className: "text-right"
  }, /* @__PURE__ */ React2.createElement("button", {
    type: "submit",
    className: "rounded bg-blue-500 py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
  }, "Save")));
}

// route:/home/wtficctsn/PhpstormProjects/TIKIT/app/routes/logout.tsx
var logout_exports = {};
__export(logout_exports, {
  action: () => action2,
  loader: () => loader7
});
var import_node8 = require("@remix-run/node");
var action2 = async ({ request }) => {
  return logout(request);
};
var loader7 = async () => {
  return (0, import_node8.redirect)("/");
};

// route:/home/wtficctsn/PhpstormProjects/TIKIT/app/routes/index.tsx
var routes_exports = {};
__export(routes_exports, {
  default: () => Index
});
var import_react10 = require("@remix-run/react");
function Index() {
  const user = useOptionalUser();
  return /* @__PURE__ */ React.createElement("main", {
    className: "relative min-h-screen loginGradient sm:flex sm:items-center sm:justify-center"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "relative sm:pb-16 sm:pt-8"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "mx-auto max-w-7xl sm:px-6 lg:px-8"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "relative bg-slate-800 shadow-xl sm:overflow-hidden sm:rounded-2xl"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "absolute inset-0"
  }, /* @__PURE__ */ React.createElement("div", {
    className: "absolute inset-0 bg-[color:rgba(254,204,27,0.5)] mix-blend-multiply"
  })), /* @__PURE__ */ React.createElement("div", {
    className: "lg:pb-18 relative px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pt-32"
  }, /* @__PURE__ */ React.createElement("h1", {
    className: "text-center text-6xl font-extrabold tracking-tight sm:text-8xl lg:text-9xl"
  }, /* @__PURE__ */ React.createElement("span", {
    className: "block uppercase text-purple-800 drop-shadow-md"
  }, "TIKIT")), /* @__PURE__ */ React.createElement("p", {
    className: "mx-auto mt-6 max-w-lg text-center text-xl text-white sm:max-w-3xl"
  }, "Check the README.md file for instructions on how to get this project deployed."), /* @__PURE__ */ React.createElement("div", {
    className: "mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center"
  }, user ? /* @__PURE__ */ React.createElement(import_react10.Link, {
    to: "/tickets",
    className: "flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-purple-800 shadow-sm hover:bg-purple-50 sm:px-8"
  }, "View Tikets for ", user.email) : /* @__PURE__ */ React.createElement("div", {
    className: "space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0"
  }, /* @__PURE__ */ React.createElement(import_react10.Link, {
    to: "/join",
    className: "flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-purple-700 shadow-sm hover:bg-purple-50 sm:px-8"
  }, "Sign up"), /* @__PURE__ */ React.createElement(import_react10.Link, {
    to: "/login",
    className: "flex items-center justify-center rounded-md bg-purple-500 px-4 py-3 font-medium text-white hover:bg-purple-600  "
  }, "Log In"))))))));
}

// route:/home/wtficctsn/PhpstormProjects/TIKIT/app/routes/login.tsx
var login_exports = {};
__export(login_exports, {
  action: () => action3,
  default: () => LoginPage,
  loader: () => loader8,
  meta: () => meta2
});
var import_node9 = require("@remix-run/node");
var import_react11 = require("@remix-run/react");
var React3 = __toESM(require("react"));
var loader8 = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId)
    return (0, import_node9.redirect)("/");
  return (0, import_node9.json)({});
};
var action3 = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/notes");
  const remember = formData.get("remember");
  if (!validateEmail(email)) {
    return (0, import_node9.json)({ errors: { email: "Email is invalid" } }, { status: 400 });
  }
  if (typeof password !== "string") {
    return (0, import_node9.json)({ errors: { password: "Password is required" } }, { status: 400 });
  }
  if (password.length < 8) {
    return (0, import_node9.json)({ errors: { password: "Password is too short" } }, { status: 400 });
  }
  const user = await verifyLogin(email, password);
  if (!user) {
    return (0, import_node9.json)({ errors: { email: "Invalid email or password" } }, { status: 400 });
  }
  return createUserSession({
    request,
    userId: user.id,
    remember: remember === "on" ? true : false,
    redirectTo
  });
};
var meta2 = () => {
  return {
    title: "Login"
  };
};
function LoginPage() {
  var _a, _b, _c, _d;
  const [searchParams] = (0, import_react11.useSearchParams)();
  const redirectTo = searchParams.get("redirectTo") || "/notes";
  const actionData = (0, import_react11.useActionData)();
  const emailRef = React3.useRef(null);
  const passwordRef = React3.useRef(null);
  React3.useEffect(() => {
    var _a2, _b2, _c2, _d2;
    if ((_a2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a2.email) {
      (_b2 = emailRef.current) == null ? void 0 : _b2.focus();
    } else if ((_c2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c2.password) {
      (_d2 = passwordRef.current) == null ? void 0 : _d2.focus();
    }
  }, [actionData]);
  return /* @__PURE__ */ React3.createElement("div", {
    className: "flex min-h-full flex-col justify-center"
  }, /* @__PURE__ */ React3.createElement("div", {
    className: "mx-auto w-full max-w-md px-8"
  }, /* @__PURE__ */ React3.createElement(import_react11.Form, {
    method: "post",
    className: "space-y-6"
  }, /* @__PURE__ */ React3.createElement("div", null, /* @__PURE__ */ React3.createElement("label", {
    htmlFor: "email",
    className: "block text-sm font-medium text-gray-700"
  }, "Email address"), /* @__PURE__ */ React3.createElement("div", {
    className: "mt-1"
  }, /* @__PURE__ */ React3.createElement("input", {
    ref: emailRef,
    id: "email",
    required: true,
    autoFocus: true,
    name: "email",
    type: "email",
    autoComplete: "email",
    "aria-invalid": ((_a = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a.email) ? true : void 0,
    "aria-describedby": "email-error",
    className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
  }), ((_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.email) && /* @__PURE__ */ React3.createElement("div", {
    className: "pt-1 text-red-700",
    id: "email-error"
  }, actionData.errors.email))), /* @__PURE__ */ React3.createElement("div", null, /* @__PURE__ */ React3.createElement("label", {
    htmlFor: "password",
    className: "block text-sm font-medium text-gray-700"
  }, "Password"), /* @__PURE__ */ React3.createElement("div", {
    className: "mt-1"
  }, /* @__PURE__ */ React3.createElement("input", {
    id: "password",
    ref: passwordRef,
    name: "password",
    type: "password",
    autoComplete: "current-password",
    "aria-invalid": ((_c = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c.password) ? true : void 0,
    "aria-describedby": "password-error",
    className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
  }), ((_d = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _d.password) && /* @__PURE__ */ React3.createElement("div", {
    className: "pt-1 text-red-700",
    id: "password-error"
  }, actionData.errors.password))), /* @__PURE__ */ React3.createElement("input", {
    type: "hidden",
    name: "redirectTo",
    value: redirectTo
  }), /* @__PURE__ */ React3.createElement("button", {
    type: "submit",
    className: "w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
  }, "Log in"), /* @__PURE__ */ React3.createElement("div", {
    className: "flex items-center justify-between"
  }, /* @__PURE__ */ React3.createElement("div", {
    className: "flex items-center"
  }, /* @__PURE__ */ React3.createElement("input", {
    id: "remember",
    name: "remember",
    type: "checkbox",
    className: "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
  }), /* @__PURE__ */ React3.createElement("label", {
    htmlFor: "remember",
    className: "ml-2 block text-sm text-gray-900"
  }, "Remember me")), /* @__PURE__ */ React3.createElement("div", {
    className: "text-center text-sm text-gray-500"
  }, "Don't have an account?", " ", /* @__PURE__ */ React3.createElement(import_react11.Link, {
    className: "text-blue-500 underline",
    to: {
      pathname: "/join",
      search: searchParams.toString()
    }
  }, "Sign up"))))));
}

// route:/home/wtficctsn/PhpstormProjects/TIKIT/app/routes/join.tsx
var join_exports = {};
__export(join_exports, {
  action: () => action4,
  default: () => Join,
  loader: () => loader9,
  meta: () => meta3
});
var import_node10 = require("@remix-run/node");
var import_react12 = require("@remix-run/react");
var React4 = __toESM(require("react"));
var loader9 = async ({ request }) => {
  const userId = await getUserId(request);
  if (userId)
    return (0, import_node10.redirect)("/");
  return (0, import_node10.json)({});
};
var action4 = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/");
  if (!validateEmail(email)) {
    return (0, import_node10.json)({ errors: { email: "Email is invalid" } }, { status: 400 });
  }
  if (typeof password !== "string") {
    return (0, import_node10.json)({ errors: { password: "Password is required" } }, { status: 400 });
  }
  if (password.length < 8) {
    return (0, import_node10.json)({ errors: { password: "Password is too short" } }, { status: 400 });
  }
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return (0, import_node10.json)({ errors: { email: "A user already exists with this email" } }, { status: 400 });
  }
  const user = await createTechnician(email, password);
  return createUserSession({
    request,
    userId: user.id,
    remember: false,
    redirectTo
  });
};
var meta3 = () => {
  return {
    title: "Sign Up"
  };
};
function Join() {
  var _a, _b, _c, _d;
  const [searchParams] = (0, import_react12.useSearchParams)();
  const redirectTo = searchParams.get("redirectTo") ?? void 0;
  const actionData = (0, import_react12.useActionData)();
  const emailRef = React4.useRef(null);
  const passwordRef = React4.useRef(null);
  React4.useEffect(() => {
    var _a2, _b2, _c2, _d2;
    if ((_a2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a2.email) {
      (_b2 = emailRef.current) == null ? void 0 : _b2.focus();
    } else if ((_c2 = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c2.password) {
      (_d2 = passwordRef.current) == null ? void 0 : _d2.focus();
    }
  }, [actionData]);
  return /* @__PURE__ */ React4.createElement("div", {
    className: "flex min-h-full flex-col justify-center"
  }, /* @__PURE__ */ React4.createElement("div", {
    className: "mx-auto w-full max-w-md px-8"
  }, /* @__PURE__ */ React4.createElement(import_react12.Form, {
    method: "post",
    className: "space-y-6"
  }, /* @__PURE__ */ React4.createElement("div", null, /* @__PURE__ */ React4.createElement("label", {
    htmlFor: "email",
    className: "block text-sm font-medium text-gray-700"
  }, "Email address"), /* @__PURE__ */ React4.createElement("div", {
    className: "mt-1"
  }, /* @__PURE__ */ React4.createElement("input", {
    ref: emailRef,
    id: "email",
    required: true,
    autoFocus: true,
    name: "email",
    type: "email",
    autoComplete: "email",
    "aria-invalid": ((_a = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _a.email) ? true : void 0,
    "aria-describedby": "email-error",
    className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
  }), ((_b = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _b.email) && /* @__PURE__ */ React4.createElement("div", {
    className: "pt-1 text-red-700",
    id: "email-error"
  }, actionData.errors.email))), /* @__PURE__ */ React4.createElement("div", null, /* @__PURE__ */ React4.createElement("label", {
    htmlFor: "password",
    className: "block text-sm font-medium text-gray-700"
  }, "Password"), /* @__PURE__ */ React4.createElement("div", {
    className: "mt-1"
  }, /* @__PURE__ */ React4.createElement("input", {
    id: "password",
    ref: passwordRef,
    name: "password",
    type: "password",
    autoComplete: "new-password",
    "aria-invalid": ((_c = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _c.password) ? true : void 0,
    "aria-describedby": "password-error",
    className: "w-full rounded border border-gray-500 px-2 py-1 text-lg"
  }), ((_d = actionData == null ? void 0 : actionData.errors) == null ? void 0 : _d.password) && /* @__PURE__ */ React4.createElement("div", {
    className: "pt-1 text-red-700",
    id: "password-error"
  }, actionData.errors.password))), /* @__PURE__ */ React4.createElement("input", {
    type: "hidden",
    name: "redirectTo",
    value: redirectTo
  }), /* @__PURE__ */ React4.createElement("button", {
    type: "submit",
    className: "w-full rounded bg-blue-500  py-2 px-4 text-white hover:bg-blue-600 focus:bg-blue-400"
  }, "Create Account"), /* @__PURE__ */ React4.createElement("div", {
    className: "flex items-center justify-center"
  }, /* @__PURE__ */ React4.createElement("div", {
    className: "text-center text-sm text-gray-500"
  }, "Already have an account?", " ", /* @__PURE__ */ React4.createElement(import_react12.Link, {
    className: "text-blue-500 underline",
    to: {
      pathname: "/login",
      search: searchParams.toString()
    }
  }, "Log in"))))));
}

// server-assets-manifest:@remix-run/dev/assets-manifest
var assets_manifest_default = { "version": "79ee07ba", "entry": { "module": "/build/entry.client-DYQ2VRHB.js", "imports": ["/build/_shared/chunk-UMD7BRNS.js", "/build/_shared/chunk-6BO74FWO.js"] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "module": "/build/root-Q5YVLALH.js", "imports": void 0, "hasAction": false, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/healthcheck": { "id": "routes/healthcheck", "parentId": "root", "path": "healthcheck", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/healthcheck-DZ55A626.js", "imports": void 0, "hasAction": false, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/index": { "id": "routes/index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "module": "/build/routes/index-R4BDLDCR.js", "imports": ["/build/_shared/chunk-UNVDX6CU.js"], "hasAction": false, "hasLoader": false, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/join": { "id": "routes/join", "parentId": "root", "path": "join", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/join-EPLYGEXT.js", "imports": ["/build/_shared/chunk-DFG4XZEI.js", "/build/_shared/chunk-UNVDX6CU.js", "/build/_shared/chunk-ME5PAYV3.js"], "hasAction": true, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/login": { "id": "routes/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/login-SJQPSEKL.js", "imports": ["/build/_shared/chunk-DFG4XZEI.js", "/build/_shared/chunk-UNVDX6CU.js", "/build/_shared/chunk-ME5PAYV3.js"], "hasAction": true, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/logout": { "id": "routes/logout", "parentId": "root", "path": "logout", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/logout-PABHQ6ZK.js", "imports": void 0, "hasAction": true, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/profile": { "id": "routes/profile", "parentId": "root", "path": "profile", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/profile-VRAAHJP3.js", "imports": ["/build/_shared/chunk-UNVDX6CU.js", "/build/_shared/chunk-SZXMSDPC.js", "/build/_shared/chunk-ME5PAYV3.js"], "hasAction": false, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/profile/$profileId": { "id": "routes/profile/$profileId", "parentId": "routes/profile", "path": ":profileId", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/profile/$profileId-6MKBQXMF.js", "imports": void 0, "hasAction": false, "hasLoader": true, "hasCatchBoundary": true, "hasErrorBoundary": true }, "routes/tickets": { "id": "routes/tickets", "parentId": "root", "path": "tickets", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/tickets-K6QDYLFA.js", "imports": ["/build/_shared/chunk-UNVDX6CU.js", "/build/_shared/chunk-SZXMSDPC.js", "/build/_shared/chunk-ME5PAYV3.js"], "hasAction": false, "hasLoader": true, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/tickets/$ticketId": { "id": "routes/tickets/$ticketId", "parentId": "routes/tickets", "path": ":ticketId", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/tickets/$ticketId-H4TEKCFN.js", "imports": void 0, "hasAction": false, "hasLoader": true, "hasCatchBoundary": true, "hasErrorBoundary": true }, "routes/tickets/new": { "id": "routes/tickets/new", "parentId": "routes/tickets", "path": "new", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/tickets/new-4D7RDPTD.js", "imports": void 0, "hasAction": true, "hasLoader": false, "hasCatchBoundary": false, "hasErrorBoundary": false }, "routes/userTypes": { "id": "routes/userTypes", "parentId": "root", "path": "userTypes", "index": void 0, "caseSensitive": void 0, "module": "/build/routes/userTypes-EEOHBCM4.js", "imports": void 0, "hasAction": false, "hasLoader": false, "hasCatchBoundary": false, "hasErrorBoundary": false } }, "url": "/build/manifest-79EE07BA.js" };

// server-entry-module:@remix-run/dev/server-build
var entry = { module: entry_server_exports };
var routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: root_exports
  },
  "routes/healthcheck": {
    id: "routes/healthcheck",
    parentId: "root",
    path: "healthcheck",
    index: void 0,
    caseSensitive: void 0,
    module: healthcheck_exports
  },
  "routes/userTypes": {
    id: "routes/userTypes",
    parentId: "root",
    path: "userTypes",
    index: void 0,
    caseSensitive: void 0,
    module: userTypes_exports
  },
  "routes/profile": {
    id: "routes/profile",
    parentId: "root",
    path: "profile",
    index: void 0,
    caseSensitive: void 0,
    module: profile_exports
  },
  "routes/profile/$profileId": {
    id: "routes/profile/$profileId",
    parentId: "routes/profile",
    path: ":profileId",
    index: void 0,
    caseSensitive: void 0,
    module: profileId_exports
  },
  "routes/tickets": {
    id: "routes/tickets",
    parentId: "root",
    path: "tickets",
    index: void 0,
    caseSensitive: void 0,
    module: tickets_exports
  },
  "routes/tickets/$ticketId": {
    id: "routes/tickets/$ticketId",
    parentId: "routes/tickets",
    path: ":ticketId",
    index: void 0,
    caseSensitive: void 0,
    module: ticketId_exports
  },
  "routes/tickets/new": {
    id: "routes/tickets/new",
    parentId: "routes/tickets",
    path: "new",
    index: void 0,
    caseSensitive: void 0,
    module: new_exports
  },
  "routes/logout": {
    id: "routes/logout",
    parentId: "root",
    path: "logout",
    index: void 0,
    caseSensitive: void 0,
    module: logout_exports
  },
  "routes/index": {
    id: "routes/index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: routes_exports
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: login_exports
  },
  "routes/join": {
    id: "routes/join",
    parentId: "root",
    path: "join",
    index: void 0,
    caseSensitive: void 0,
    module: join_exports
  }
};
module.exports = __toCommonJS(stdin_exports);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  assets,
  entry,
  routes
});
//# sourceMappingURL=index.js.map
