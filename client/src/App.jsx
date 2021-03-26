import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ThemeProvider } from "react-jss";
import theme from "./theme";
import { Home, Room, Join, Profile } from "./pages";
import { UserProvider } from "./context/userContext";

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <UserProvider>
          <Router>
            <Switch>
              <Route path="/room/:name">
                <Room />
              </Route>
              <Route path="/join">
                <Join />
              </Route>
              <Route path="/profile">
                <Profile />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </Router>
        </UserProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
