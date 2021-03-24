import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./component/Home";
import Room from "./component/Room";
import Join from "./component/Join";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/room/:name">
            <Room />
          </Route>
          <Route path="/join">
            <Join />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
