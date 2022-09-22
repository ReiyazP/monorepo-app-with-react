import React from "libs/react";
import ReactDOM from "libs/react-dom/client";

import App from './app';

const appNode = document.getElementById("about-root");

if (appNode) {
    const app = ReactDOM.createRoot(appNode)
    app.render(<App />)
}



