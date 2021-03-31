import { useSocket } from "../../context/socketContext";

function User({ id, name, myId, userIsMod }) {
  const { sendMessage } = useSocket();

  return (
    <div
      key={`userBox-${id}`}
      style={
        userIsMod && {
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }
      }
    >
      <p key={id}>{name}</p>
      {userIsMod && (
        <button
          onClick={() =>
            sendMessage &&
            sendMessage({
              type: "removeUser",
              payload: { modId: myId, toRemoveId: id },
            })
          }
        >
          Remove Me
        </button>
      )}
    </div>
  );
}

export default User;
