import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "react-jss";
import React from "react";
import theme from "./theme";
import { Home, Room, Create, Join, Profile, About } from "./pages";
import { BottomBanner } from "./components";
import { UserProvider } from "./context/userContext";

/** The root of our application. Provides a user configuration on load
 * and client side routing for all of the pages.
 */

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <UserProvider>
          <Router>
            <Routes>
              <Route path="room/:name" element={<Room />} />
              <Route path="create" element={<Create />} />
              <Route path="join" element={<Join />} />
              <Route path="profile" element={<Profile />} />
              <Route path="about" element={<About />} />
              <Route path="home/:error" element={<Home />} />
              <Route path="/" element={<Home />} />
            </Routes>
          </Router>
          <BottomBanner text="This website uses cookies." />
        </UserProvider>
      </ThemeProvider>
    </div>
  );
}

export default App;
