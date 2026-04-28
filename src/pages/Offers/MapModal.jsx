import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import L from "leaflet";
import { useTranslation } from "react-i18next";

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function SearchControl() {
  const map = useMap();
  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: true,
      autoClose: true,
      retainZoomLevel: false,
    });
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, [map]);
  return null;
}

function LocationPicker({ setLatLng, tempLatLng, setTempLatLng }) {
  const map = useMap();

  useEffect(() => {
    const handleClick = (e) => {
      setTempLatLng({ lat: e.latlng.lat, lng: e.latlng.lng });
    };
    map.on("click", handleClick);
    return () => map.off("click", handleClick);
  }, [map, setTempLatLng]);

  return <Marker position={[tempLatLng.lat, tempLatLng.lng]} />;
}

export default function MapModal({ isOpen, onClose, setLatLng, lat, lng }) {
  const { t } = useTranslation();

  const [tempLatLng, setTempLatLng] = useState({
    lat: lat || 33.3152,
    lng: lng || 44.3661,
  });

  const handleConfirm = () => {
    setLatLng(tempLatLng);
    onClose();
  };

  useEffect(() => {
    setTempLatLng({
      lat: lat || 33.3152,
      lng: lng || 44.3661,
    });
  }, [lat, lng, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-5000 flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] w-full max-w-4xl mx-4">

        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            {t("mapModal.title")}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Map */}
        <div className="h-[500px] w-full">
          <MapContainer
            center={[tempLatLng.lat, tempLatLng.lng]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >

            {/* 🔥 Satellite Layer */}
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles © Esri"
            />

            <SearchControl />

            <LocationPicker
              setLatLng={setLatLng}
              tempLatLng={tempLatLng}
              setTempLatLng={setTempLatLng}
            />
          </MapContainer>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            {t("mapModal.cancel")}
          </button>

          <button
            onClick={handleConfirm}
            className="btn-dark px-4 py-2 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {t("mapModal.confirm")}
          </button>
        </div>

      </div>
    </div>
  );
}