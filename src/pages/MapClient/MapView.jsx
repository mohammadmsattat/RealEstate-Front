import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import PropertyMarker from "./PropertyMarker";
import MapController from "./MapController";
import "leaflet/dist/leaflet.css";

const MapView = ({ offers, selectedOffer, setSelectedOffer }) => {
  const center = [36.190214039038985, 37.1586465902182];

  return (
    <div className="flex-1">
      <MapContainer
        center={center}
        zoom={12}
        scrollWheelZoom
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" />

        <MapController offers={offers} selectedOffer={selectedOffer} />

        {offers.map((offer) => (
          <PropertyMarker
            key={offer._id}
            offer={offer}
            setSelectedOffer={setSelectedOffer}
          />
        ))}
      </MapContainer>
    </div>
  );
};

export default MapView;