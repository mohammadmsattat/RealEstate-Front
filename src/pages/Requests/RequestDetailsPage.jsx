import React from "react";
import { useParams } from "react-router-dom";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { useGetRequestByIdQuery } from "@/store/api/Requests/RequestApi";
import { useTranslation } from "react-i18next";

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition">
    <div className="text-gray-600 text-lg">
      <Icon icon={icon} />
    </div>
    <div className="text-sm">
      <div className="text-gray-500">{label}</div>
      <div className="font-semibold text-gray-800">
        {value !== undefined && value !== "" ? value : "-"}
      </div>
    </div>
  </div>
);

const RequestDetailsPage = () => {
  const { t } = useTranslation();

  const { id } = useParams();
  const { data, isLoading } = useGetRequestByIdQuery(id);

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
      </div>
    );

  const request = data?.data;
  if (!request) return <div className="p-6">{t("common.noData")}</div>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-2xl shadow flex flex-col md:flex-row justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {t("requestsPage.requestNumber")} :{request.requestNumber}
          </h1>

          <div className="flex items-center gap-2 text-gray-500 mt-2">
            <Icon icon="heroicons-outline:location-marker" />
            {request.requirements?.city} - {request.requirements?.neighborhood}
          </div>
        </div>

        <div className="text-sm text-gray-500 mt-4 md:mt-0">
          {request.requirements?.processType}
        </div>
      </div>

      {/* CUSTOMER */}
      <Card title={t("requestsPage.customerSection") || "Customer Information"}>
        <div className="grid md:grid-cols-3 gap-3">
          <InfoItem
            icon="heroicons-outline:user"
            label={t("requestsPage.customerName")}
            value={request.customer?.name}
          />
          <InfoItem
            icon="heroicons-outline:phone"
            label={t("requestsPage.phone")}
            value={request.customer?.phone}
          />
          <InfoItem
            icon="heroicons-outline:mail"
            label={t("requestsPage.email")}
            value={request.customer?.email}
          />
        </div>
      </Card>

      {/* REQUIREMENTS */}
      <Card
        title={t("requestsPage.requirementsSection") || "Property Requirements"}
      >
        <div className="grid md:grid-cols-3 gap-3">
          <InfoItem
            icon="heroicons-outline:home"
            label={t("requestsPage.propertyType")}
            value={request.requirements?.estateTypes?.join(", ")}
          />
          <InfoItem
            icon="heroicons-outline:switch-horizontal"
            label={t("requestsPage.operationType")}
            value={request.requirements?.processType}
          />
          <InfoItem
            icon="heroicons-outline:map"
            label={t("requestsPage.city")}
            value={request.requirements?.city}
          />
          <InfoItem
            icon="heroicons-outline:location-marker"
            label={t("requestsPage.neighborhood")}
            value={request.requirements?.neighborhood}
          />
          <InfoItem
            icon="heroicons-outline:layers"
            label={
              t("requestsPage.minRooms") + " - " + t("requestsPage.maxRooms")
            }
            value={
              request.requirements?.minRooms || request.requirements?.maxRooms
                ? `${request.requirements?.minRooms || 0} - ${
                    request.requirements?.maxRooms || 0
                  }`
                : "-"
            }
          />
          <InfoItem
            icon="heroicons-outline:arrows-expand"
            label={
              t("requestsPage.minSpace") + " - " + t("requestsPage.maxSpace")
            }
            value={
              request.requirements?.minSpace || request.requirements?.maxSpace
                ? `${request.requirements?.minSpace || 0} - ${
                    request.requirements?.maxSpace || 0
                  } m²`
                : "-"
            }
          />
        </div>
      </Card>

      {/* BUDGET */}
      <Card title={t("requestsPage.financial") || "Budget"}>
        <div className="grid md:grid-cols-2 gap-3">
          <InfoItem
            icon="heroicons-outline:currency-dollar"
            label="USD"
            value={
              request.requirements?.price?.minUSD ||
              request.requirements?.price?.maxUSD
                ? `${request.requirements?.price?.minUSD || 0} - ${
                    request.requirements?.price?.maxUSD || 0
                  }`
                : "-"
            }
          />
          <InfoItem
            icon="heroicons-outline:cash"
            label="SYP"
            value={
              request.requirements?.price?.minSYP ||
              request.requirements?.price?.maxSYP
                ? `${request.requirements?.price?.minSYP || 0} - ${
                    request.requirements?.price?.maxSYP || 0
                  }`
                : "-"
            }
          />
        </div>
      </Card>

      {/* META */}
      <Card title={t("requestsPage.metadata") || "Metadata"}>
        <div className="grid md:grid-cols-3 gap-3">
          <InfoItem
            icon="heroicons-outline:calendar"
            label={t("requestsPage.createdAt")}
            value={new Date(request.createdAt).toLocaleDateString()}
          />
          <InfoItem
            icon="heroicons-outline:refresh"
            label={t("requestsPage.lastModified")}
            value={
              request.lastmodifiedDate
                ? new Date(request.lastmodifiedDate).toLocaleDateString()
                : "-"
            }
          />
          <InfoItem
            icon="heroicons-outline:chart-bar"
            label={t("requestsPage.contacts") || "Contacts"}
            value={request.stats?.timesContacted}
          />
        </div>
      </Card>
    </div>
  );
};

export default RequestDetailsPage;
