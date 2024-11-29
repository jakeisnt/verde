# Components

This folder contains React components used throughout the application.

Components should be placed here rather than in the src/ folder if they are reusable or otherwise are not directly part of the page hierarchy of the application.

If you're in need of a new component that is sufficiently generic, please look here before deferring to another library or writing your own. Also, make sure to use the Title, Subtitle and Text components rather than using HTML text elements in React code - this makes our website much easier to style as it gives us a single source of truth for the text components.

To give the site a consistent look, most new components should likely be built off of the `Box` component - or at least using similar styles.

`styles.js` provides a shared configuration of CSS-in-JS styles for all of the components. If your styles are sufficiently complicated, or there are multiple subcomponents associated with the component, it's a better idea to create a folder in this directory to contain those components with shared attributes.

`prop-types.js` contains React prop types augmented to the default prop-types provided by the library. This is useful primarily because some of the React prop types - like child components - are a bit annoying and complex. Import that file instead of the `prop-types` package, and place long prop types that you've had to reuse in that file instead of copying and pasting them.
