import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "react-jss";
import theme from "./theme";
import { Home, Room, Create, Join, Profile, About } from "./pages";
import { BottomBanner } from "./components";
import { UserProvider } from "./context/userContext";

/** The root of our application. Provides a user configuration on load
* and client side routing for all of the pages.*/

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <UserProvider>
          <Router>
            <Routes>
              <Route path="/room/:name">
                <Room />
              </Route>
              <Route path="/create">
                <Create />
              </Route>
              <Route path="/join">
                <Join />
              </Route>
              <Route path="/profile">
                <Profile />
              </Route>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/home/:error">
                <Home />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Routes>
          </Router>
          <BottomBanner
            text="This website uses cookies."
          />
        </UserProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
