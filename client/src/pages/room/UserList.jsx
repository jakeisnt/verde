import User from "./User";

function UserList({ users, title, capacity, myId, userIsMod }) {
  return (
    <>
      {title} ({users && users.length}/
      {capacity && (capacity >= 0 ? capacity : "∞")})
      <div className={classes.box}>
        {users &&
          users.map(
            (user) =>
              user && (
                <User
                  name={user.name}
                  id={user.id}
                  myId={myId}
                  userIsMod={userIsMod}
                />
              )
          )}
      </div>
    </>
  );
}

export default UserList;
