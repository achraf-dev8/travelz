import React from 'react';
import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import { Toors } from "./pages/Home/Toors";
import { Hotels } from './pages/Home/Hotels';
import { Guides } from './pages/Home/Guides';
import { Airports } from './pages/Home/Airports';
import { Buses } from './pages/Home/Buses';
import { Documents } from './pages/Home/Documents';
import { Travelers } from './pages/Home/Travelers';
import { AddTraveler } from './pages/Home/travelers/AddTraveler';
import { TravelerInfo } from './pages/Home/travelers/TravelerInfo';
import { AddTourTraveler } from './pages/Home/toors/AddTourTraveler';
import { AddTour } from './pages/Home/toors/AddTour';
import { ToorInfo } from './pages/Home/toors/ToorInfo';
import { AddHotel } from './pages/Home/hotels/AddHotel';
import { AddAirport } from './pages/Home/airports/AddAirport';
import { AddBus } from './pages/Home/buses/AddBus';
import { AddGuide } from './pages/Home/guides/AddGuide';
import { HotelInfo } from './pages/Home/hotels/HotelInfo';
import { AirportInfo } from './pages/Home/airports/AirportInfo';
import { BusInfo } from './pages/Home/buses/BusInfo';
import { GuideInfo } from './pages/Home/guides/GuideInfo';
import { Dashboard } from './pages/Home/Dashboard';
import { FullSettings } from './pages/Home/settings/FullSettings';
import { UsersTable } from './components/settings/UsersTable';
import { Settings } from './pages/Home/settings/Settings';
import { AddUser } from './pages/Home/settings/AddUser';

export const homePath = '/';
export const toursPath = 'tours';
export const addTourTravPath = 'addTourTrav';

export const router = createBrowserRouter([
  {
    path: homePath,
    element: <Home />, // Home includes the layout (sidebar + navbar)
    children: [
      { path: '', element: <Dashboard/> }, // renders on '/'
      { path: 'dashboard', element: <Dashboard/> }, // renders on '/'
      { path: '/add-tour', element: <AddTour /> }, // renders on '/'
      { path: toursPath, element: <Toors /> },
      { path: '/hotels', element: <Hotels /> },
      { path: '/airports', element: <Airports /> },
      { path: '/buses', element: <Buses /> },
      { path: '/add-traveler', element: <AddTraveler /> },
      { path: '/add-hotel', element: <AddHotel /> },
      { path: '/add-guide', element: <AddGuide /> },
      { path: '/add-airport', element: <AddAirport /> },
      { path: '/add-bus', element: <AddBus /> },
      { path: '/hotel-info/:id', element: <HotelInfo /> },
      { path: '/tour-info/:id', element: <ToorInfo /> },
      { path: '/traveler-info/:id', element: <TravelerInfo /> },
      { path: '/airport-info/:id', element: <AirportInfo /> },
      { path: '/bus-info/:id', element: <BusInfo /> },
      { path: '/guide-info/:id', element: <GuideInfo /> },
      { path: '/add-tour-travelers', element: <AddTourTraveler /> },
      { path: '/edit-tour', element: <AddTour /> },
      { path: '/edit-tour-travelers', element: <AddTourTraveler /> },
      { path: '/traveler-info', element: <TravelerInfo /> },
      { path: '/documents', element: <Documents /> },
      { path: '/travelers', element: <Travelers /> },
      { path: '/guides', element: <Guides /> },
      { path: '/settings', element: <FullSettings /> },
    ]
  }
]);

export const routingMap = {
  
}