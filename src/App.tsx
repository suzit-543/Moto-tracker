import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EntriesProvider } from './context/EntriesContext';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddEntry from './pages/AddEntry';
import History from './pages/History';
import Stats from './pages/Stats';

function App() {
  return (
    <EntriesProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddEntry />} />
          <Route path='/edit/:id' element={<AddEntry/>}/>
          <Route path="/history" element={<History />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </BrowserRouter>
    </EntriesProvider>
  );
}

export default App;