import { createContext, useContext } from 'react';

export const ScrollContext = createContext({
  scrollToBottom: () => {},
  scrollToTop: () => {},
  scrollTo: (y) => {},
});

export const useScroll = () => useContext(ScrollContext);
