export function getFullName(traveler) {
  
  return traveler ? `${traveler.first_name} ${traveler.last_name}` : "";
}

export function getAllDocumentsTraveler(traveler) {
  if (!traveler) return null;

  const travelerDocs = traveler.documents || [];
  const visaDocs = (traveler.visas || []).flatMap(visa => visa.documents || []);

  return {
    ...traveler,
    documents: [...travelerDocs, ...visaDocs],
  };
}