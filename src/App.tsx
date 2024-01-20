import React, { FC } from "react";
import { ReturnToHome } from "./components/ReturnToHome";
import { GitHub } from "./components/GitHub";
import { Circles } from "./components/Circles";
import "./scss/App.scss";

export const App: FC = () => (
  <div className="App">
    <ReturnToHome theme="light" />
    <GitHub theme="light" />
    <Circles />
  </div>
);
