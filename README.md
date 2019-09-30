# taco-builder
A taco builder made for a job application programming challenge.

Author: Duncan Grubbs <duncan.grubbs@gmail.com>


To run the project:

1. Install Javascript dependencies:
yarn install

2. Start a local development server:
yarn start

This will run the development server on localhost:3000 in your browser.

3. To Build:
yarn build

4. To Test:
yarn test

While overkill for such a small application, I chose to use React and Redux because
in a production setting it is typical to use some kind of library or framework, and
these are two that I am very familiar with.

Redux handles the global state of the app which is just the list of currently built tacos.
I chose to put this list in global state because various components need
to both read and write from the list, and it makes for easy expansion of the app.

There are a few very basic tests, I did not write more as it was not part of the requirement.

The main React components are:
TacoBuilder.js: the user interface and logic behind manually and randomly building tacos
Taco.js: the taco descriptions in the list of built tacos. Includes taco removal functionality.

To Note:
1. Once an ingredient is selected, it must be clicked again to be unselected. You can select
up to the number of ingredients listed on screen for each category. Once you have made
your decisions, you are prompted to "Review" your taco and then "Build It".

2. Because of a duplicate in the API response for /baseLayers I hard-coded the removal of it
on line 77 of TacoBuilder.jsx

