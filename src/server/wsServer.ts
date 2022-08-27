import ws from "ws";

// web socket adapter
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { appRouter } from "./router";
import { createContext } from "./router/context";

const wss = new ws.Server({
	port: 3001,
});

const handler = applyWSSHandler({ wss, createContext, router: appRouter });

wss.on("connection", () => {
	console.log(`++ ws connection ${wss.clients.size}`);

	wss.on("close", () => {
		console.log(`-- ws connection ${wss.clients.size}`);
	});
});

console.log(`ws server started`);

// If websocket is closed from a kill signal
process.on("SIGTERM", () => {
	console.log("SIGTERM");

  //handler ->
	handler.broadcastReconnectNotification();

	wss.close();
});
