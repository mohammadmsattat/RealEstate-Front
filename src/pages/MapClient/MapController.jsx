import { useEffect } from "react";
import { useMap } from "react-leaflet";

const MapController = ({ offers, selectedOffer }) => {
  const map = useMap();

  useEffect(() => {
    if (!offers.length || selectedOffer) return; // ⚠️ لا تعدل zoom عند اختيار عرض

    const validCoords = offers
      .filter((o) => o.location?.coordinates)
      .map((o) => [
        o.location.coordinates[1], // lat
        o.location.coordinates[0], // lng
      ]);

    if (!validCoords.length) return;

    if (validCoords.length === 1) {
      map.setView(validCoords[0], 15, { animate: true });
    } else {
      map.fitBounds(validCoords, {
        padding: [50, 50],
        animate: true,
      });
    }
  }, [offers, map, selectedOffer]);

  return null;
};

export default MapController;
