import { useRouter } from "next/router";

function RoomPage() {
	const { query } = useRouter();

	const roomId = query.roomId as string;

	return <div>welcome to room {roomId}</div>;
}

export default RoomPage;
