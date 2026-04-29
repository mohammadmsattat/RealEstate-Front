import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { useGetOfferByIdQuery } from "@/store/api/Offers/OffersApi";
import { useTranslation } from "react-i18next";

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition">
    <div className="text-gray-600 text-lg">
      <Icon icon={icon} />
    </div>
    <div className="text-sm">
      <div className="text-gray-500">{label}</div>
      <div className="font-semibold text-gray-800">{value ?? "-"}</div>
    </div>
  </div>
);

const OfferDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useTranslation();
  const { data, isLoading } = useGetOfferByIdQuery(id);
  const [currentIndex, setCurrentIndex] = useState(0);

  console.log(data);

  if (isLoading)
    return (
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
          <span className="text-sm text-gray-600">{t("common.loading")}</span>
        </div>
      </div>
    );

  const offer = data?.data;

  if (!offer) return <div className="p-6">{t("common.noData")}</div>;

  const media = [
    offer.mainImage,
    ...(offer.images || []),
    ...(offer.videoFiles || []),
  ].filter(Boolean);

  if (media.length === 0) media.push("/placeholder.jpg");

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % media.length);

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? media.length - 1 : prev - 1));

  const handleOpenMap = () => {
    if (!offer?.location?.lat || !offer?.location?.lng) return;
    navigate(`/offers/${offer._id}/map`);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{offer.title}</h1>
          <div className="flex items-center gap-2 text-gray-500 mt-1">
            <Icon icon="heroicons-outline:location-marker" />
            {offer.city} - {offer.neighborhood}
          </div>
        </div>

        <button
          onClick={handleOpenMap}
          className="btn-dark flex items-center gap-2 px-4 py-2 rounded-lg"
        >
          <Icon icon="heroicons-outline:map" />
          {t("offersPage.viewOnMap")}
        </button>
      </div>

      {/* HERO */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* MEDIA */}
        <div className="bg-white rounded-2xl shadow p-4">
          <div className="relative">
            {media[currentIndex]?.includes(".mp4") ? (
              <video
                src={media[currentIndex]}
                controls
                className="w-full h-[420px] object-cover rounded-xl"
              />
            ) : (
              <img
                src={media[currentIndex]}
                className="w-full h-[420px] object-cover rounded-xl"
              />
            )}

            {media.length > 1 && (
              <>
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
              </>
            )}
          </div>
        </div>

        {/* PRICE */}
        <div className="bg-white rounded-2xl shadow p-6 space-y-6">
          <div className="text-3xl font-bold text-blue-600">
            {offer.price?.maxUSD || offer.price?.minUSD || "-"} {offer.currency}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <InfoItem
              icon="heroicons-outline:home"
              label="النوع"
              value={offer.estateType}
            />
            <InfoItem
              icon="heroicons-outline:switch-horizontal"
              label="نوع العملية"
              value={offer.processType}
            />
            <InfoItem
              icon="heroicons-outline:credit-card"
              label="الدفع"
              value={offer.paymentType}
            />
            <InfoItem
              icon="heroicons-outline:hashtag"
              label="الكود"
              value={offer.code}
            />
          </div>

          {/* DATES */}
          <div className="grid grid-cols-1 gap-3 pt-2 border-t">
            <InfoItem
              icon="heroicons-outline:calendar"
              label="تاريخ الإنشاء"
              value={
                offer.createdAt
                  ? new Date(offer.createdAt).toLocaleString()
                  : "-"
              }
            />
            <InfoItem
              icon="heroicons-outline:refresh"
              label="آخر تعديل"
              value={
                offer.updatedAt
                  ? new Date(offer.updatedAt).toLocaleString()
                  : "-"
              }
            />
          </div>
        </div>
      </div>

      {/* DESCRIPTION */}
      <Card title={t("offerDetails.description")}>
        <p className="text-gray-600">
          {offer.description || t("common.noDescription")}
        </p>
      </Card>

      {/* DETAILS */}
      <Card title={t("offerDetails.details")}>
        <div className="grid md:grid-cols-3 gap-3">
          <InfoItem
            icon="heroicons-outline:arrows-expand"
            label="المساحة الكلية"
            value={offer.totalSpace}
          />
          <InfoItem
            icon="heroicons-outline:office-building"
            label="المساحة المبنية"
            value={offer.builtArea}
          />
          <InfoItem
            icon="heroicons-outline:map"
            label="مساحة الأرض"
            value={offer.landArea}
          />
          <InfoItem
            icon="heroicons-outline:bed"
            label="الغرف"
            value={offer.rooms}
          />
          <InfoItem
            icon="heroicons-outline:beaker"
            label="الحمامات"
            value={offer.bathrooms}
          />
          <InfoItem
            icon="heroicons-outline:layers"
            label="الطابق"
            value={offer.floorNumber}
          />
          <InfoItem
            icon="heroicons-outline:collection"
            label="إجمالي الطوابق"
            value={offer.totalFloors}
          />
          <InfoItem
            icon="heroicons-outline:calendar"
            label="نوع الملكية"
            value={offer.OwnershipType}
          />
          <InfoItem
            icon="heroicons-outline:calendar"
            label="سنة البناء"
            value={offer.yearBuilt}
          />
          <InfoItem
            icon="heroicons-outline:office-building"
            label="الحالة"
            value={offer.propertyCondition}
          />
          <InfoItem
            icon="heroicons-outline:arrow-right"
            label="الواجهة"
            value={offer.facade}
          />
        </div>
      </Card>

      {/* FINANCIAL */}
      <Card title={t("addOfferPage.tabs.financial")}>
        <div className="grid md:grid-cols-3 gap-3">
          <InfoItem
            icon="heroicons-outline:calculator"
            label="السعر (ل.س)"
            value={`${offer.price?.minSYP || 0} - ${offer.price?.maxSYP || 0}`}
          />
          <InfoItem
            icon="heroicons-outline:currency-dollar"
            label="السعر (USD)"
            value={`${offer.price?.minUSD || 0} - ${offer.price?.maxUSD || 0}`}
          />
          <InfoItem
            icon="heroicons-outline:chart-bar"
            label="سعر المتر"
            value={`${offer.pricePerMeterFrom || 0} - ${
              offer.pricePerMeterTo || 0
            }`}
          />
          <InfoItem
            icon="heroicons-outline:cash"
            label="الدفعة الأولى"
            value={offer.downPayment}
          />
          <InfoItem
            icon="heroicons-outline:calendar"
            label="أشهر التقسيط"
            value={offer.installmentMonths}
          />
        </div>
      </Card>

      {/* CONTACT */}
      <Card title={t("offerDetails.contact")}>
        <div className="grid md:grid-cols-3 gap-3">
          <InfoItem
            icon="heroicons-outline:user"
            label="اسم الوكيل"
            value={offer.agentName}
          />
          <InfoItem
            icon="heroicons-outline:phone"
            label="رقم الهاتف"
            value={offer.agentPhone}
          />
          <InfoItem
            icon="heroicons-outline:user-circle"
            label="اسم المالك"
            value={offer.ownerName}
          />
          <InfoItem
            icon="heroicons-outline:phone"
            label="هاتف المالك"
            value={offer.ownerNumber}
          />
          <InfoItem
            icon="heroicons-outline:link"
            label="الشراكة"
            value={offer.partnership}
          />
        </div>
      </Card>

      {/* LOCATION */}
      <Card title="الموقع">
        <div className="grid md:grid-cols-2 gap-3">
          <InfoItem
            icon="heroicons-outline:location-marker"
            label="المدينة"
            value={offer.city}
          />
          <InfoItem
            icon="heroicons-outline:map"
            label="الحي"
            value={offer.neighborhood}
          />
          <InfoItem
            icon="heroicons-outline:location-marker"
            label="العنوان"
            value={offer.address}
          />
        </div>
      </Card>

      {/* DIRECTIONS */}
      <Card title="الاتجاهات">
        <div className="flex gap-2 flex-wrap">
          {offer.directions?.length
            ? offer.directions.map((d, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-slate-100 rounded-full text-sm"
                >
                  {d}
                </span>
              ))
            : "-"}
        </div>
      </Card>
    </div>
  );
};

export default OfferDetailsPage;
