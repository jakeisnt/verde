# Source

This is where all of the core presentational and business logic for our application is defined.

* Hierarchy
pages/ contains the different pages of our application, as indexed by App.jsx. This is where the application comes together.
components/ contains relatively isolated and reusable React components. Use these rather than making new components whenever you can.
context/ contains custom React hooks and context providers.
theme/ contains reusable style and theme variables for the application, as referenced by useStyles.
