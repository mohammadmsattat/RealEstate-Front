import React, { useState } from "react";

const mockOffer = {
  title: "Luxury Villa with Sea View",
  price: 1200000,
  currency: "USD",
  totalSpace: 450,
  bedrooms: 5,
  bathrooms: 4,
  city: "Nice",
  neighborhood: "Côte d'Azur",
  description:
    "A stunning modern villa with panoramic sea views, infinity pool, and landscaped gardens. Fully furnished with state-of-the-art amenities.",
  images: [
    { url: "https://placeimg.com/640/480/arch" },
    { url: "https://placeimg.com/640/480/nature" },
    { url: "https://placeimg.com/640/480/tech" },
  ],
  videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  virtualTourUrl: "https://www.example.com/virtual-tour",
};

const PropertyModal = ({ offer = mockOffer, onClose }) => {
  const [currentMedia, setCurrentMedia] = useState("image"); // "image" | "video" | "virtual"
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () =>
    setCurrentIndex((prev) => (prev + 1) % offer.images.length);
  const prevImage = () =>
    setCurrentIndex((prev) => (prev - 1 + offer.images.length) % offer.images.length);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[80vw] max-w-[1000px] h-[80vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-modal"
      >
        {/* Media Selector */}
        <div className="flex justify-around p-3 bg-gray-100 border-b">
          <button
            className={`px-4 py-2 rounded-full ${
              currentMedia === "image" ? "bg-blue-600 text-white" : "bg-white text-gray-600"
            }`}
            onClick={() => setCurrentMedia("image")}
          >
            Images
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              currentMedia === "video" ? "bg-blue-600 text-white" : "bg-white text-gray-600"
            }`}
            onClick={() => setCurrentMedia("video")}
          >
            Video
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              currentMedia === "virtual" ? "bg-blue-600 text-white" : "bg-white text-gray-600"
            }`}
            onClick={() => setCurrentMedia("virtual")}
          >
            Virtual Tour
          </button>
        </div>

        {/* Media Display */}
        <div className="flex-1 relative bg-gray-200 flex items-center justify-center">
          {currentMedia === "image" && offer.images.length > 0 && (
            <>
              <img
                src={offer.images[currentIndex].url}
                alt={offer.title}
                className="w-full h-full object-cover"
              />
              {/* Navigation */}
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"
              >
                ◀
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60"
              >
                ▶
              </button>
              <div className="absolute bottom-3 right-3 bg-black/50 text-white text-sm px-2 py-1 rounded">
                {currentIndex + 1}/{offer.images.length}
              </div>
            </>
          )}
          {currentMedia === "video" && offer.videoUrl && (
            <iframe
              className="w-full h-full"
              src={offer.videoUrl}
              title="Property Video"
              allowFullScreen
            />
          )}
          {currentMedia === "virtual" && offer.virtualTourUrl && (
            <iframe
              className="w-full h-full"
              src={offer.virtualTourUrl}
              title="Virtual Tour"
              allowFullScreen
            />
          )}
        </div>

        {/* Info Section */}
        <div className="p-6 overflow-y-auto bg-white border-t flex-1">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-3xl font-bold">{offer.title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-red-500 text-2xl">
              ✕
            </button>
          </div>

          <p className="text-2xl text-green-600 font-bold mb-4">
            {offer.price} {offer.currency}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-gray-700 mb-4">
            <p>📐 {offer.totalSpace} m²</p>
            <p>🛏 {offer.bedrooms} Bedrooms</p>
            <p>🛁 {offer.bathrooms} Bathrooms</p>
            <p>🏙 {offer.city}</p>
            <p>📍 {offer.neighborhood}</p>
          </div>

          <p className="text-gray-600">{offer.description}</p>
        </div>
      </div>

      <style>
        {`
          @keyframes modalOpen {
            from { transform: scale(0.75); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-modal { animation: modalOpen 0.35s ease forwards; }
        `}
      </style>
    </div>
  );
};

export default PropertyModal;