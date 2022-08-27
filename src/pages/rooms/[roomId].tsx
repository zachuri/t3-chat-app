import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

function RoomPage() {
	const { query } = useRouter();

	const roomId = query.roomId as string;

	// make sure user is logged in
	const { data: session } = useSession();

	// if user not signed in
	if (!session) {
		return (
			<div>
				<button onClick={() => signIn()}>Login</button>
			</div>
		);
	}

	return <div>welcome to room {roomId}</div>;
}

export default RoomPage;
