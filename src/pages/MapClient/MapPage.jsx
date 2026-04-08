import React, { useState, useEffect } from "react";
import MapView from "./MapView";
import PropertyCard from "./PropertyCard";
import { socketService } from "@/socketService";

const MapPage1 = () => {
  const [offers, setOffers] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    socketService.connect();

    const handleInit = (state) => setOffers(state.offers || []);
    const handleUpdate = (state) => setOffers(state.offers || []);

    socketService.onInit(handleInit);
    socketService.onStateUpdated(handleUpdate);

    return () => socketService.disconnect();
  }, []);
console.log(offers);
console.log(offers);

  return (
    <div className="flex w-full h-screen">
      <MapView
        offers={offers}
        selectedOffer={selectedOffer} // ⚠️ تمرير للمتحكم
        setSelectedOffer={(offer) => {
          setSelectedOffer(offer);
          setShowModal(false);
          setTimeout(() => setShowModal(true), 1200); // فتح المودال بعد حركة الخريطة
        }}
      />

      {showModal && selectedOffer && (
        <PropertyCard
          offer={selectedOffer}
          onClose={() => {
            setShowModal(false);
            setSelectedOffer(null);
          }}
        />
      )}
    </div>
  );
};

export default MapPage1;
