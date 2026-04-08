import React, { useState, useEffect } from "react";
import Card from "@/components/ui/Card";
import Textinput from "@/components/ui/Textinput";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useGetOffersQuery } from "@/store/api/Offers/OffersApi";
import { socketService } from "@/socketService";
import { useTranslation } from "react-i18next";

const OffersControlPage = () => {
  const { t } = useTranslation();

  const [filters, setFilters] = useState({
    search: "",
    processType: "",
    estateType: "",
    city: "",
    neighborhood: "",
    bedrooms: "",
    bathrooms: "",
    minPrice: "",
    maxPrice: "",
    minSpace: "",
    maxSpace: "",
    isFeatured: false,
    isUrgent: false,
  });

  // الحالة المعتمدة لإرسال الفلاتر
  const [appliedFilters, setAppliedFilters] = useState({});

  const normalizedFilters = {
    keyword: appliedFilters.search || undefined,
    processType: appliedFilters.processType || undefined,
    estateType: appliedFilters.estateType || undefined,
    city: appliedFilters.city || undefined,
    neighborhood: appliedFilters.neighborhood || undefined,
    bedrooms: appliedFilters.bedrooms
      ? Number(appliedFilters.bedrooms)
      : undefined,
    bathrooms: appliedFilters.bathrooms
      ? Number(appliedFilters.bathrooms)
      : undefined,
    minPrice: appliedFilters.minPrice
      ? Number(appliedFilters.minPrice)
      : undefined,
    maxPrice: appliedFilters.maxPrice
      ? Number(appliedFilters.maxPrice)
      : undefined,
    minSpace: appliedFilters.minSpace
      ? Number(appliedFilters.minSpace)
      : undefined,
    maxSpace: appliedFilters.maxSpace
      ? Number(appliedFilters.maxSpace)
      : undefined,
    isFeatured: appliedFilters.isFeatured ? true : undefined,
    isUrgent: appliedFilters.isUrgent ? true : undefined,
  };

  const { data, isLoading, refetch } = useGetOffersQuery(normalizedFilters, {
    skip: !Object.keys(appliedFilters).length,
  });

  useEffect(() => {
    socketService.connect();
  }, []);

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  // زر جلب البيانات (الفلاتر)
  const applySearchFilters = () => {
    setAppliedFilters(filters);
    // setTimeout(() => {
    //   refetch();
    // }, 0);
  };

  // زر الخريطة (Socket)
  const applyFilters = () => {
    socketService.emitUpdateState({ filters });
  };

  if (isLoading) return <div>{t("offersControlPage.loading")}</div>;

  return (
    <div className="flex gap-6 h-[90vh]">
      {/* Sidebar Filters */}
      <div className="w-80 flex-shrink-0 overflow-y-auto border-r border-gray-200 p-4 pt-0 space-y-4">
        <Card title={t("offersControlPage.filters")}>
          <div className="space-y-3">
            <details open className="border-b pb-2">
              <summary className="cursor-pointer font-medium text-gray-700">
                {t("offersControlPage.basicFilters")}
              </summary>
              <div className="mt-2 space-y-2">
                <Textinput
                  label={t("offersControlPage.keywordSearch")}
                  value={filters.search}
                  onChange={(e) => handleChange("search", e.target.value)}
                />
                <Select
                  label={t("offersControlPage.processType")}
                  options={[
                    "",
                    "for_sale",
                    "for_rent",
                    "for_lease",
                    "sold",
                    "rented",
                  ]}
                  value={filters.processType}
                  onChange={(value) => handleChange("processType", value)}
                />
                <Select
                  label={t("offersControlPage.estateType")}
                  options={[
                    "",
                    "apartment",
                    "villa",
                    "house",
                    "townhouse",
                    "duplex",
                    "penthouse",
                    "studio",
                    "commercial",
                    "land",
                    "building",
                    "chalet",
                    "farm",
                    "warehouse",
                  ]}
                  value={filters.estateType}
                  onChange={(value) => handleChange("estateType", value)}
                />
              </div>
            </details>
          </div>

          {/* زر الفلترة (جلب البيانات) */}
          <Button
            text={t("offersControlPage.applyFilters")}
            className="btn-primary w-full mt-4"
            onClick={applySearchFilters}
          />
        </Card>
      </div>

      {/* Offers Table */}
      <div className="flex-1 overflow-x-auto">
        <Card
          title={t("offersControlPage.offersList")}
          subtitle={`${data?.data?.length || 0} ${t(
            "offersControlPage.offersFound",
          )}`}
          headerSlot={
            <Button
              text={t("offersControlPage.applyFilters")}
              className="btn-primary w-full"
              onClick={applyFilters}
            />
          }
        >
          <table className="min-w-full divide-y divide-slate-100">
            <thead>
              <tr>
                <th className="table-th">{t("offersControlPage.code")}</th>
                <th className="table-th">{t("offersControlPage.type")}</th>
                <th className="table-th">{t("offersControlPage.operation")}</th>
                <th className="table-th">{t("offersControlPage.price")}</th>
                <th className="table-th">{t("offersControlPage.city")}</th>
                <th className="table-th">{t("offersControlPage.bedrooms")}</th>
                <th className="table-th">{t("offersControlPage.bathrooms")}</th>
                <th className="table-th">
                  {t("offersControlPage.totalSpace")}
                </th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((offer) => (
                <tr key={offer._id} className="hover:bg-slate-50">
                  <td className="table-td">{offer.code}</td>
                  <td className="table-td">{offer.estateType}</td>
                  <td className="table-td">{offer.processType}</td>
                  <td className="table-td">{offer.price}</td>
                  <td className="table-td">{offer.city}</td>
                  <td className="table-td">{offer.bedrooms}</td>
                  <td className="table-td">{offer.bathrooms}</td>
                  <td className="table-td">{offer.totalSpace}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
};

export default OffersControlPage;
