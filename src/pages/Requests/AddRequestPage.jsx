import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import RequestsForm from "./RequestsForm";
import { useAddRequest } from "@/hooks/Requests/useAddRequest";

export default function AddRequestPage() {
  const {
    formData,
    handleChange,
    handleSubmit,
    isLoading,

    isMapOpen,
    openMapModal,
    closeMapModal,
  } = useAddRequest();

  return (
    <div className="grid grid-cols-1">
      <Card
        title="Add Request"
        headerSlot={
          <Button
            text="Save Request"
            className="btn-dark w-full"
            onClick={handleSubmit}
            disabled={isLoading}
            isLoading={isLoading}
          />
        }
      >
        <RequestsForm
          formData={formData}
          handleChange={handleChange}
          isMapOpen={isMapOpen}
          onOpenMap={openMapModal}
          onCloseMap={closeMapModal}
        />
      </Card>
    </div>
  );
}
