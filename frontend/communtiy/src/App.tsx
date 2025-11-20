import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '@/components/Layout/Header';
import Home from '@/pages/Home';
import ContentDetail from '@/pages/ContentDetail';
import Publish from '@/pages/Publish';
import '@/styles/global.css';
import '@/styles/responsive.css';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/content/:id" element={<ContentDetail />} />
        <Route path="/publish" element={<Publish />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
