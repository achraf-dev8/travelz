import * as yup from "yup";

// --- Shared field validators ---

const optionalName = yup
  .string()
  .trim()
  .test(
    "name-format",
    "Must be at least 3 characters and max 50",
    (val) => !val || (val.length >= 3 && val.length <= 50)
  );

const optionalLocation = yup
  .string()
  .trim()
  .test(
    "location-format",
    "Location must be at least 3 characters",
    function (val) {
      const nameKey = this.path.replace("Location", "Name");
      const nameValue = this.parent[nameKey];
      return !nameValue || !val || val.length >= 3;
    }
  )
  .nullable()
  .notRequired();

const optionalPhone = yup
  .string()
  .trim()
  .test(
    "phone-format",
    "Invalid phone number",
    function (val) {
      const nameKey = this.path.replace("PhoneNumber", "Name");
      const nameValue = this.parent[nameKey];
      if (!nameValue) return true;
      if (!val) return true;
      return /^(\+?\d{1,4}[\s-]?)?(\(?\d{2,5}\)?[\s-]?)?[\d\s-]{5,15}$/.test(val);
    }
  )
  .nullable()
  .notRequired();

// --- Base schema (global stuff) ---
const nameRegex = /^[\p{L}'\- ]+$/u;

export const baseSchemaFields = {
  phoneNumber: optionalPhone,
  age : yup.number().integer('Enter a valid age'),
  roomPrice : yup.string().nullable(),
  depTickerPrice : yup.string().nullable(),
  retTicketPrice : yup.string().nullable(),
  price: yup.string().nullable(),
  hotelName: optionalName,
  hotelPhoneNumber: optionalPhone,
  hotelLocation: optionalLocation,
  hotelPrice: yup.string().nullable(),
  firstName: yup
  .string()
  .min(3, 'Name must be at least 3 characters')
  .matches(nameRegex, 'Enter a valid name'),

  lastName: yup
  .string()
  .min(3, 'Name must be at least 3 characters')
  .matches(nameRegex, 'Enter a valid name'),

  email: yup.string().email("Invalid email").nullable(),

  destination: optionalLocation.required("Destination is required"),
};


export const travelerSchema = yup.object({
  phoneNumber: optionalPhone,
  age : yup.number().integer('Enter a valid age'),
  roomPrice : yup.string().nullable(),
  depTickerPrice : yup.string().nullable(),
  retTicketPrice : yup.string().nullable(),
  price: yup.string().nullable(),
  hotelExpenses: yup.string().nullable(),
  departureExpenses: yup.string().nullable(),
  returnExpenses: yup.string().nullable(),
  otherExpenses: yup.string().nullable(),
  guideExpenses: yup.string().nullable(),
  firstName: yup
    .string()
    .min(3, 'Name must be at least 3 characters')
    .matches(nameRegex, 'Enter a valid name'),
  lastName: yup
    .string()
    .min(3, 'Name must be at least 3 characters')
    .matches(nameRegex, 'Enter a valid name'),
});
// --- Bus fields only ---

const busFields = {
  depBusName: optionalName,
  depBusPhoneNumber: optionalPhone,
  depBusLocation: optionalLocation,
  depBusTicketPrice: yup.string().nullable(),

  retBusName: optionalName,
  retBusPhoneNumber: optionalPhone,
  retBusLocation: optionalLocation,
  retBusTicketPrice: yup.string().nullable(),
};

// --- Airport fields only ---

const airportFields = {
  depAirportName: optionalName,
  depAirportPhoneNumber: optionalPhone,
  depAirportLocation: optionalLocation,
  depAirportTicketPrice: yup.string().nullable(),

  retAirportName: optionalName,
  retAirportPhoneNumber: optionalPhone,
  retAirportLocation: optionalLocation,
  retAirportTicketPrice: yup.string().nullable(),
};

// --- Final combined schemas ---

export const baseSchema = yup.object().shape(baseSchemaFields);

export const busSchema = yup.object().shape({
  ...baseSchemaFields,
  ...busFields,
});

export const airportSchema = yup.object().shape({
  ...baseSchemaFields,
  ...airportFields,
});

export const schema = yup.object().shape({
  ...baseSchemaFields,
  ...airportFields,
  ...busFields,
});

export const hotelSchema = yup.object().shape({
  name : optionalName,
  phoneNumber: optionalPhone,
  location: optionalLocation,
  roomPrice : yup.string().nullable(),
});

export const allAirportSchema = yup.object().shape({
  name : optionalName,
  phoneNumber: optionalPhone,
  location: optionalLocation,
  ticketPrice : yup.string().nullable(),
});

export const allBusSchema = yup.object().shape({
  name : optionalName,
  phoneNumber: optionalPhone,
  ticketPrice : yup.string().nullable(),
});

export const guideSchema = yup.object().shape({
  name : optionalName,
  phoneNumber: optionalPhone,
  pricePerDay : yup.string().nullable(),
});

export const passwordSchema = yup.object().shape({
  newPassword: yup
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Password must contain at least one letter and one number"
    )
    .required("New password is required"),

  confirmPassword: yup
    .string()
    .trim()
    .oneOf([yup.ref("newPassword")], "Passwords do not match")
    .required("Please confirm your new password"),
});

export const userSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters")
    .matches(/^[\p{L}'\- ]+$/u, "Enter a valid name")
    .required("Name is required"),

  username: yup
    .string()
    .trim()
    .min(4, "Username must be at least 4 characters")
    .max(30, "Username must be less than 30 characters")
    .matches(
      /^[a-zA-Z0-9_.-]+$/,
      "Username can contain letters, numbers, underscores, and dots only"
    )
    .required("Username is required"),

  email: yup
    .string()
    .trim()
    .email("Invalid email address")
    .required("Email is required"),

  phoneNumber: optionalPhone, // ✅ reused shared phone validator

  password: yup
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d).+$/,
      "Password must contain at least one letter and one number"
    )
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .trim()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
});

