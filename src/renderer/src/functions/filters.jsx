  export function setFilterEvent(setActiveFilters, titles, names, ref = null) {
    setActiveFilters(prev => {
      const updatedFilters = { ...prev };

      titles.forEach((title, index) => {
        updatedFilters[title] = names[index];
      });

      return updatedFilters;
    });

    //close dropdown
    if (ref) {
      ref.current.classList.add("disactive");

      setTimeout(() => {
        ref.current.classList.remove("disactive");
      }, 10);
    }
  }

    export function setPriceCurr(curr, setCurr, ref) {
      setCurr(curr)
      if (ref) {
      ref.current.classList.add("disactive");

      setTimeout(() => {
        ref.current.classList.remove("disactive");
      }, 10);
    }
  }