import { createRouter } from "./context";
import {
	Message,
	messageSubSchema,
	sendMessageSchema,
} from "../../constants/schemas";
import { Events } from "../../constants/events";
import { randomUUID } from "crypto";

export const roomRouter = createRouter()
	.mutation("send-message", {
		input: sendMessageSchema,
		resolve({ ctx, input }) {
			const message: Message = {
				id: randomUUID(),
				...input,
				sentAt: new Date(),
				sender: {
					name: ctx.session?.user?.name || "unknown",
				},
				// roomId: ""
			};

			ctx.ee.emit(Events.SEND_MESSAGE, message);

			return true;
		},
	})
	.subscription("onSendMessage", {
		input: messageSubSchema,
		resolve() {
			return true;
		},
	});
