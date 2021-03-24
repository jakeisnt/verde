import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "react-jss";
import theme from "./theme";
import { Home, Room, Join } from "./pages";

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
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
      </ThemeProvider>
    </div>
  );
}

export default App;
