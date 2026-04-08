import React from "react";
import Card from "@/components/ui/Card";
import { useEditOffer } from "@/hooks/Offers/useEditOffer";
import OfferForm from "./OffersForm";

export default function EditOfferPage() {
  const {
    formData,
    features,
    files,
    isLoading,
    handleChange,
    handleFeature,
    setFiles,
    setLatLng,
    handleSubmit,
  } = useEditOffer();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1">
      <Card title="Edit Offer">
        <OfferForm
          formData={formData}
          features={features}
          files={files}
          handleChange={handleChange}
          handleFeature={handleFeature}
          setFiles={setFiles}
          setLatLng={setLatLng}
          handleSubmit={handleSubmit}
        />
      </Card>
    </div>
  );
}
