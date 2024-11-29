# Client

This is the client of our game application - structured to use React with CSS-in-JS.

## Scripts
- `yarn start` :: Starts the front-end. Make sure you've started the server elsewhere! It may be better just to use the command defined at the repository root.
- `yarn test` :: Test the application. For now this is unused.
- `yarn build` :: Create a production build of the application for deployment. This is not necessary for development.

## Structure
src/ contains all of the source code. You'll probably be writing all of your code here.
public/ contains the base HTML file that our website is mounted to, along with logos and other website information necessary when hosting the website. This is where our application is deployed.
scripts/ contains scripts for building and testing the application.
config/ contains all of the guts necessary to compile this React application and create production deployments. Don't mess with this unless you know what you're doing - webpack and babel are a significant headache and will cause incomprehensible errors.
