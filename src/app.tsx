import { createRoot } from 'react-dom/client';
import Map from './components/Map';

const domNode = document.getElementById('app');
const root = createRoot(domNode);
root.render(
  <>
    <Map />
  </>
);