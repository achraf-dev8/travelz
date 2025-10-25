import React, { useEffect, useRef, useState } from 'react';
import { InputElement } from '../../../components/inputs/InputElement';
import { useFormik } from 'formik';
import { airportSchema, busSchema, schema } from '../../../functions/schema';
import { AddTourTypesHolder } from '../../../components/home/toors/AddTourTypesHolder';
import { setFilterEvent, setPriceCurr } from '../../../functions/filters';
import { FilterDropDown } from '../../../components/home/filters/FilterDropDown';
import Calender from '../../../components/home/Calender';
import { AutoCompleteField } from '../../../components/inputs/AutoCompleteField';
import { apiGet } from '../../../functions/api';
import { PriceInput } from '../../../components/inputs/PriceInput';
import { SectionHeader } from '../../../components/inputs/SectionHeader';
import { FilterCard } from '../../../components/home/filters/FilterCard';
import { ConfirmButton } from '../../../components/home/add/ConfirmButton';
import { faBus, faHotel, faLocationDot, faPersonHiking, faPlaneDeparture, faUser } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import { completeFormatDate } from '../../../functions/dates';
import { CheckBox } from '../../../components/inputs/CheckBox';
import { useAppStore } from '../../../store';


export const AddTour = () => {
  
  const location = useLocation();
  const { tour } = location.state || {};
  const {agency, setPages} = useAppStore();
  

  const [umrah, setUmrah] = useState(false);
  const [expenses, setExpenses] = useState(false);
  const [revenue, setRevenue] = useState(false);
  const [activeTypes, setActiveTypes] = useState({
    "Type": "Individual", "Location": "National", "Transport": "Bus", "State": "Waiting",
  });
  const [states, setStates] = useState(["Waiting", "Active", "Ended", "Canceled"]);

  //Curr
  const [roomPriceCurr, setRoomPriceCurr] = useState("DA");
  const [depAirportTicketCurr, setDepAirportTicketCurr] = useState("DA");
  const [retAirportTicketCurr, setRetAirportTicketCurr] = useState("DA");
  const [depBusTicketCurr, setDepBusTicketCurr] = useState("DA");
  const [retBusTicketCurr, setRetBusTicketCurr] = useState("DA");
  const [guideTicketCurr, setGuideTicketCurr] = useState("DA");

  const [departureDate, setDepartureDate] = useState("any");
  const [returnDate, setReturnDate] = useState("any");

  const fromRefDialog = useRef(null);
  const toRefDialog = useRef(null);

  const [fromDialogOpen, setFromDialogOpen] = useState(false);
  const [toDialogOpen, setToDialogOpen] = useState(false);
  //New Elements
  const [newHotel, setNewHotel] = useState("Edit");
  const [changedHotel, setChangedHotel] = useState(false);
  const hotelId = useRef(null);
  const [originalHotel, setOriginalHotel] = useState(null);
  const skipHotelLocationFetch = useRef(false);
  const [newDepAirport, setNewDepAirport] = useState("Edit");
  const [changeDepAirport, setChangeDepAirport] = useState(false);
  const depAirportId = useRef(null);
  const [originalDepAirport, setOriginalDepAirport] = useState(null);
  const skipDepAirportLocationFetch = useRef(false);

  const [newDepBus, setNewDepBus] = useState("Edit");
  const [changeDepBus, setChangeDepBus] = useState(false);
  const depBusId = useRef(null);
  const [originalDepBus, setOriginalDepBus] = useState(null);
  const skipDepBusLocationFetch = useRef(false);

  const [newReturnBus, setNewReturnBus] = useState("Edit");
  const [changeReturnBus, setChangeReturnBus] = useState(false);
  const returnBusId = useRef(null);
  const [originalReturnBus, setOriginalReturnBus] = useState(null);
  const skipReturnBusLocationFetch = useRef(false);

  const [newRetAirport, setNewRetAirport] = useState("Edit");
  const [changeRetAirport, setChangeRetAirport] = useState(false);
  const retAirportId = useRef(null);
  const [originalRetAirport, setOriginalRetAirport] = useState(null);
  const skipRetAirportLocationFetch = useRef(false);

  const skipDestiantionFetch = useRef(false);
  const skipHotelFetch = useRef(false);
  const skipDepAirportFetch = useRef(false);
  const skipRetAirportFetch = useRef(false);
  const skipDepBusFetch = useRef(false);
  const skipRetBusFetch = useRef(false);

  const navigate = useNavigate();

  const [newGuide, setNewGuide] = useState("Edit");
  const [changedGuide, setChangedGuide] = useState(false);
  const guideId = useRef(null);
  const [originalGuide, setOriginalGuide] = useState(null);
  const skipGuideFetch = useRef(false);

  useEffect(() => {
    if(tour?.id){
      setPages(['Tours', 'Edit Tour']);
    }else{
      setPages(['Tours', 'Add Tour']);
    }
  }, []);

  function toggleDialog(ref, isFrom = true) {
    if (!ref.current) return;

    if (ref.current.hasAttribute("open")) {
      ref.current.close();
      isFrom ? setFromDialogOpen(false) : setToDialogOpen(false);
    } else {
      ref.current.showModal();
      isFrom ? setFromDialogOpen(true) : setToDialogOpen(true);
    }
  }

  function confirmFrom(date) {
    toggleDialog(fromRefDialog, true);
    setDepartureDate(date);

    // If return date is before the new departure, fix it
    if (returnDate !== "any" && new Date(date) > new Date(returnDate)) {
      setReturnDate(date);
    }
  }


  function confirmTo(date) {
    toggleDialog(toRefDialog, false);
    setReturnDate(date);

    // If departure date is after the new return, fix it
    if (departureDate !== "any" && new Date(date) < new Date(departureDate)) {
      setDepartureDate(date);
    }
  }




  const formik = useFormik({
    initialValues: {
      location: "",
      hotelName: "",
      destination: "",
      hotelLocation: "",
      hotelPhoneNumber: "",
      hotelPrice: "",
      depAirportName: "",
      depAirportLocation: "",
      depAirportPhoneNumber: "",
      depAirportTicketPrice: "",
      retAirportName: "",
      retAirportLocation: "",
      retAirportPhoneNumber: "",
      retAirportTicketPrice: "",
      depBusName: "",
      depBusLocation: "",
      depBusPhoneNumber: "",
      depBusTicketPrice: "",
      retBusName: "",
      retBusLocation: "",
      retBusPhoneNumber: "",
      retBusTicketPrice: "",
      guidePrice: "",
      guideName: "",
      guidePhoneNumber: "",
      note : ""
    },
    validationSchema: activeTypes["Transport"] === "Plane" ? airportSchema : busSchema,
    onSubmit: (values) => {
      const tourData = compileTourData();
      navigate('/add-tour-travelers', { state: { tour: tourData } });
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

    useEffect(() => {
      if(tour){
        
      formik.setValues({
        hotelName: tour.hotel?.name || "",
        destination: tour.destination || "",
        hotelLocation: tour.hotel?.location || "",
        hotelPhoneNumber: tour.hotel?.phone_number || "",
        hotelPrice: tour.hotel?.room_price || "",
        depAirportName: tour.departure_airport?.name || "",
        depAirportLocation: tour.departure_airport?.location || "",
        depAirportPhoneNumber: tour.departure_airport?.phone_number || "",
        depAirportTicketPrice: tour.departure_airport?.ticket_price || "",
        retAirportName: tour.return_airport?.name || "",
        retAirportLocation: tour.return_airport?.location || "",
        retAirportPhoneNumber: tour.return_airport?.phone_number || "",
        retAirportTicketPrice: tour.return_airport?.ticket_price || "",
        depBusName: tour.departure_bus?.name || "",
        depBusLocation: tour.departure_bus?.location || "",
        depBusPhoneNumber: tour.departure_bus?.phone_number || "",
        depBusTicketPrice: tour.departure_bus?.ticket_price || "",
        retBusName: tour.return_bus?.name || "",
        retBusLocation: tour.return_bus?.location || "",
        retBusPhoneNumber: tour.return_bus?.phone_number || "",
        retBusTicketPrice: tour.return_bus?.ticket_price || "",
        guidePrice: tour.guide?.price || "",
        guideName: tour.guide?.name || "",
        guidePhoneNumber: tour.guide?.phone_number || "",
        note : tour.note || "",
      })
      setUmrah(tour.umrah == 'Umrah');
      setExpenses(tour.canceled_expenses == 1);
      setExpenses(tour.canceled_revenue == 1);
      setActiveTypes({
        "Type": tour.type || "Individual",
        "Location": tour.locationType || "National",
        "Transport": tour.transportType || "Bus",
        "State": tour.state || "Waiting",
      });

      setDepartureDate(tour.departure_date || "any");
      console.log("rd", tour.return_date , "koddfkpo", tour.departure_date)
      setReturnDate(tour.return_date || "any");

      setRoomPriceCurr(tour.hotel?.currency || "DA");
      setDepAirportTicketCurr(tour.departure_airport?.currency || "DA");
      setRetAirportTicketCurr(tour.return_airport?.currency || "DA");
      setDepBusTicketCurr(tour.departure_bus?.currency || "DA");
      setRetBusTicketCurr(tour.return_bus?.currency || "DA");
      setGuideTicketCurr(tour.guide?.currency || "DA");

      hotelId.current = tour.hotel?.id || null;
      depAirportId.current = tour.departure_airport?.id || null;
      retAirportId.current = tour.return_airport?.id || null;
      depBusId.current = tour.departure_bus?.id || null;
      returnBusId.current = tour.return_bus?.id || null;
      guideId.current = tour.guide?.id || null;

      setOriginalHotel({hotelName: tour.hotel?.name || "", hotelPhoneNumber: tour.hotel?.phone_number || "", hotelLocation: tour.hotel?.location || ""});
      setOriginalDepAirport({airportName: tour.departure_airport?.name || "", airportPhoneNumber: tour.departure_airport?.phone_number || "", airportLocation: tour.departure_airport?.location || ""});
      setOriginalRetAirport({airportName: tour.return_airport?.name || "", airportPhoneNumber: tour.return_airport?.phone_number || "", airportLocation: tour.return_airport?.location || ""});
      setOriginalDepBus({busName: tour.departure_bus?.name || "", busPhoneNumber: tour.departure_bus?.phone_number || "", busLocation: tour.departure_bus?.location || ""});
      setOriginalReturnBus({busName: tour.return_bus?.name || "", busPhoneNumber: tour.return_bus?.phone_number || "", busLocation: tour.return_bus?.location || ""});
      setOriginalGuide({guideName: tour.guide?.name || "", guidePhoneNumber: tour.guide?.phone_number || ""});

      skipDestiantionFetch.current = true;
      skipHotelFetch.current = true;
      skipDepAirportFetch.current = true;
      skipRetAirportFetch.current = true;
      skipDepBusFetch.current = true;
      skipRetBusFetch.current = true;
      skipGuideFetch.current = true;

      skipDepBusLocationFetch.current = true;
      skipReturnBusLocationFetch.current = true;
      skipDepAirportLocationFetch.current = true;
      skipRetAirportFetch.current = true;
      skipHotelLocationFetch.current = true;

    }
    }, []);

  useEffect(() => {
    if (umrah) {
      formik.setFieldValue("destination", "Mecca");
      selectLocation({ display_name: "Mecca" });
      setActiveTypes((prev) => ({
      ...prev,
      Transport: "Plane",
    }));

    }
  }, [umrah]);

  useEffect(() => {
    skipFetches();
  }, [activeTypes["Transport"]]);


  function selectLocation(place, destination = false) {

    const isInAlgeria = (((place.display_name.toLowerCase().includes("algeria") || place.display_name.toLowerCase().includes("algerie")) 
    && !place.agency_id) || (place.location_type == 'National' && place.agency_id))
    if(destination){
    setActiveTypes((prev) => ({
      ...prev,
      Location: isInAlgeria ? "National" : "International",
    }));
    }


  }


  function skipFetches() {
    skipDepAirportFetch.current = true;
    skipRetAirportFetch.current = true;
    skipDepBusFetch.current = true;
    skipRetBusFetch.current = true;
  }


  const fetchPlacesData = async (query) => {
    /*
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&accept-language=en`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const allLocations = await res.json();
    */
   // const allLocations = [];
    try {
      const res = await apiGet(`/locations/search?query=${encodeURIComponent(query)}`, {
        cache: { ttl: 1000 * 60 * 5 },
      });
      console.log("RES", res)
      const locations = res.data.map(location => ({
        ...location,
        display_name: location.location
      }));

      return [...locations];
    } catch (err) {
      console.error("❌ Failed to fetch hotels:", err.message);
      return [];
    }


  };

  const fetchHotelsData = async (query) => {
    try {
      const res = await apiGet(`/hotels/search?query=${encodeURIComponent(query)}`, {
        cache: { ttl: 1000 * 60 * 5 },
      });
      return res.data.map(hotel => ({
        ...hotel,
        display_name: hotel.name,
      }));
    } catch (err) {
      console.error("❌ Failed to fetch hotels:", err.message);
      return [];
    }
  };

  const fetchGuidesData = async (query) => {
    try {
      const res = await apiGet(`/guides/search?query=${encodeURIComponent(query)}`, {
        cache: { ttl: 1000 * 60 * 5 },
      });
      return res.data.map(guide => ({
        ...guide,
        display_name: guide.name,
      }));
    } catch (err) {
      console.error("❌ Failed to fetch guides:", err.message);
      return [];
    }
  };

  function selectGuide(guide) {
    const cleanName = guide.name?.trim() || "";
    const cleanPhone = guide.phone_number?.trim() || "";

    formik.setFieldValue("guideName", cleanName);
    formik.setFieldValue("guidePhoneNumber", cleanPhone);

    guideId.current = guide.id;
    setOriginalGuide({
      guideName: cleanName,
      guidePhoneNumber: cleanPhone
    });
    setChangedGuide(false);
  }

  useEffect(() => {
    if (!originalGuide) {
      setChangedGuide(false);
      return;
    }

    const hasChanged =
      normalize(formik.values.guideName) !== normalize(originalGuide.guideName) ||
      normalize(formik.values.guidePhoneNumber) !== normalize(originalGuide.guidePhoneNumber);

    setChangedGuide(hasChanged);
  }, [
    formik.values.guideName,
    formik.values.guidePhoneNumber,
    originalGuide
  ]);

  useEffect(() => {
    const now = new Date();

    const dep = departureDate !== 'any' ? new Date(departureDate) : null;
    const ret = returnDate !== 'any' ? new Date(returnDate) : null;

    // If either is undefined ('any'), skip state logic
    if (!dep && !ret) {
      setStates(["Waiting", "Active", "Ended", "Canceled"]);
      return;
    }

    const updatedStates = [];

    if ((dep >= now || !dep) && (ret >= now || !ret)) {
      updatedStates.push("Waiting");
    }

    if ((dep < now || !dep) && (ret >= now || !ret)) {
      updatedStates.push("Active");
    }

    if ((ret < now || !ret) && (dep < now || !dep)) {
      updatedStates.push("Ended", "Canceled");
    }

    setStates(updatedStates.length > 0 ? updatedStates : ["Waiting"]); // default fallback

  }, [departureDate, returnDate]);

  useEffect(() => {
    if (!states.includes(activeTypes.State)) {
      // Auto-select the first available state from the updated list
      setActiveTypes(prev => ({
        ...prev,
        State: states[0] || "Waiting"
      }));
    }
  }, [states]);


  function selectHotel(hotel) {
    skipHotelLocationFetch.current = true;
    console.log('hotel', hotel)
    const cleanName = hotel.name?.trim() || "";
    const cleanPhone = hotel.phone_number?.trim() || "";
    const cleanLocation = hotel.location?.trim() || "";
    const cleanPrice = hotel.room_price;
    const cleanCurr = hotel.currency?.trim() ||"";

    formik.setFieldValue("hotelName", cleanName);
    formik.setFieldValue("hotelPhoneNumber", cleanPhone);
    formik.setFieldValue("hotelLocation", cleanLocation);
    formik.setFieldValue("hotelPrice", cleanPrice);
    formik.setFieldValue("hotelLocation", cleanLocation);
    setRoomPriceCurr(cleanCurr)

    hotelId.current = hotel.id;
    setOriginalHotel({
      hotelName: cleanName,
      hotelPhoneNumber: cleanPhone,
      hotelLocation: cleanLocation
    });
    setChangedHotel(false);
  }

  function selectDepAirport(airport) {

    skipDepAirportLocationFetch.current = true;
    const cleanName = airport.name?.trim() || "";
    const cleanPhone = airport.phone_number?.trim() || "";
    const cleanLocation = airport.location?.trim() || "";
    const cleanPrice = airport.ticket_price;
    const cleanCurr = airport.currency?.trim() || "";

    formik.setFieldValue("depAirportName", cleanName);
    formik.setFieldValue("depAirportPhoneNumber", cleanPhone);
    formik.setFieldValue("depAirportLocation", cleanLocation);
    formik.setFieldValue("depAirportTicketPrice", cleanPrice);
    setDepAirportTicketCurr(cleanCurr)

    depAirportId.current = airport.id;
    setOriginalDepAirport({
      airportName: cleanName,
      airportPhoneNumber: cleanPhone,
      airportLocation: cleanLocation
    });
    setChangeDepAirport(false);
  }

  function selectRetAirport(airport) {
    skipRetAirportLocationFetch.current = true;

    const cleanName = airport.name?.trim() || "";
    const cleanPhone = airport.phone_number?.trim() || "";
    const cleanLocation = airport.location?.trim() || "";
    const cleanPrice = airport.ticket_price;
    const cleanCurr = airport.currency?.trim() ||"";

    formik.setFieldValue("retAirportName", cleanName);
    formik.setFieldValue("retAirportPhoneNumber", cleanPhone);
    formik.setFieldValue("retAirportLocation", cleanLocation);
    formik.setFieldValue("retAirportTicketPrice", cleanPrice);
    setDepAirportTicketCurr(cleanCurr)

    retAirportId.current = airport.id;
    setOriginalRetAirport({
      airportName: cleanName,
      airportPhoneNumber: cleanPhone,
      airportLocation: cleanLocation
    });
    setChangeRetAirport(false);
  }

  const fetchAirportsData = async (query) => {
    try {
      const res = await apiGet(`/airports/search?query=${encodeURIComponent(query)}`, {
        cache: { ttl: 1000 * 60 * 5 },
      });
      return res.data.map(airport => ({
        ...airport,
        display_name: airport.name,
      }));
    } catch (err) {
      console.error("❌ Failed to fetch airports:", err.message);
      return [];
    }
  };

  const fetchBusesData = async (query) => {
    try {
      const res = await apiGet(`/buses/search?query=${encodeURIComponent(query)}`, {
        cache: { ttl: 1000 * 60 * 5 },
      });
      return res.data.map(bus => ({
        ...bus,
        display_name: bus.name,
      }));
    } catch (err) {
      console.error("❌ Failed to fetch buses:", err.message);
      return [];
    }
  };

  const normalize = (val) => (val || "").trim().toLowerCase();

  useEffect(() => {
    if (!originalHotel) {
      setChangedHotel(false);
      return;
    }

    const hasChanged =
    normalize(formik.values.hotelName) !== normalize(originalHotel.hotelName) ||
    normalize(formik.values.hotelPhoneNumber) !== normalize(originalHotel.hotelPhoneNumber) ||
    normalize(formik.values.hotelLocation) !== normalize(originalHotel.hotelLocation);
    setChangedHotel(hasChanged);

  }, [
    formik.values.hotelName,
    formik.values.hotelPhoneNumber,
    formik.values.hotelLocation,
    originalHotel
  ]);

  useEffect(() => {
    if (!originalDepBus) {
      setChangeDepBus(false);
      return;
    }

    const hasChanged =
      normalize(formik.values.depBusName) !== normalize(originalDepBus.busName) ||
      normalize(formik.values.depBusPhoneNumber) !== normalize(originalDepBus.busPhoneNumber) ||
      normalize(formik.values.depBusLocation) !== normalize(originalDepBus.busLocation);

    setChangeDepBus(hasChanged);
  }, [
    formik.values.depBusName,
    formik.values.depBusPhoneNumber,
    formik.values.depBusLocation,
    originalDepBus
  ]);

  useEffect(() => {
    if (!originalReturnBus) {
      setChangeReturnBus(false);
      return;
    }

    const hasChanged =
      normalize(formik.values.retBusName) !== normalize(originalReturnBus.busName) ||
      normalize(formik.values.retBusPhoneNumber) !== normalize(originalReturnBus.busName) ||
      normalize(formik.values.retBusLocation) !== normalize(originalReturnBus.busName);

    setChangeReturnBus(hasChanged);
  }, [
    formik.values.retBusName,
    formik.values.retBusName,
    formik.values.retBusName,
    originalReturnBus
  ]);

  useEffect(() => {
    if (!originalDepAirport) {
      setChangeDepAirport(false);
      return;
    }

    const hasChanged =
      normalize(formik.values.depAirportName) !== normalize(originalDepAirport.airportName) ||
      normalize(formik.values.depAirportPhoneNumber) !== normalize(originalDepAirport.airportPhoneNumber) ||
      normalize(formik.values.depAirportLocation) !== normalize(originalDepAirport.airportLocation);

    setChangeDepAirport(hasChanged);
  }, [
    formik.values.depAirportName,
    formik.values.depAirportPhoneNumber,
    formik.values.depAirportLocation,
    originalDepAirport
  ]);

  useEffect(() => {
    if (!originalRetAirport) {
      setChangeRetAirport(false);
      return;
    }

    const hasChanged =
      normalize(formik.values.retAirportName) !== normalize(originalRetAirport.airportName) ||
      normalize(formik.values.retAirportPhoneNumber) !== normalize(originalRetAirport.airportPhoneNumber) ||
      normalize(formik.values.retAirportLocation) !== normalize(originalRetAirport.airportLocation);

    setChangeRetAirport(hasChanged);
  }, [
    formik.values.retAirportName,
    formik.values.retAirportPhoneNumber,
    formik.values.retAirportLocation,
    originalRetAirport
  ]);

  function selectDepBus(bus) {
    skipDepBusFetch.current = true;

    const cleanName = bus.name?.trim() || "";
    const cleanPhone = bus.phone_number?.trim() || "";
    const cleanPrice = bus.ticket_price;
    const cleanCurr = bus.currency?.trim() ||"";

    formik.setFieldValue("depBusName", cleanName);
    formik.setFieldValue("depBusPhoneNumber", cleanPhone);
    formik.setFieldValue("depBusTicketPrice", cleanPrice);
    setDepBusTicketCurr(cleanCurr);
    
    depBusId.current = bus.id;
    setOriginalDepBus({
      busName: cleanName,
      busPhoneNumber: cleanPhone,
    });
    setChangeDepBus(false);
  }



  function selectRetBus(bus) {
    skipDepBusFetch.current = true;

    const cleanName = bus.name?.trim() || "";
    const cleanPhone = bus.phone_number?.trim() || "";
    const cleanPrice = bus.ticket_price;
    const cleanCurr = bus.currency?.trim() ||"";

    formik.setFieldValue("retBusName", cleanName);
    formik.setFieldValue("retBusPhoneNumber", cleanPhone);
    formik.setFieldValue("retBusTicketPrice", cleanPrice);
    setRetBusTicketCurr(cleanCurr);

    returnBusId.current = bus.id;
    setOriginalDepBus({
      busName: cleanName,
      busPhoneNumber: cleanPhone,
    });
    setChangeDepBus(false);
  }

  const hotelExists = () => formik.values.hotelName?.trim() == '';
  const depAirportExists = () => formik.values.depAirportName?.trim() == '';
  const retAirportExists = () => formik.values.retAirportName?.trim() == '';
  const depBusExists = () => formik.values.depBusName?.trim() == '';
  const retBusExists = () => formik.values.retBusName?.trim() == '';
  const guideExists = () => formik.values.guideName?.trim() == '';

  function getAddEdit(id, changed, newItem) {
    if (id && !changed) return "No"
    if (id && newItem === "Edit") return "Edit"
    return "Add"
  }

  const compileTourData = () => {
    console.log("log:", departureDate);
    const transportType = activeTypes["Transport"];
    console.log("od,o", transportType == "Plane")

    const tourData = {
      id : tour?.id || null,
      // General Information
      general: {
        type: activeTypes["Type"],
        locationType: activeTypes["Location"],
        transportType: transportType,
        state: activeTypes["State"],
        destination: formik.values.destination,
        isUmrah: umrah,
        canceledExpenses : expenses,
        canceledRevenue : revenue,
        departureDate: departureDate === "any" ? null : departureDate,
        returnDate: returnDate === "any" ? null : returnDate,
        note : formik.values.note.trim()
      },

      // Hotel Information
      hotel: formik.values.hotelName ? {
        id: hotelId.current,
        name: formik.values.hotelName,
        location: formik.values.hotelLocation,
        phoneNumber: formik.values.hotelPhoneNumber,
        price: formik.values.hotelPrice,
        currency: roomPriceCurr,
        add_edit: getAddEdit(hotelId.current, changedHotel, newHotel),
      } : null,

      departureAirport: formik.values.depAirportName && transportType == "Plane" ? {
        id: depAirportId.current,
        name: formik.values.depAirportName,
        location: formik.values.depAirportLocation,
        phoneNumber: formik.values.depAirportPhoneNumber,
        price: formik.values.depAirportTicketPrice,
        currency: depAirportTicketCurr,
        add_edit: getAddEdit(depAirportId.current, changeDepAirport, newDepAirport),
      } : null,

      returnAirport: formik.values.retAirportName && transportType == "Plane" ? {
        id: retAirportId.current,
        name: formik.values.retAirportName,
        location: formik.values.retAirportLocation,
        phoneNumber: formik.values.retAirportPhoneNumber,
        price: formik.values.retAirportTicketPrice,
        currency: retAirportTicketCurr,
        add_edit: getAddEdit(retAirportId.current, changeRetAirport, newRetAirport),
      } : null,

      departureBus: formik.values.depBusName && transportType == "Bus" ? {
        id: depBusId.current,
        name: formik.values.depBusName,
        location: formik.values.depBusLocation,
        phoneNumber: formik.values.depBusPhoneNumber,
        price: formik.values.depBusTicketPrice,
        currency: depBusTicketCurr,
        add_edit: getAddEdit(depBusId.current, changeDepBus, newDepBus),
      } : null,

      returnBus: formik.values.retBusName && transportType == "Bus" ? {
        id: returnBusId.current,
        name: formik.values.retBusName,
        location: formik.values.retBusLocation,
        phoneNumber: formik.values.retBusPhoneNumber,
        price: formik.values.depBusTicketPrice,
        currency: retBusTicketCurr,
        add_edit: getAddEdit(returnBusId.current, changeReturnBus, newReturnBus),
      } : null,

      guide: formik.values.guideName ? {
        id: guideId.current,
        name: formik.values.guideName,
        phoneNumber: formik.values.guidePhoneNumber,
        price: formik.values.guidePrice,
        currency: guideTicketCurr,
        add_edit: getAddEdit(guideId.current, changedGuide, newGuide),
      } : null,

      travelers : tour?.travelers || [],
      hotelExpenses: formik.values.hotelName ? tour?.hotel_expenses : null,
      hotelExpensesCurr : formik.values.hotelName ? tour?.hotel_expenses_curr : 'DA',
      departureExpenses: formik.values.depAirportName || formik.values.depBusName ? tour?.departure_expenses : null,
      departureExpensesCurr : formik.values.depAirportName || formik.values.depBusName ? tour?.departure_expenses_curr : 'DA',
      returnExpenses: formik.values.retAirportName || formik.values.retBusName ? tour?.return_expenses : null,
      returnExpensesCurr :  formik.values.retAirportName || formik.values.retBusName ? tour?.return_expenses_curr : 'DA',
      guideExpenses:  formik.values.guide ? tour?.guide_expenses : null,
      guideExpensesCurr : formik.values.guide ? tour?.guide_expenses_curr : 'DA',
      otherExpenses: tour?.other_expenses,
      otherExpensesCurr : tour?.other_expenses_curr,
    };



    return tourData;

  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <h4 className="form-section-header first">General</h4>

      <div className='inputs-holder' style={{display : "flex", justifyContent: "center", alignItems : "center"}}>
        <AutoCompleteField
          icon={faLocationDot}
          display="Destination*"
          name="destination"
          type="text"
          value={formik.values.destination}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.destination}
          touched={formik.touched.destination}
          onSelect={(place)=>selectLocation(place, true)}
          fetchData={{ fetch: fetchPlacesData, skipRef: skipDestiantionFetch }}
          onBlurSelect={true}
        />
        <CheckBox name={"umrah"} display={"Umrah"} checked={umrah}  onChange={(e) => setUmrah(e.target.checked)}/>
      </div>

      <AddTourTypesHolder
        activeFilters={activeTypes}
        setFilterEvent={(titles, names, ref) => setFilterEvent(setActiveTypes, titles, names, ref)}
      />

      <div className="toor-filter-holder">
        {/* Departure Date */}
        <div className='filter-container selector' style={{ flex: '1' }}>
          <p className='text'>Departure Date</p>
          <FilterDropDown
            onClick={() => toggleDialog(fromRefDialog, true)}
            title="Departure Date"
            active={completeFormatDate(departureDate)}
            setFilterEvent={() => setDepartureDate('any')}
          />
          <dialog ref={fromRefDialog} onClick={(e) => e.currentTarget === e.target && toggleDialog(fromRefDialog, true)}>
            <Calender
              key={fromDialogOpen ? 'open' : 'closed'}
              date={departureDate}
              close={() => toggleDialog(fromRefDialog, true)}
              confirm={confirmFrom}
              maxToday={false}
              withTime={true}
            />
          </dialog>
        </div>

        {/* Return Date */}
        <div className='filter-container selector' style={{ flex: '1' }}>
          <p className="text">Return Date</p>
          <FilterDropDown
            onClick={() => toggleDialog(toRefDialog, false)}
            title="Return Date"
            active={completeFormatDate(returnDate)}
            setFilterEvent={() => setReturnDate('any')}
          />
          <dialog ref={toRefDialog} onClick={(e) => e.currentTarget === e.target && toggleDialog(toRefDialog, false)}>
            <Calender
              key={toDialogOpen ? 'open' : 'closed'}
              date={returnDate}
              close={() => toggleDialog(toRefDialog, false)}
              confirm={confirmTo}
              maxToday={false}
              withTime={true}
            />
          </dialog>
        </div>

        <FilterCard form={true} title="State" active={activeTypes["State"]} items={states}
          setFilterEvent={(titles, names, ref) => setFilterEvent(setActiveTypes, titles, names, ref)} />

      </div>

      {/* Hotel Section */}
      <SectionHeader header="Hotel" changed={changedHotel} checked={newHotel} setChecked={setNewHotel} />
      <div className={`inputs-holder ${hotelExists() ? 'hidden' : ''}`}>
        <AutoCompleteField
          icon={faHotel}
          display="Name"
          name="hotelName"
          type="text"
          value={formik.values.hotelName || ''}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.hotelName}
          touched={formik.touched.hotelName}
          onSelect={selectHotel}
          fetchData={{ fetch: fetchHotelsData, skipRef: skipHotelFetch }}
        />
        <AutoCompleteField
          icon={faLocationDot}
          hidden={hotelExists()}
          display="Location"
          name="hotelLocation"
          type="text"
          value={formik.values.hotelLocation || ''}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.hotelLocation}
          touched={formik.touched.hotelLocation}
          onSelect={(place) => {
            formik.setFieldValue('hotelLocation', place.display_name || '');
            skipHotelLocationFetch.current = true;
          }}
          fetchData={{ fetch: fetchPlacesData, skipRef: skipHotelLocationFetch }}
          onBlurSelect={true}
        />
      </div>
      <div className="inputs-holder">
        <InputElement
          hidden={hotelExists()}
          display="Phone Number"
          name="hotelPhoneNumber"
          type="tel"
          value={formik.values.hotelPhoneNumber || ''}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.hotelPhoneNumber}
          touched={formik.touched.hotelPhoneNumber}
        />
        <PriceInput
          hidden={hotelExists()}
          activeCurr={roomPriceCurr}
          setActiveCurr={(titles, names, ref) => setPriceCurr(names[0], setRoomPriceCurr, ref)}
          display="Room Price"
          name="hotelPrice"
          type="text"
          value={formik.values.hotelPrice || ''}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.errors.hotelPrice}
          touched={formik.touched.hotelPrice}
        />
      </div>

      {/* Conditional: Airports */}
      {activeTypes["Transport"] === "Plane" && (
        <>
          <SectionHeader test="Departure" header="Departure Airport" changed={changeDepAirport} checked={newDepAirport} setChecked={setNewDepAirport} />
          <div className={`inputs-holder ${depAirportExists() ? 'hidden' : ''}`}>
            <AutoCompleteField
              icon={faPlaneDeparture}
              display="Name"
              name="depAirportName"

              type="text"
              value={formik.values.depAirportName || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.depAirportName}
              touched={formik.touched.depAirportName}
              onSelect={selectDepAirport}
              fetchData={{ fetch: fetchAirportsData, skipRef: skipDepAirportFetch }}
            />
            <AutoCompleteField
              icon={faLocationDot}
              hidden={depAirportExists()}
              display="Location"
              name="depAirportLocation"
              type="text"
              value={formik.values.depAirportLocation || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.depAirportLocation}
              touched={formik.touched.depAirportLocation}
              onSelect={(place) => {
                formik.setFieldValue('depAirportLocation', place.display_name || '');
                skipDepAirportLocationFetch.current = true;
              }}
              fetchData={{ fetch: fetchPlacesData, skipRef: skipDepAirportLocationFetch }}
              onBlurSelect={true}
            />
          </div>
          <div className="inputs-holder">
            <InputElement
              hidden={depAirportExists()}
              display="Phone Number"
              name="depAirportPhoneNumber"
              type="tel"
              value={formik.values.depAirportPhoneNumber || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.depAirportPhoneNumber}
              touched={formik.touched.depAirportPhoneNumber}
            />
            <PriceInput
              hidden={depAirportExists()}
              activeCurr={depAirportTicketCurr}
              setActiveCurr={(titles, names, ref) => setPriceCurr(names[0], setDepAirportTicketCurr, ref)}
              display="Ticket Price"
              name="depAirportTicketPrice"
              type="text"
              value={formik.values.depAirportTicketPrice || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.depAirportTicketPrice}
              touched={formik.touched.depAirportTicketPrice}
            />
          </div>

          <SectionHeader header="Return Airport" changed={changeRetAirport} checked={newRetAirport} setChecked={setNewRetAirport} />
          <div className={`inputs-holder ${retAirportExists() ? 'hidden' : ''}`}>
            <AutoCompleteField
              icon={faPlaneDeparture}
              display="Name"
              name="retAirportName"
              type="text"
              value={formik.values.retAirportName || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.retAirportName}
              touched={formik.touched.retAirportName}
              onSelect={selectRetAirport}
              fetchData={{ fetch: fetchAirportsData, skipRef: skipRetAirportFetch }}
            />
            <AutoCompleteField
              icon={faLocationDot}
              hidden={retAirportExists()}
              display="Location"
              name="retAirportLocation"
              type="text"
              value={formik.values.retAirportLocation || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.retAirportLocation}
              touched={formik.touched.retAirportLocation}
              onSelect={(place) => {
                formik.setFieldValue('retAirportLocation', place.display_name || '');
                skipRetAirportLocationFetch.current = true;
              }}
              fetchData={{ fetch: fetchPlacesData, skipRef: skipRetAirportLocationFetch }}
              onBlurSelect={true}
            />
          </div>
          <div className="inputs-holder">
            <InputElement
              hidden={retAirportExists()}
              display="Phone Number"
              name="retAirportPhoneNumber"
              type="tel"
              value={formik.values.retAirportPhoneNumber || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.retAirportPhoneNumber}
              touched={formik.touched.retAirportPhoneNumber}
            />
            <PriceInput
              hidden={retAirportExists()}
              activeCurr={retAirportTicketCurr}
              setActiveCurr={(titles, names, ref) => setPriceCurr(names[0], setRetAirportTicketCurr, ref)}
              display="Ticket Price"
              name="retAirportTicketPrice"
              type="text"
              value={formik.values.retAirportTicketPrice || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.retAirportTicketPrice}
              touched={formik.touched.retAirportTicketPrice}
            />
          </div>
        </>
      )}

      {/* Conditional: Buses */}
      {activeTypes["Transport"] === "Bus" && (
        <>
          <SectionHeader header="Departure Bus" changed={changeDepBus} checked={newDepBus} setChecked={setNewDepBus} />
          <div className={`inputs-holder ${depBusExists() ? 'hidden' : ''}`}>
            <AutoCompleteField
              icon={faBus}
              display="Name"
              name="depBusName"
              type="text"
              value={formik.values.depBusName || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.depBusName}
              touched={formik.touched.depBusName}
              onSelect={selectDepBus}
              fetchData={{ fetch: fetchBusesData, skipRef: skipDepBusFetch }}
            />
            <InputElement
              hidden={depBusExists()}
              display="Phone Number"
              name="depBusPhoneNumber"
              type="tel"
              value={formik.values.depBusPhoneNumber || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.depBusPhoneNumber}
              touched={formik.touched.depBusPhoneNumber}
            />
            <PriceInput
              hidden={depBusExists()}
              activeCurr={depBusTicketCurr}
              setActiveCurr={(titles, names, ref) => setPriceCurr(names[0], setDepBusTicketCurr, ref)}
              display="Ticket Price"
              name="depBusTicketPrice"
              type="text"
              value={formik.values.depBusTicketPrice || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.depBusTicketPrice}
              touched={formik.touched.depBusTicketPrice}
            />
          </div>

          <SectionHeader header="Return Bus" changed={changeReturnBus} checked={newReturnBus} setChecked={setNewReturnBus} />
          <div className={`inputs-holder ${retBusExists() ? 'hidden' : ''}`}>
            <AutoCompleteField
              icon={faBus}
              display="Name"
              name="retBusName"
              type="text"
              value={formik.values.retBusName || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.retBusName}
              touched={formik.touched.retBusName}
              onSelect={selectRetBus}
              fetchData={{ fetch: fetchBusesData, skipRef: skipRetBusFetch }}
            />
            <InputElement
              hidden={retBusExists()}
              display="Phone Number"
              name="retBusPhoneNumber"
              type="tel"
              value={formik.values.retBusPhoneNumber || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.retBusPhoneNumber}
              touched={formik.touched.retBusPhoneNumber}
            />
            <PriceInput
              hidden={retBusExists()}
              activeCurr={retBusTicketCurr}
              setActiveCurr={(titles, names, ref) => setPriceCurr(names[0], setRetBusTicketCurr, ref)}
              display="Ticket Price"
              name="retBusTicketPrice"
              type="text"
              value={formik.values.retBusTicketPrice || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.retBusTicketPrice}
              touched={formik.touched.retBusTicketPrice}
            />
          </div>

        </>
      )}

      {
        activeTypes["Type"] == "Group" && (<>
          <SectionHeader header="Toursit Guide" changed={changedGuide} checked={newGuide} setChecked={setNewGuide} />
          <div className={`inputs-holder ${guideExists() ? 'hidden' : ''}`}>
            <AutoCompleteField
              icon={faPersonHiking} // You'll need to import faUser from @fortawesome/free-solid-svg-icons
              display="Name"
              name="guideName"
              type="text"
              value={formik.values.guideName || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.guideName}
              touched={formik.touched.guideName}
              onSelect={selectGuide}
              fetchData={{ fetch: fetchGuidesData, skipRef: skipGuideFetch }}
            />
            <InputElement
              hidden={guideExists()}
              display="Phone Number"
              name="guidePhoneNumber"
              type="tel"
              value={formik.values.guidePhoneNumber || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.guidePhoneNumber}
              touched={formik.touched.guidePhoneNumber}
            />

            <PriceInput
              hidden={guideExists()}
              activeCurr={guideTicketCurr}
              setActiveCurr={(titles, names, ref) => setPriceCurr(names[0], setGuideTicketCurr, ref)}
              display="Price By Day"
              name="guidePrice"
              type="text"
              value={formik.values.guidePrice || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.guidePrice}
              touched={formik.touched.guidePrice}
            />

          </div>
        </>)
      }

      
      <SectionHeader header="Note" changed={false} checked={"Add"} setChecked={false} />
          <div className={`inputs-holder`}>
            <InputElement
              name="note"
              value={formik.values.note || ''}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.note}
              touched={formik.touched.note}
            />
          </div>
          <div className="toor-filter-holder range">
          <CheckBox name={"canceled_expenses"} display={"Count Canceled Expenses"} checked={expenses} 
          onChange={(e) => setExpenses(e.target.checked)}
          />
         <CheckBox name={"canceled_revenue"} display={"Count Canceled Revenue"} checked={revenue} 
          onChange={(e) => setRevenue(e.target.checked)}
          />
        </div>

      <div style={{
        marginTop: "0px", marginBottom: "17px",
        display: "flex", width: "100%", height: "50px", justifyContent: "end", alignItems: "center"
      }}>

        <ConfirmButton type="submit" name='Next' extra={`add-tour`} />
      </div>
    </form>
  );

};