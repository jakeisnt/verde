import { useHistory } from "react-router-dom";

function Home() {
  const history = useHistory();

  const getNewRoom = () =>
    fetch("http://localhost:4000/room/new")
      .then((res) => res.json())
      .then((res) => history.push(`/room/${res.name}`));

  return (
    <div className="Home">
      <button type="button" onClick={getNewRoom}>
        Create Room
      </button>
      <button type="button" onClick={() => history.push("/join")}>
        Join Room
      </button>
    </div>
  );
}

export default Home;
