import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import RequestsForm from "./RequestsForm";
import { useEditRequest } from "@/hooks/Requests/useEditRequest";

export default function EditRequestPage() {

  const {
    formData,
    handleChange,
    handleSubmit,
    isLoading,
    isMapOpen,
    openMapModal,
    closeMapModal,
  } = useEditRequest();

  return (
    <div className="grid grid-cols-1">
      <Card
        title="Edit Request"
        headerSlot={
          <Button
            text="Update Request"
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