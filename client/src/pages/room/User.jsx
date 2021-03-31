import PropTypes from "prop-types";
import { useSocket } from "../../context/socketContext";

function User({ name, userId, myId, userIsMod }) {
  const { sendMessage } = useSocket();

  return (
    <div
      key={`userBox-${userId}`}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <p key={userId}>{name}</p>
      {myId !== userId ? (
        userIsMod && (
          <button
            type="submit"
            onClick={() =>
              sendMessage &&
              sendMessage({
                type: "banUser",
                payload: { toBanId: userId },
              })
            }
          >
            Ban
          </button>
        )
      ) : (
        <>
          <p>Me</p>
          {userIsMod && <p>Mod</p>}
        </>
      )}
    </div>
  );
}

User.propTypes = {
  name: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  myId: PropTypes.string.isRequired,
  userIsMod: PropTypes.bool.isRequired,
};

export default User;
