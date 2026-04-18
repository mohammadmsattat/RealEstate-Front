import React, { useState } from "react";

const PropertyModal = ({ offer, onClose }) => {
  if (!offer) return null;
console.log(offer);

  const gallery = [
    ...(offer.mainImage
      ? [{ type: "image", src: offer.mainImage }]
      : []),

    ...(Array.isArray(offer.images)
      ? offer.images.map((img) => ({ type: "image", src: img }))
      : []),

    ...(Array.isArray(offer.videoFiles)
      ? offer.videoFiles.map((vid) => ({ type: "video", src: vid }))
      : []),
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const current = gallery[currentIndex];

  const next = () => setCurrentIndex((p) => (p + 1) % gallery.length);

  const prev = () =>
    setCurrentIndex((p) => (p === 0 ? gallery.length - 1 : p - 1));

  if (!gallery.length) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/60">
        <div className="bg-white p-6 rounded-xl">لا يوجد وسائط</div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[85vw] max-w-[1100px] h-[90vh] bg-white rounded-[.5%] shadow-1xl overflow-hidden flex flex-col"
      >
        {/* ================= MEDIA HERO ================= */}
        <div className="relative bg-black flex-[0.7] h-[75%]">

          {/* MAIN MEDIA */}
          {current.type === "image" && (
            <img
              src={current.src}
              className="w-full h-full object-contain bg-black"
            />
          )}

          {current.type === "video" && (
            <video
              src={current.src}
              controls
              className="w-full h-full object-contain bg-black"
            />
          )}

          {/* NAV */}
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 bg-black/50 text-white p-3 rounded-full"
          >
            ◀
          </button>

          <button
            onClick={next}
            className="absolute right-4 top-1/2 bg-black/50 text-white p-3 rounded-full"
          >
            ▶
          </button>

          {/* COUNTER */}
          <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {currentIndex + 1} / {gallery.length}
          </div>

          {/* THUMBNAILS */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {gallery.map((item, i) => (
              <div
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-12 h-12 rounded-md cursor-pointer border-2 flex items-center justify-center text-xs text-white ${
                  i === currentIndex
                    ? "border-blue-500"
                    : "border-white/20"
                }`}
              >
                {item.type === "image" ? "IMG" : "VID"}
              </div>
            ))}
          </div>
        </div>

        {/* ================= INFO ================= */}
        <div className="flex-[0.3] p-4 overflow-y-auto bg-white  h-[75%]">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-2xl font-bold">{offer.title}</h2>
              <p className="text-gray-500 text-sm">
                {offer.city} - {offer.neighborhood}
              </p>
            </div>

            <button className="text-gray-500 hover:text-red-500 text-2xl">
              Price : {offer.price}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm mb-4">
            <div className="bg-gray-50 p-2 rounded">
              Rooms : {offer.bedrooms}
            </div>
            <div className="bg-gray-50 p-2 rounded">
              Space : {offer.totalSpace} m²
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;