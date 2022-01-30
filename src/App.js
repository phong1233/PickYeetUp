import './App.css';
import { CustomerProvider } from './contexts/CustomerContext';
import { OtherProvider } from './contexts/OtherContext';
import MapDisplay from './map/MapDisplay';
import Overlay from './overlay/Overlay';

function App() {
  return (
    <div className="App">
      <div className='App-header'>
        <OtherProvider>

        <CustomerProvider>
          <Overlay />
          <MapDisplay />
          </CustomerProvider>
        </OtherProvider>
      </div>
    </div>
  );
}

export default App;
