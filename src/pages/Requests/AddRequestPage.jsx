import React from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import RequestsForm from "./RequestsForm";
import { useAddRequest } from "@/hooks/Requests/useAddRequest";
import { useTranslation } from "react-i18next";

export default function AddRequestPage() {
  const { t } = useTranslation();

  const {
    formData,
    handleChange,
    handleSubmit,
    isLoading,
    errors,
    isMapOpen,
    openMapModal,
    closeMapModal,
  } = useAddRequest();

  return (
    <div className="grid grid-cols-1">
      <Card
        title={t("requestsPage.addRequestTitle")}
        headerSlot={
          <Button
            text={t("requestsPage.save")}
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