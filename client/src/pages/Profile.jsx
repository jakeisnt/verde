import { useState } from "react";
import { useUser } from "../context/userContext";
import useStyles from "./styles";
import { BackButton, Button } from "../components";

function Profile() {
  const [name, setName] = useState("");
  const { user, setUserName } = useUser();
  const classes = useStyles();

  return (
    <div className={classes.page}>
      <BackButton />
      <h1>Profile</h1>
      <p>Current User ID: {user && user.id}</p>
      <p>Current User Name: {user && user.name}</p>
      <br />
      <input
        type="text"
        className={classes.box}
        value={name}
        placeholder="Enter a new name"
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            setUserName(name);
            setName("");
          }
        }}
        onInput={(e) => setName(e.target.value)}
      />
      <Button
        title="Set Name"
        onClick={() => {
          setUserName(name);
          setName("");
        }}
      />
    </div>
  );
}

export default Profile;
