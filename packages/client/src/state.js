import { Machine, assign } from "xstate";

const updatedAction = assign({
  updated: (context) => context.updated + 1,
});

const lightMachine = Machine({
  id: "lightMachine",
  initial: "green",
  // 'mutable' state in the state machine
  context: {
    updated: 0,
  },
  states: {
    green: {
      on: {
        YELLOW: {
          target: "yellow",
          actions: "updatedAction",
        },
      },
    },
    yellow: {
      on: {
        RED: {
          target: "red",
          actions: "updatedAction",
        },
      },
    },
    red: {
      on: {
        GREEN: {
          target: "green",
          actions: "updatedAction",
        },
      },
    },
  },
});

export { lightMachine, updatedAction };
