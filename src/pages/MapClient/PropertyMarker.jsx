// PropertyMarker.js
import { Marker, Tooltip } from "react-leaflet";
import { useMap } from "react-leaflet";

const PropertyMarker = ({ offer, setSelectedOffer }) => {
  const map = useMap();
console.log(offer.location);

  // تحقق من وجود الموقع
  if (
    !offer.location ||
    offer.location.lat == null ||
    offer.location.lng == null
  )
    return null;

  const { lat, lng } = offer.location;

  const handleClick = () => {
    map.flyTo([lat, lng], 16, { duration: 2.5 });
    setSelectedOffer(offer);
  };

  return (
    <Marker position={[lat, lng]} eventHandlers={{ click: handleClick }}>
      {/* Tooltip لعرض السعر فوق Marker */}
      {offer.price && (
        <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent>
          <span className="bg-white px-2 py-1 rounded shadow text-sm font-bold">
            {offer.price} {offer.currency}
          </span>
        </Tooltip>
      )}
    </Marker>
  );
};

export default PropertyMarker;