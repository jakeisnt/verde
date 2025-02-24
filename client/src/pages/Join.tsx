import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button, Page, TextInput } from "../components";

/**
 * The Join page - used when a player wants to join an existing room.
 */
function Join() {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  return (
    <Page>
      <TextInput
        value={name}
        placeholder="Enter a room ID"
        onKeyUp={(e: React.KeyboardEvent<HTMLInputElement>) =>
          e.key === "Enter" && navigate(`/room/${name}`)
        }
        onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
          setName(e.target.value.toUpperCase())
        }
      />
      <Button title="Join Lobby" onClick={() => navigate(`/room/${name}`)} />
    </Page>
  );
}

export default Join;
