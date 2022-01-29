import './App.css';
import MapDisplay from './map/MapDisplay';
import Overlay from './overlay/Overlay';

function App() {
  return (
    <div className="App">
      <div className='App-header'>
        <Overlay />
        <MapDisplay />
      </div>
    </div>
  );
}

export default App;
