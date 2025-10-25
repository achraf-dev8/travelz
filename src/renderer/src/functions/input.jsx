// ✅ Supports all alphabets
const nameRegex = /^[\p{L}\s'.-]+$/u;

// ✅ Restaurant name: must start with a letter, supports letters, spaces, dots, hyphens, apostrophes
const resNameRegex = /^[\p{L}][\p{L}\s'.-]*$/u;

const phoneRegex = /^\+?[0-9\s\-().]{7,20}$/;

// ✅ RFC 5322-like simple email regex (enough for validation)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// ✅ Username: only letters, numbers, underscore, dot, min 5 chars
const usernameRegex = /^[a-zA-Z0-9._]{5,}$/;

export const checkInput = (name, input) => {
  if (input !== '') {
    if (name === 'name') {
      if (input.length < 3) return 'Name is too short';
      if (!nameRegex.test(input)) return 'Enter a valid name';

    } else if (name === 'res name') {
      if (input.length < 3) return 'Name is too short';
      if (!resNameRegex.test(input))
        return 'Enter a valid name';

    } else if (name === 'Address') {
      if (input.length < 3) return 'Address is too short';

    } else if (name === 'Phone Number') {
      if (!phoneRegex.test(input)) return 'Enter a valid phone number';

    } else if (name === 'Email') {
      if (!emailRegex.test(input)) return 'Enter a valid email';

    } else if (name === 'Username') {
      if (!usernameRegex.test(input)) {
        return 'Username must be at least 5 characters and only contain letters, numbers, "_" or "."';
      }
    }
  }
  return null;
};
