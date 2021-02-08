import "./index.css";
import "./i18n";

//import * as serviceWorker from "./serviceWorker";

import React, { Suspense } from "react";

import App from "./App";
import ReactDOM from "react-dom";

ReactDOM.render(
  <Suspense fallback={<div />}>
    <App />
  </Suspense>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.unregister();
