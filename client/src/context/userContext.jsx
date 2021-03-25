import {
  createContext,
  useEffect,
  useState,
  useCallback,
  useContext,
} from "react";
import PropTypes from "prop-types";
import Cookies from "universal-cookie";

const UserContext = createContext(null);

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const cookies2 = new Cookies();
  console.log(JSON.stringify(cookies2.get("userId")));

  // Runs once at beginning and whenever user ID cookie is updated
  useEffect(() => {
    const cookies = new Cookies();
    function getNewUser() {
      fetch(`/users/new`)
        .then((res) => res.json())
        .then((res) => {
          cookies.set("userId", res.id);
          setUser(res);
        });
    }
    const storedId = cookies.get("userId");
    if (storedId !== undefined) {
      fetch(`/users/get?${new URLSearchParams({ id: storedId })}`)
        .then((res) => res.json())
        .then((res) => setUser(res))
        .catch(getNewUser); // If user ID in cookie is stale
    } else {
      getNewUser();
    }
  }, []);

  /** Requests to rename the user. */
  const setUserName = useCallback(
    (name) => {
      if (user) {
        const params = new URLSearchParams({ id: user.id, name });
        fetch(`/users/setName?${params}`, { method: "PUT" })
          .then((res) => res.json())
          .then((res) => {
            setUser(res);
          });
      }
    },
    [user]
  );

  return (
    <UserContext.Provider value={{ user, setUserName }}>
      {children}
    </UserContext.Provider>
  );
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

/** Returns a context containing a stateful user and functions to modify it. */
function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

export { useUser, UserProvider };
