import { useState } from "react";
import { useUser } from "../context/userContext";
import { Button, TextInput, Page, Text, Subtitle } from "../components";

/**
 * This is the Profile page - it allows users to view and configure their user profile
 * outside of the context of a game.
 */
function Profile() {
  const [name, setName] = useState("");
  const { user, setUserName } = useUser();

  return (
    <Page>
      <Subtitle>Profile</Subtitle>
      <Text>Current User ID: {user && user.id}</Text>
      <Text>Current Username: {user && user.name}</Text>
      <br />
      <TextInput
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
