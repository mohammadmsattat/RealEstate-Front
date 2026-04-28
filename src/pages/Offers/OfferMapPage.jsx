import React from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useGetOfferByIdQuery } from "@/store/api/Offers/OffersApi";

const OfferMapPage = () => {
  const { id } = useParams();
  const { data, isSuccess, error, isLoading } = useGetOfferByIdQuery(id);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-[500px]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid"></div>
        <span className="ml-4 text-lg font-medium text-gray-700">
          Loading offer map...
        </span>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col justify-center items-center h-[500px] text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Failed to load offer
        </h2>
        <p className="text-gray-600">
          There was an error retrieving the offer details. Please try again later.
        </p>
      </div>
    );

  const offer = data?.data;

  if (!offer)
    return (
      <div className="flex flex-col justify-center items-center h-[500px] text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          Offer not found
        </h2>
        <p className="text-gray-600">
          The offer you are looking for does not exist.
        </p>
      </div>
    );

  const position = [
    offer.location?.lat,
    offer.location?.lng,
  ];

  return (
    <div className="w-full h-[500px]">
      <MapContainer
        center={position}
        zoom={16}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        {/* 🛰️ Satellite Layer */}
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution="Tiles © Esri"
        />

        <Marker position={position}>
          <Popup>
            <div>
              <h4 className="font-bold">{offer.title}</h4>
              <p>
                Price: {offer.price?.minUSD ?? offer.price} {offer.currency}
                <br />
                Rooms: {offer.rooms}
                <br />
                Bathrooms: {offer.bathrooms}
              </p>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default OfferMapPage;