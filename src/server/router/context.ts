// src/server/router/context.ts
import * as trpc from "@trpc/server";
import ws from "ws";
import * as trpcNext from "@trpc/server/adapters/next";
import { NodeHTTPCreateContextFnOptions } from "@trpc/server/dist/declarations/src/adapters/node-http";
import EventEmitter from "events";
import { IncomingMessage } from "http";
import { unstable_getServerSession as getServerSession } from "next-auth";

import { authOptions as nextAuthOptions } from "../../pages/api/auth/[...nextauth]";
import { prisma } from "../db/client";
import { getSession } from "next-auth/react";

const ee = new EventEmitter();

export const createContext = async (
	opts?:
		| trpcNext.CreateNextContextOptions
		| NodeHTTPCreateContextFnOptions<IncomingMessage, ws>
) => {
	const req = opts?.req;
	const res = opts?.res;

	const session = req && res && (await getSession({ req }));

	return {
		req,
		res,
		session,
		prisma,
		ee,
	};
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();

// // src/server/router/context.ts
// import * as trpc from "@trpc/server";
// import * as trpcNext from "@trpc/server/adapters/next";
// import {
//   Session,
//   unstable_getServerSession as getServerSession,
// } from "next-auth";
// import { authOptions as nextAuthOptions } from "../../pages/api/auth/[...nextauth]";
// import { prisma } from "../db/client";

// type CreateContextOptions = {
//   session: Session | null;
// };

// /** Use this helper for:
//  * - testing, where we dont have to Mock Next.js' req/res
//  * - trpc's `createSSGHelpers` where we don't have req/res
//  **/
// export const createContextInner = async (opts: CreateContextOptions) => {
//   return {
//     session: opts.session,
//     prisma,
//   };
// };

// /**
//  * This is the actual context you'll use in your router
//  * @link https://trpc.io/docs/context
//  **/
// export const createContext = async (
//   opts: trpcNext.CreateNextContextOptions,
// ) => {
//   const session = await getServerSession(opts.req, opts.res, nextAuthOptions);

//   return await createContextInner({
//     session,
//   });
// };

// type Context = trpc.inferAsyncReturnType<typeof createContext>;

// export const createRouter = () => trpc.router<Context>();
