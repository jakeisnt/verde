import React from "react";

const { useCallback, useState } = React;

/** A simple hook to toggle between true and false states. */
function useToggle(initialState = false) {
  const [state, setState] = useState(initialState);

  const toggle = useCallback(() => setState((bool) => !bool), []);

  return [state, toggle];
}

export default useToggle;
