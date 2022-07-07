import { Welcome } from "@bb/components";
import React, { useState } from "react";
import 'twind/shim';
import { Window } from "./components/Window";

const App: React.FC = () => {
  const [count, setCount] = useState(0);

  function test() {
    console.log('test');
  }

  return (
    <Window>
       <Welcome msg={"嘤嘤嘤" + count} />
       <button onClick={test}>test</button>
    </Window>
  );
};

export default App;
