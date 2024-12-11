import './App.css';
import { Route, Routes } from "react-router-dom";
import FirstDining from './components/dining/firstDining';
import ImageGallery from './components/dining/resturants';
import Programs from './components/Programs/Programs';
import FirstGallery from './components/gallery/FirstGallery';
import Header from './components/navs/Header';
import NavBars from './components/navs/NavBars';
import Footer from './components/homepage/Footer';
import Login from './components/Login/Login';
import Details from './components/Reservation/Details';
import Success from './components/Reservation/Success';
// import BookingStepper from './components/Reservation/Stepper';
import { Provider } from 'react-redux';
import { store } from './store/store';
import MyReservation from './components/MyReservation/MyReservation';
import UserData from './components/Reservation/UserData';
import Cart from './components/Reservation/Cart';
import BookingStepper from './components/Reservation/Stepper';
function App() {
  return (
    <Provider store={store}>
      <Header />
      <NavBars />
      <Routes>
        <Route path="/" element={<Programs />} />
        <Route path="/home" element={<Programs />} />
        <Route path="/details" element={<Details />} />
        <Route path="/details/:id" element={<Details />} />
        <Route path="/program" element={<Programs />} />
        <Route path='/dining' element={<FirstDining />} />
        <Route path='/restaurants' element={<ImageGallery />} />
        <Route path='/gallery' element={<FirstGallery />} />
        <Route path="/login" element={<Login />} />
        <Route path="/success" element={<Success />} />
        <Route path="/booking/:step" element={<BookingStepper />} />
        <Route path="/cart" element={<BookingStepper />} />
        <Route path="/user-data" element={<UserData />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/my-reservation" element={<MyReservation />} />
      </Routes>
      <Footer />
    </Provider>

  );
}

export default App;
