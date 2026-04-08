import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Card from "@/components/ui/Card";
import { useGetOfferByIdQuery } from "@/store/api/Offers/OffersApi";
import { useTranslation } from "react-i18next";

const OfferDetailsPage = () => {
    const {t}= useTranslation()
  const { id } = useParams();
  const { data, isLoading } = useGetOfferByIdQuery(id);

  const [currentIndex, setCurrentIndex] = useState(0);

  if (isLoading) return <div>Loading...</div>;

  const offer = data?.data;
  if (!offer) return <div>No Data Found</div>;

  // جمع كل الميديا
  const media = [
    offer.mainImage,
    ...(offer.images || []),
    ...(offer.videoFiles || []),
  ].filter(Boolean);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % media.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? media.length - 1 : prev - 1
    );
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      
      {/* ================= SLIDER ================= */}
      <div className="bg-white rounded-2xl shadow p-4">
        <div className="relative">
          {media[currentIndex]?.includes(".mp4") ? (
            <video
              src={media[currentIndex]}
              controls
              className="w-full h-[400px] object-cover rounded-xl"
            />
          ) : (
            <img
              src={media[currentIndex]}
              className="w-full h-[400px] object-cover rounded-xl"
            />
          )}

          {/* Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded"
          >
            ◀
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 text-white px-3 py-1 rounded"
          >
            ▶
          </button>
        </div>

        {/* Thumbnails */}
        <div className="flex gap-2 mt-3 overflow-x-auto">
          {media.map((item, index) => (
            <div
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`cursor-pointer border rounded-lg overflow-hidden ${
                index === currentIndex ? "border-blue-500" : ""
              }`}
            >
              {item.includes(".mp4") ? (
                <video src={item} className="w-20 h-16 object-cover" />
              ) : (
                <img src={item} className="w-20 h-16 object-cover" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ================= MAIN INFO ================= */}
      <div className="bg-white rounded-2xl shadow p-6 space-y-3">
        <h1 className="text-2xl font-bold">{offer.title}</h1>

        <div className="text-xl font-semibold text-blue-600">
          {offer.price} {offer.currency}
        </div>

        <div className="flex gap-2 flex-wrap">
          {offer.isFeatured && (
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
              Featured
            </span>
          )}
          {offer.isUrgent && (
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm">
              Urgent
            </span>
          )}
          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
            {offer.processType}
          </span>
          <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">
            {offer.estateType}
          </span>
        </div>

        <div className="text-gray-600">
          📍 {offer.city} - {offer.neighborhood}
        </div>
      </div>

      {/* ================= QUICK STATS ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Bedrooms", value: offer.bedrooms },
          { label: "Bathrooms", value: offer.bathrooms },
          { label: "Space", value: offer.totalSpace },
          { label: "Rooms", value: offer.totalRooms },
        ].map((item, i) => (
          <Card key={i}>
            <div className="text-center">
              <div className="text-xl font-bold">{item.value}</div>
              <div className="text-gray-500 text-sm">{item.label}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* ================= DESCRIPTION ================= */}
      <Card title="Description">
        <p className="text-gray-600">
          {offer.description || "No description available"}
        </p>
      </Card>

      {/* ================= DETAILS ================= */}
      <Card title="Property Details">
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div>Code: {offer.code}</div>
          <div>Status: {offer.status}</div>
          <div>Floor: {offer.floorNumber || "-"}</div>
          <div>Total Floors: {offer.totalFloors || "-"}</div>
          <div>Price/m²: {offer.pricePerMeter || "-"}</div>
          <div>Year Built: {offer.yearBuilt || "-"}</div>
        </div>
      </Card>

      {/* ================= FEATURES ================= */}
      <Card title="Features">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          {Object.entries(offer.features || {}).map(([key, value]) =>
            value ? (
              <div
                key={key}
                className="bg-green-50 px-2 py-1 rounded text-green-700"
              >
                ✔ {key}
              </div>
            ) : null
          )}
        </div>
      </Card>

      {/* ================= CONTACT ================= */}
      <Card title="Contact Info">
        <div className="space-y-2 text-sm">
          <div>👤 {offer.agentName}</div>
          <div>📞 {offer.agentPhone}</div>
          <div>✉️ {offer.agentEmail}</div>
        </div>
      </Card>
    </div>
  );
};

export default OfferDetailsPage;