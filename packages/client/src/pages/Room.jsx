import { useParams } from "react-router-dom";

function Room() {
  const { name } = useParams();

  return (
    <div className="Room">
      <p>this is room {name}</p>
    </div>
  );
}

export default Room;
