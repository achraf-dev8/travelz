export function formatApiDateTime(date) {
  if (!date) return null;

  const d = new Date(date);
  if (isNaN(d)) return null;

  const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const year = d.getFullYear();

  const time = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  return `${dayName} ${day}/${month}/${year} ${time}`;
}


export function formatApiDate(date) {
  if(!date ) return null;
  const d = new Date(date);

  if (isNaN(d)) return null;

  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
}


export function normalizeDate(date) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()); // strips time
}

export function formatDate(date) {
    if (date == 'any' || !date) return '';
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }

export function completeFormatDate(date) {
  console.log("date", date);

  if (date === "any" || !date) return "Undefined";

  const d = new Date(date); // <-- convert to Date
  if (isNaN(d)) return "Undefined"; // invalid date handling

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const day = days[d.getDay()];
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const min = String(d.getMinutes()).padStart(2, '0');

  return `${day} ${dd}/${mm}/${yyyy} ${hh}:${min}`;
}