import { Input, TestShow } from "@bb/components";
import { State } from "@bb/core";
import React from "react";
import 'twind/shim';
import { Window } from "./components/Window";

const App: React.FC = () => {
  return (
    <Window>
      <State>
        <Input id="input1" value="hello" />
        <TestShow targetId="input1" targetKey="value" />
      </State>
    </Window>
  );
};

export default App;
