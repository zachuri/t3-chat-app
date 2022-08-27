import { Session } from "next-auth";
import { SessionProvider, signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Message } from "../../constants/schemas";
import { trpc } from "../../utils/trpc";

function MessageItem({message, session}: {message: Message, session: Session}) {
  return <li>
    {message.message}
  </li>
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
		<div>
			<ul>
        {messages.map((m) => {
          return <MessageItem key={m.id} message={m} session={session}/>
        })}
      </ul>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					sendMessageMutation({ roomId, message });
				}}
			>
				<textarea placeholder="What do you want to say" />
				<button type="submit">Send Message</button>
			</form>
		</div>
	);
}

export default RoomPage;
