import { useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet.heat";

const HeatmapLayer = ({ offers }) => {

  const map = useMap();

  useEffect(() => {

    if (!offers.length) return;

    const points = offers.map(o => [
      o.location.lat,
      o.location.lng,
      o.price / o.area
    ]);

    const heat = window.L.heatLayer(points, {
      radius: 25,
      blur: 15
    }).addTo(map);

    return () => {
      map.removeLayer(heat);
    };

  }, [offers, map]);

  return null;
};

export default HeatmapLayer;