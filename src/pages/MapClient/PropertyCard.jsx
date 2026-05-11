import React, { useState, useMemo } from "react";

const PropertyModal = ({ offer, onClose }) => {
  if (!offer) return null;

  const gallery = useMemo(() => {
    return [
      ...(offer.mainImage ? [{ type: "image", src: offer.mainImage }] : []),

      ...(Array.isArray(offer.images)
        ? offer.images.map((img) => ({ type: "image", src: img }))
        : []),

      ...(Array.isArray(offer.videoFiles)
        ? offer.videoFiles.map((vid) => ({ type: "video", src: vid }))
        : []),
    ];
  }, [offer]);

  const hasMedia = gallery.length > 0;

  const [currentIndex, setCurrentIndex] = useState(0);

  const current = hasMedia ? gallery[currentIndex] : null;

  const next = () => {
    if (!hasMedia) return;
    setCurrentIndex((p) => (p + 1) % gallery.length);
  };

  const prev = () => {
    if (!hasMedia) return;
    setCurrentIndex((p) => (p === 0 ? gallery.length - 1 : p - 1));
  };

  const goTo = (i) => setCurrentIndex(i);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[85vw] max-w-[1100px] h-[90vh] bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* ================= MEDIA ================= */}
        <div className="relative bg-black flex-[0.7] h-[75%] flex items-center justify-center">
          {/* حالة عدم وجود وسائط */}
          {!hasMedia && (
            <div className="text-white text-center">
              <div className="text-2xl mb-2">📭</div>
              <div className="text-sm opacity-80">لا توجد صور أو فيديوهات</div>
            </div>
          )}

          {/* عرض الوسائط */}
          {hasMedia && current && (
            <>
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
              {gallery.length > 1 && (
                <>
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
                </>
              )}

              {/* THUMBNAILS */}
              {gallery.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {gallery.map((item, i) => (
                    <div
                      key={i}
                      onClick={() => goTo(i)}
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
              )}
            </>
          )}
        </div>

        {/* ================= INFO ================= */}
        <div className="flex-[0.3] p-4 overflow-y-auto bg-white h-[75%]">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-2xl font-bold">{offer.title}</h2>
              <p className="text-gray-500 text-sm">
                {offer.city} - {offer.neighborhood}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-sm mb-4">
            <div className="bg-gray-50 p-2 rounded">
              Rooms : {offer.bedrooms ?? "-"}
            </div>
            <div className="bg-gray-50 p-2 rounded">
              Space : {offer.totalSpace ?? "-"} m²
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyModal;