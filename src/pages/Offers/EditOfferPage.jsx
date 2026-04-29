import React from "react";
import Card from "@/components/ui/Card";
import { useEditOffer } from "@/hooks/Offers/useEditOffer";
import OfferForm from "./OffersForm";
import Button from "@/components/ui/Button";

export default function EditOfferPage() {
  const {
    t,
    formData,
    features,
    files,
    isLoading,
     isSuccess,
    isUpdating,
    handleChange,
    handleFeature,
    setFiles,
    setLatLng,
    handleSubmit,
    isMapOpen,
    setIsMapOpen,
    openMapModal,
    closeMapModal,
  } = useEditOffer();

  if (isLoading)
    return (
      <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
          <span className="text-sm text-gray-600">{t("common.loading")}</span>
        </div>
      </div>
    );

  return (
    <div className="grid grid-cols-1">
      <Card
        title="Edit Offer"
        headerSlot={
          <Button
            text={t("addOfferPage.actions.save")}
            className="btn-dark w-full"
            onClick={handleSubmit}
            isLoading={isUpdating || isSuccess}
            disabled={isUpdating || isSuccess}
          />
        }
      >
        <OfferForm
          formData={formData}
          features={features}
          files={files}
          handleChange={handleChange}
          handleFeature={handleFeature}
          setFiles={setFiles}
          setLatLng={setLatLng}
          handleSubmit={handleSubmit}
          isMapOpen={isMapOpen}
          onOpenMap={openMapModal}
          onCloseMap={closeMapModal}
        />
      </Card>
    </div>
  );
}
