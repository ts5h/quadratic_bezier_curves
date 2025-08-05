import type { FC } from "react";
import { Curve } from "./components/Curve";
import { GitHub } from "./components/GitHub";
import { ReturnToHome } from "./components/ReturnToHome";
import "./scss/App.scss";

export const App: FC = () => (
  <div className="App">
    <ReturnToHome theme="light" />
    <GitHub theme="light" />
    <Curve />
  </div>
);
