// This file contains the client-side destination data types and utilities
export interface Destination {
  id: string;
  name: string;
  state: string;
  category: 'nature' | 'historical' | 'spiritual' | 'adventure' | 'cultural';
  description: string;
  imageUrl?: string;
  bestTimeToVisit?: string;
  localFood?: string[];
  travelTips?: string;
}

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh', 
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Jammu and Kashmir',
  'Ladakh'
];

export const MAJOR_CITIES = [
  'Delhi',
  'Mumbai',
  'Bangalore',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Kanpur',
  'Nagpur',
  'Indore',
  'Bhopal',
  'Visakhapatnam',
  'Patna',
  'Vadodara',
  'Ludhiana',
  'Agra',
  'Nashik'
];

export function isIndianLocation(location: string): boolean {
  const normalizedLocation = location.toLowerCase().trim();
  
  return INDIAN_STATES.some(state => 
    state.toLowerCase().includes(normalizedLocation) ||
    normalizedLocation.includes(state.toLowerCase())
  ) || MAJOR_CITIES.some(city =>
    city.toLowerCase().includes(normalizedLocation) ||
    normalizedLocation.includes(city.toLowerCase())
  );
}

export function getCategoryIcon(category: string): string {
  switch (category) {
    case 'historical': return '🏛️';
    case 'nature': return '🌿';
    case 'spiritual': return '🕉️';
    case 'cultural': return '🎭';
    case 'adventure': return '⛰️';
    default: return '📍';
  }
}
