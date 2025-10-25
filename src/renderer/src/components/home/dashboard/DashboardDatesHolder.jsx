import React, { useEffect, useState } from 'react'
import { RangeToorFilter } from '../filters/RangeToorFilter'
import { ConfirmButton } from '../add/ConfirmButton'
import { setFilterEvent } from '../../../functions/filters'
import { StateCard } from '../filters/StateCard'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export const DashboardDatesHolder = ({ apply, origActiveFilters }) => {
  const [tempFilters, setTempFilters] = useState(origActiveFilters);
  const [dateState, setDateState] = useState(null);
  const [validApply, setValidApply] = useState(false);

  // Normalize helper
  function normalize(date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  // Re-sync when parent filters change
  useEffect(() => {
    setTempFilters(origActiveFilters);
  }, [origActiveFilters]);

  // Check if Apply is needed
  useEffect(() => {
    const isSame =
      tempFilters[" From"]?.getTime() === origActiveFilters[" From"]?.getTime() &&
      tempFilters[" To"]?.getTime() === origActiveFilters[" To"]?.getTime();

    setValidApply(!isSame);
  }, [tempFilters, origActiveFilters]);

  // Preset handling (updates tempFilters only)
  useEffect(() => {
    const curr = new Date();

    if (dateState === "This Week") {
      const start = normalize(new Date(curr));
      start.setDate(curr.getDate() - curr.getDay());
      const end = new Date(start);
      end.setDate(start.getDate() + 6);
      setTempFilters({ " From": start, " To": normalize(end) });

    } else if (dateState === "This Month") {
      const firstDay = normalize(new Date(curr.getFullYear(), curr.getMonth(), 1));
      const lastDay = normalize(new Date(curr.getFullYear(), curr.getMonth() + 1, 0));
      setTempFilters({ " From": firstDay, " To": lastDay });

    } else if (dateState === "This Year") {
      const firstDay = normalize(new Date(curr.getFullYear(), 0, 1));
      const lastDay = normalize(new Date(curr.getFullYear(), 11, 31));
      setTempFilters({ " From": firstDay, " To": lastDay });
    }
  }, [dateState]);

  // Detect which preset matches current tempFilters
  useEffect(() => {
    if (!tempFilters[" From"] || !tempFilters[" To"]) return;
    const fromDate = normalize(tempFilters[" From"]);
    const toDate = normalize(tempFilters[" To"]);
    const curr = new Date();

    const firstDayOfWeek = normalize(new Date(curr));
    firstDayOfWeek.setDate(curr.getDate() - curr.getDay());
    const lastDayOfWeek = new Date(firstDayOfWeek);
    lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

    const firstDayOfMonth = normalize(new Date(curr.getFullYear(), curr.getMonth(), 1));
    const lastDayOfMonth = normalize(new Date(curr.getFullYear(), curr.getMonth() + 1, 0));

    const firstDayOfYear = normalize(new Date(curr.getFullYear(), 0, 1));
    const lastDayOfYear = normalize(new Date(curr.getFullYear(), 11, 31));

    if (fromDate.getTime() === firstDayOfWeek.getTime() && toDate.getTime() === lastDayOfWeek.getTime()) {
      setDateState("This Week");
    } else if (fromDate.getTime() === firstDayOfMonth.getTime() && toDate.getTime() === lastDayOfMonth.getTime()) {
      setDateState("This Month");
    } else if (fromDate.getTime() === firstDayOfYear.getTime() && toDate.getTime() === lastDayOfYear.getTime()) {
      setDateState("This Year");
    } else {
      setDateState(null); // no preset selected
    }
  }, [tempFilters]);

  function applyEvent() {
    apply({ ...tempFilters });
  }

  function clearEvent() {
    setTempFilters(origActiveFilters);
  }
  return (
    <div style={{ display: "flex", width: "90%", marginLeft: "auto", alignItems: "center" }}>
      <div style={{ display: "flex", gap: "10px", width: "90%", marginLeft: "auto", alignItems: "center" }}>
      <StateCard active={dateState} text={"This Week"} event={() => setDateState("This Week")} />
      <StateCard active={dateState} text={"This Month"} event={() => setDateState("This Month")} />
      <StateCard active={dateState} text={"This Year"} event={() => setDateState("This Year")} />
    
      <RangeToorFilter
        remove={false}
        title={""}
        to={tempFilters[" To"]}
        from={tempFilters[" From"]}
        maxToday={true}
        setFilterEvent={(titles, names, ref) =>
          setFilterEvent(setTempFilters, titles, names, ref)
        }
      />
      </div>
      <div style={{ width: '10px' }}></div>
      {validApply && (
        <>
          <ConfirmButton style={{ height: "35px" }} name="Apply" onClick={applyEvent} />
          <div className='icon-container remove' onClick={clearEvent} style={{margin : 'none'}}>
                                  <FontAwesomeIcon icon={faXmark}/>
                              </div>

        </>
      )}
    </div>
  );
};
