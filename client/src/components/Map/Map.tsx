import { GoogleMap, Marker } from '@react-google-maps/api';


interface SelectedPlace {
  id: number;
  name: string;
  lat: number,
  lng: number
}


export default function MapSection({
  mapCenter,
  places,
}: {
  mapCenter: { lat: number; lng: number };
  places: SelectedPlace[];
}) {
  return (
    <GoogleMap
      center={mapCenter}
      zoom={6}
      mapContainerStyle={{ width: '100%', height: '500px' }}
    >
      {places.map((place) => (
        <Marker
          key={place.id}
          position={{ lat: place.lat, lng: place.lng }}
          title={place.name}
        />
      ))}
    </GoogleMap>
  );
}
