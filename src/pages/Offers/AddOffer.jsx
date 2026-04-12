import React from "react";
import Card from "@/components/ui/Card";
import { useAddOffer } from "@/hooks/Offers/useAddOffer";
import OfferForm from "./OffersForm";
import Button from "@/components/ui/Button";

export default function AddOfferPage() {
  const {
    t,
    formData,
    features,
    files,
    errors,
    handleChange,
    handleFeature,
    setFiles,
    setLatLng,
    handleSubmit,
    isMapOpen,
    openMapModal,
    closeMapModal,
  } = useAddOffer();

  return (
    <div className="grid grid-cols-1">
      <Card
        title="Add Offer"
        headerSlot={
          <Button
            text={t("addOfferPage.actions.save")}
            className="btn-dark w-full"
            onClick={handleSubmit}
          />
        }
      >
        <OfferForm
          formData={formData}
          features={features}
          files={files}
          errors={errors}
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
