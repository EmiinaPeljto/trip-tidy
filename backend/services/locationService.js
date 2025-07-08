const locations = {
  SJJ: { code: "SJJ", name: "Sarajevo", full: "Sarajevo" },
  LON: { code: "LON", name: "London", full: "London" },
  NYC: { code: "NYC", name: "New York", full: "New York" },
  PAR: { code: "PAR", name: "Paris", full: "Paris" },
};

exports.getLocationData = (code) => {
  return locations[code] || null;
};

exports.formatForFlight = (code) => {
  const location = locations[code];
  if (!location) return null;
  return location.code;
};

exports.formatForHotelAndPlace = (code) => {
  const location = locations[code];
  if (!location) return null;
  return location.full;
};

exports.getAllLocations = () => {
  return Object.values(locations).map(loc => ({
    value: loc.code,
    label: `${loc.name} (${loc.code})`,
    city: loc.full
  }));
};
