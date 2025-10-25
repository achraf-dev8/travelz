const sampleStates = ["Waiting", "Active", "Ended", "Canceled"];
const sampleTypes = ["Individual", "Group"];
const sampleLocations = ["International", "Local", "Desert", "Mountain"];
const sampleDestinations = ["Istanbul", "Cairo", "Mecca", "Paris", "Tunis", "Algiers"];
const sampleFirstNames = ["Laifa", "Sara", "Omar", "Khadija", "Youssef", "Lina"];
const sampleLastNames = ["Achraf", "Eddine", "Benali", "Zahra", "Haddad", "Rahma"];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomDate = (start, end) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const generateTravelers = () => {
  const count = Math.floor(Math.random() * 3) + 1; // 1–3 travelers
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    first_name: randomFrom(sampleFirstNames),
    last_name: randomFrom(sampleLastNames),
  }));
};

const generateTours = () => {
  return Array.from({ length: 50 }, (_, i) => {
    const departureDate = randomDate(new Date("2025-07-01"), new Date("2025-08-01"));
    const returnDate = new Date(departureDate);
    returnDate.setDate(departureDate.getDate() + Math.floor(Math.random() * 15) + 3);

    return {
      id: i + 1,
      tour_id: i + 1,
      agency_id: 1,
      user: `user_${i + 1}`,
      departure_date: departureDate.toISOString(),
      return_date: returnDate.toISOString(),
      state: randomFrom(sampleStates),
      location: randomFrom(sampleLocations),
      departure_airport: 0,
      return_airport: 0,
      departure_bus: null,
      return_bus: null,
      hotel: 1,
      tickets_price: Math.floor(Math.random() * 100) + 50,
      hotel_price: Math.floor(Math.random() * 200) + 100,
      other_expenses: Math.floor(Math.random() * 50),
      price: Math.floor(Math.random() * 2000) + 500,
      type: randomFrom(sampleTypes),
      umrah: Math.random() < 0.3 ? 1 : 0,
      guide: null,
      note: "",
      currency: "DA",
      destination: randomFrom(sampleDestinations),
      travelers: generateTravelers()
    };
  });
};

// Usage
export const TestTours = generateTours();
