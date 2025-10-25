import React, { useState, useEffect, useRef } from 'react';
import '../styles/Home.css';
import '../styles/Dialogs.css';
import { SideBar } from '../components/home/SideBar';
import { NavigationBar } from '../components/home/navigation_bar/NavigationBar';
import { Outlet, useNavigate } from 'react-router-dom';
import { toursPath } from '../routes';
import { ScrollContext } from '../tools/ScrollContext';
import { apiGet } from '../functions/api';
import { useAppStore } from '../store';

function Home() {
  const {pages} = useAppStore()
  const [navbarHidden, setNavbarHidden] = useState('top');
  const [canGoBack, setCanGoBack] = useState(false);
  const homeAreaRef = useRef(null);
  const lastScrollPosition = useRef(0);
  // 🔁 Enable back button if history allows

  useEffect(() => {
    setCanGoBack(window.history.length > 1);
  }, [pages]);

  // 🎯 Update navbar based on scroll direction
  useEffect(() => {
    const scrollContainer = homeAreaRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const currentScroll = scrollContainer.scrollTop;
      const isScrollingDown = lastScrollPosition.current < currentScroll;

      setNavbarHidden(currentScroll <= 0 ? 'top' : (isScrollingDown ? 'hidden' : 'active'));
      lastScrollPosition.current = currentScroll;
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, []);

  // 📌 Provide scroll control to any child
  const scrollMethods = {
    scrollToBottom: () => {
      const container = homeAreaRef.current;
      if (container) {
        container.scrollTo({
          top: container.scrollHeight,
          behavior: 'smooth',
        });
      }
    },
    scrollToTop: () => {
      const container = homeAreaRef.current;
      if (container) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    scrollTo: (y) => {
      const container = homeAreaRef.current;
      if (container) {
        container.scrollTo({ top: y, behavior: 'smooth' });
      }
    },
  };
  return (
    
    <ScrollContext.Provider value={scrollMethods}>
      <div className="home-screen">
        <SideBar/>

        <div className="home-area" ref={homeAreaRef}>
          <NavigationBar
            goBack={()=> navigate(-1)}
            canGoBack={canGoBack}
            hidden={navbarHidden}
            page={pages}
          />

          <div className="home-content">
            <Outlet />
          </div>
        </div>
      </div>
    </ScrollContext.Provider>
    
  );

 /*
 return <ConfrimDialog/>
 */
}

export default Home;

