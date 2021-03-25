import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";

/** Returns a stateful user value, and functions to update its properties. */
function useUser() {
  const [user, setUser] = useState(null);
  const [cookies, setCookie] = useCookies("userId");

  // Runs once at beginning and whenever user ID cookie is updated
  useEffect(() => {
    function getNewUser() {
      fetch(`/users/new`)
        .then((res) => res.json())
        .then((res) => {
          setCookie("userId", res.id);
          setUser(res);
        });
    }
    if (cookies.userId !== undefined) {
      fetch(`/users/get?${new URLSearchParams({ id: cookies.userId })}`)
        .then((res) => res.json())
        .then((res) => {
          setUser(res);
        })
        .catch(getNewUser); // If user ID in cookie is stale
    } else {
      getNewUser();
    }
  }, [cookies, setCookie]);

  /** Requests to rename the user. */
  const setUserName = (name) => {
    if (user) {
      const params = new URLSearchParams({ id: user.id, name });
      fetch(`/users/setName?${params}`, { method: "PUT" })
        .then((res) => res.json())
        .then((res) => {
          setUser(res);
        });
    }
  };

  return { user, setUserName };
}

export default useUser;
