import { useState } from "react";
import useUser from "../api/users";
import useStyles from "./styles";

function Profile() {
  const [name, setName] = useState("");
  const { user, setUserName } = useUser();
  const classes = useStyles();

  return (
    <div className={classes.home}>
      <h1>Profile</h1>
      <p>Current User ID: {user && user.id}</p>
      <p>Current User Name: {user && user.name}</p>
      <br />
      <input
        type="text"
        className={classes.box}
        value={name}
        placeholder="Enter a new name"
        onInput={(e) => setName(e.target.value)}
      />
      <button
        type="button"
        className={classes.box}
        onClick={() => {
          setUserName(name);
          setName("");
        }}
      >
        Set Name
      </button>
    </div>
  );
}

export default Profile;
