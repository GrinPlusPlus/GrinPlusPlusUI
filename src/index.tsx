import * as serviceWorker from "./serviceWorker";
import App from "./App";
import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import "./index.css";

import "./i18n";

ReactDOM.render(
  <Suspense fallback={<div />}>
    <App />
  </Suspense>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
