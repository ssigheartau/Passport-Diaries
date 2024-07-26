import LoginRegister from './Components/LoginRegister/LoginRegister';
import HomePage from './Components/HomePage/HomePage';
import TripDetails from './Components/TripsDetails/TripDetails';

import { BrowserRouter, Routes, Route}from 'react-router-dom';



const Pages = () => {
    return(
        <BrowserRouter>
            <Routes>
                <Route index element={<LoginRegister />}/><Route/>
                <Route path="Homepage" element={<HomePage />}/><Route/>
                <Route path="/tripdetails/:tripId" element={<TripDetails />}/><Route/>
                   
            </Routes>
        </BrowserRouter>
    );
};

export default Pages;

