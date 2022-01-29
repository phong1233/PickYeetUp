import './App.css';
import { CustomerProvider } from './contexts/CustomerContext';
import MapDisplay from './map/MapDisplay';
import Overlay from './overlay/Overlay';

function App() {
  return (
    <div className="App">
      <div className='App-header'>
        <CustomerProvider>
          <Overlay />
          <MapDisplay />
        </CustomerProvider>
      </div>
    </div>
  );
}

export default App;
