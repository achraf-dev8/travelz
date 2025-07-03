import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import { Toors } from "./pages/Home/Toors";
import { Travelers } from "./pages/Home/travelers";


export const homePath = '/';
export const toursPath = 'tours';
export const router = createBrowserRouter([
  {
    path: homePath,
    element: <Home />, // Home includes the layout (sidebar + navbar)
    children: [
      { path: '', element: <Travelers /> }, // renders on '/'
      { path: toursPath, element: <Toors /> }, // renders on '/tours'
    ]
  }
]);

export const routingMap = {
  
}