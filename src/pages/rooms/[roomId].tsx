import { Session } from "next-auth";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Message } from "../../constants/schemas";
import { trpc } from "../../utils/trpc";

function MessageItem({
	message,
	session,
}: {
	message: Message;
	session: Session;
}) {
	const baseStyles =
		"mb-4 text-md w-7/12 p-4 text-gray-700 border border-gray-700 rounded-md";

	const liStyles =
		message.sender.name === session.user?.name
			? baseStyles
			: baseStyles.concat(" self-end bg-gray-700 text-white");

	return (
		<li className={liStyles}>
			<div className="flex">
				{message.message}
				<time>
					{message.sentAt.toLocaleTimeString(`en-US`, {
						timeStyle: "short",
					})}
					- {message.sender.name}
				</time>
			</div>
		</li>
	);
}

function RoomPage() {
	const { query } = useRouter();

	const roomId = query.roomId as string;

	// make sure user is logged in
	const { data: session } = useSession();

	const [message, setMessage] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);

	const { mutateAsync: sendMessageMutation } = trpc.useMutation([
		"room.send-message",
	]);

	// require room id as input
	trpc.useSubscription(["room.onSendMessage", { roomId }], {
		onNext: (message) => {
			setMessages((m) => {
				return [...m, message];
			});
		},
	});

	// if user not signed in
	if (!session) {
		return (
			<div>
				<button onClick={() => signIn()}>Login</button>
			</div>
		);
	}

	// return <div>welcome to room {roomId}</div>;
	return (
		<div className="flex flex-col h-screen">
			<div className="flex-1">
				<ul className="flex flex-col p-4">
					{messages.map((m) => {
						return (
							<MessageItem key={m.id} message={m} session={session} />
						);
					})}
				</ul>
			</div>
			<form
				className="flex"
				onSubmit={(e) => {
					e.preventDefault();
					sendMessageMutation({ roomId, message });
					setMessage("");
				}}
			>
				<textarea
					className="black p-2.5 w-full text-gray-700 bg-gray-50 rounded-md border border-gray-700"
					value={message}
					onChange={(e) => setMessage(e.target.value)}
					placeholder="What do you want to say"
				/>
				<button
					className="flex-1 text-white bg-gray-900 p-2.5"
					type="submit"
				>
					Send Message
				</button>
			</form>
		</div>
	);
}

export default RoomPage;
