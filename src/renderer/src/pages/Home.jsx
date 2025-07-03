import React, { useState, useEffect, useRef } from 'react';
import '../styles/Home.css';
import { SideBar } from '../components/home/SideBar';
import { NavigationBar } from '../components/home/navigation_bar/NavigationBar';
import { Toors } from './Home/Toors';
import { Travelers } from './Home/travelers';
import { Locations } from './Home/Locations';
import { AddTraveler } from './Home/travelers/AddTraveler';
import { AddFamily } from './Home/travelers/AddFamily';
import { TravelerInfo } from './Home/travelers/TravelerInfo';
import { EditDialog } from '../components/home/info/EditDialog';
import { Outlet, useNavigate } from 'react-router-dom';
import { toursPath } from '../routes';

function Home() {

  const [currentPage, setCurrentPage] = useState(['Dashboard']);
  const [navbarHidden, setNavbarHidden] = useState('top');
  const lastScrollPosition = useRef(0);
  const homeAreaRef = useRef(null);
  const [canGoBack, setCanGoBack] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
      setCanGoBack(window.history.length > 1);
  }, [currentPage]);

  function goBack(){
    navigate(-1)
    
  }

  useEffect(() => {
    const scrollContainer = homeAreaRef.current;
    const handleScroll = () => {
      const currentScrollPosition = homeAreaRef.current.scrollTop;
      if (currentScrollPosition <= 0) {
        setNavbarHidden('top');
        return;
      }
      setNavbarHidden(lastScrollPosition.current < currentScrollPosition ? 'hidden' : 'active');
      lastScrollPosition.current = currentScrollPosition;
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  function setCurrentPageEvent(page) {

    setCurrentPage(page);
    if (page[page.length - 1] == 'Tours') navigate(toursPath)
      else navigate('/')
  }

  return (
    <div className="home-screen">
      <SideBar currentPage={currentPage[0]} setCurrentPageEvent={setCurrentPageEvent} />
      <div className="home-area" ref={homeAreaRef}>
        <NavigationBar canGoBack={canGoBack} hidden={navbarHidden} page={["Travelers", "Add Traveler", "Traveler Info"]} />
        <div className="home-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Home;