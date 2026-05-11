import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import RequestsForm from "./RequestsForm";
import { useEditRequest } from "@/hooks/Requests/useEditRequest";
import { useTranslation } from "react-i18next";

export default function EditRequestPage() {
  const { t } = useTranslation();

  const {
    formData,
    handleChange,
    handleSubmit,
    errors,

    isLoading,
    isMapOpen,
    openMapModal,
    closeMapModal,
  } = useEditRequest();

  return (
    <div className="grid grid-cols-1">
      <Card
        title={t("requestsPage.editTitle")}
        headerSlot={
          <Button
            text={t("requestsPage.update")}
            className="btn-dark w-full"
            onClick={handleSubmit}
            disabled={isLoading}
            isLoading={isLoading}
          />
        }
      >
        <RequestsForm
          t={t}
          formData={formData}
          handleChange={handleChange}
          isMapOpen={isMapOpen}
          onOpenMap={openMapModal}
          onCloseMap={closeMapModal}
          errors={errors}
        />
      </Card>
    </div>
  );
}
