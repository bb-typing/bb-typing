import { ipcRenderer } from 'electron';

function App(): JSX.Element {
  function btnClick() {
    console.log('ipcRenderer', ipcRenderer);
  }

  return (
    <div>
      <button>所以？你还是你吗？</button>
    </div>
  );
}

export default App;
