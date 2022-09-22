import React from 'libs/react';
import ReactDOM from "libs/react-dom/client";

import App from './app'



const mount = (id, cb) => {
    let appNode = document.getElementById(id);
    let app = ReactDOM.createRoot(appNode)
    app.render(<App />)

    cb instanceof Function && cb(app)
}


const unmount = (app, cb) => {
    app.unmount()
    cb instanceof Function && cb()
}

export const config = {

    mount, unmount
}
