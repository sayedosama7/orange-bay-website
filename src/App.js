import './App.css';
import { Route, Routes } from "react-router-dom";
import Home from './components/homepage/Home';
import FirstDining from './components/dining/firstDining';
import ImageGallery from './components/dining/resturants';
import QRCodePage from './components/Reservation/qrcode';
import Programs from './components/Programs/Programs';
import FirstGallery from './components/gallery/FirstGallery';
import Header from './components/navs/Header';
import NavBars from './components/navs/NavBars';
import Footer from './components/homepage/Footer';
import Reservation from './components/Reservation/Reservation';
import Login from './components/Login/Login';
function App() {
  return (
    <>
      <Header />
      <NavBars />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Reservation" element={<Reservation />} />
        <Route path="/Reservation/:id" element={<Reservation />} />
        <Route path="/program" element={<Programs />} />
        <Route path='/dining' element={<FirstDining />} />
        <Route path='/restaurants' element={<ImageGallery />} />
        <Route path='/gallery' element={<FirstGallery />} />
        <Route exact path="/qrcode" element={<QRCodePage />} />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
