import "./App.css";
import { useMachine } from "@xstate/react";
import logo from "./logo.svg";
import { lightMachine, updatedAction } from "./state";

function App() {
  const [current, send] = useMachine(lightMachine, {
    actions: { updatedAction },
  });
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div>
        <h1>Light traffic</h1>
        <h1>Updated: {current.context.updated} times</h1>
        <button
          disabled={!current.matches("green")}
          onClick={() => send("YELLOW")}
        >
          YELLOW
        </button>
        <button
          disabled={!current.matches("yellow")}
          onClick={() => send("RED")}
        >
          RED
        </button>
        <button
          disabled={!current.matches("red")}
          onClick={() => send("GREEN")}
        >
          GREEN
        </button>
        {current.matches("green") ? (
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "green",
              marginTop: 10,
            }}
          />
        ) : null}
        {current.matches("yellow") ? (
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "yellow",
              marginTop: 10,
            }}
          />
        ) : null}
        {current.matches("red") ? (
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              background: "red",
              marginTop: 10,
            }}
          />
        ) : null}
      </div>
    </div>
  );
}

export default App;
