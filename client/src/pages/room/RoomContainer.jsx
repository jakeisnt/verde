import { useParams } from "react-router-dom";
import WSConnectionStatus from "../../components/WSConnectionStatus";
import Room from "./Room";
import { SocketProvider } from "../../context/socketContext";

function RoomContainer() {
  const { name: roomName } = useParams();
  return (
    <SocketProvider roomName={roomName}>
      <Room />
      <WSConnectionStatus />
    </SocketProvider>
  );
}

export default RoomContainer;
