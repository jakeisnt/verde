import { useSocket } from "../../context/socketContext";

function User({ id, name, myId, userIsMod }) {
  const { sendMessage } = useSocket();

  return (
    <div key={`userBox-${id}`}>
      <p key={user.id}>{user.name}</p>
      {userIsMod && (
        <div
          onClick={() =>
            sendMessage &&
            sendMessage({
              type: "removeUser",
              payload: { modId: myId, toRemoveId: id },
            })
          }
        >
          Remove Me
        </div>
      )}
    </div>
  );
}

export default User;
