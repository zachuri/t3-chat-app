// src/server/db/client.ts
import { PrismaClient } from "@prisma/client";
import dynamic from "next/dynamic.js";
// import { env } from "../../env/server.mjs";

// Solved WebSocket Server issue
// - need to dynamically import
const env = dynamic(() => import("../../env/server.mjs"));

declare global {
	// eslint-disable-next-line no-var
	var prisma: PrismaClient | undefined;
}

export const prisma =
	global.prisma ||
	new PrismaClient({
		log: ["query"],
	});

if (env.NODE_ENV !== "production") {
	global.prisma = prisma;
}
