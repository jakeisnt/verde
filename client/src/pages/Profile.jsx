import { useState } from "react";
import { useUser } from "../context/userContext";
import useStyles from "./styles";
import { Button, Input, Page } from "../components";

function Profile() {
  const [name, setName] = useState("");
  const { user, setUserName } = useUser();
  const classes = useStyles();

  return (
    <Page>
      <Title>Profile</Title>
      <Subtitle>Current User ID: {user && user.id}</Subtitle>
      <Subtitle>Current User Name: {user && user.name}</Subtitle>
      <br />
      <Input
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
    </Page>
  );
}

export default Profile;
