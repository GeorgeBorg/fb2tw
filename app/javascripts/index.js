import 'stylesheets/global';

import React from 'react';
import ReactDOM from 'react-dom';
import Application from './Application';

// Get the element to prepend our app to from teamweek.
// This could be a specific element on a website or something more general like `document.body`.
const inject = document.getElementsByTagName('body')[0];

// Create a div to render the App component to.
const app = document.createElement('div');

// Set the app element's id to `root`.
// This name is the same as the element that create-react-app renders to by default
// so it will work on the development server too.
app.id = 'root';
app.className = 'root';

// Prepend the App to the viewport element in production if it exists on the page.
// You could also use `appendChild` depending on your needs.
if (inject) inject.append(app);

// Render the App.
ReactDOM.render(<Application />, document.getElementById('root'));
