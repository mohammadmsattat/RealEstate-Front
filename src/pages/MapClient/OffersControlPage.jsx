import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import Select from "@/components/ui/Select";
import { useGetOffersQuery } from "@/store/api/Offers/OffersApi";
import { socketService } from "@/socketService";
import { useTranslation } from "react-i18next";

const normalizeFilters = (f) => ({
  keyword: f.keyword || undefined,
  processType: f.processType || undefined,
  estateType: f.estateType || undefined,
  city: f.city || undefined,
  neighborhood: f.neighborhood || undefined,
  bedrooms: f.bedrooms ? Number(f.bedrooms) : undefined,
  bathrooms: f.bathrooms ? Number(f.bathrooms) : undefined,
  minPrice: f.minPrice ? Number(f.minPrice) : undefined,
  maxPrice: f.maxPrice ? Number(f.maxPrice) : undefined,
  minSpace: f.minSpace ? Number(f.minSpace) : undefined,
  maxSpace: f.maxSpace ? Number(f.maxSpace) : undefined,
});

const initialFilters = {
  keyword: "",
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
};

const OffersControlPage = () => {
  const { t } = useTranslation();

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState({});

  const normalizedFilters = normalizeFilters(appliedFilters);

  const { data, isLoading, isFetching } = useGetOffersQuery(normalizedFilters, {
    skip: !Object.keys(appliedFilters).length,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    socketService.connect();
  }, []);

  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const applySearchFilters = () => {
    setAppliedFilters(filters);
    setIsFilterModalOpen(false);
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setAppliedFilters({});
  };

  const applyFilters = () => {
    if (!Object.keys(appliedFilters).length) return;

    socketService.emitUpdateState({
      filters: normalizedFilters,
    });
  };

  const activeFilters = Object.entries(appliedFilters).filter(
    ([_, v]) => v !== "" && v != null,
  );

  return (
    <div className="flex md:space-x-5 relative min-h-screen">
      <div className="flex-1">
        <Card
          className="relative"
          title={t("offersControlPage.title")}
          subtitle={`${t("offersControlPage.results")}: ${
            data?.data?.length || 0
          }`}
          headerSlot={
            <div className="flex gap-2">
              <Button
                text={`${t("offersControlPage.filters")} (${activeFilters.length})`}
                className="btn-dark"
                onClick={() => setIsFilterModalOpen(true)}
              />
              <Button
                text={t("offersControlPage.applyOnMap")}
                className={`btn-dark ${
                  activeFilters.length ? "" : "opacity-50 cursor-not-allowed"
                }`}
                disabled={!activeFilters.length}
                onClick={applyFilters}
              />
            </div>
          }
        >
          {/* ✅ LOADING OVERLAY */}
          {(isLoading || isFetching) && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
                <span className="text-sm text-gray-600">
                  {t("common.loading")}
                </span>
              </div>
            </div>
          )}

          <table className="min-w-full divide-y">
            <thead>
              <tr>
                <th className="table-th">{t("offersControlPage.code")}</th>
                <th className="table-th">{t("offersControlPage.type")}</th>
                <th className="table-th">{t("offersControlPage.price")}</th>
                <th className="table-th">{t("offersControlPage.city")}</th>
                <th className="table-th">{t("offersControlPage.bedrooms")}</th>
                <th className="table-th">{t("offersControlPage.space")}</th>
              </tr>
            </thead>

            <tbody>
              {data?.data?.length > 0 ? (
                data.data.map((offer, index) => (
                  <tr
                    key={offer._id}
                    className={`transition hover:bg-slate-50 ${
                      index % 2 === 0 ? "bg-white" : "bg-slate-50"
                    }`}
                  >
                    <td className="table-td">{offer.code}</td>
                    <td className="table-td">{offer.estateType}</td>
                    <td className="table-td">{offer.price}</td>
                    <td className="table-td">{offer.city}</td>
                    <td className="table-td">{offer.bedrooms}</td>
                    <td className="table-td">{offer.totalSpace}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-slate-500">
                    {t("offersControlPage.noData")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>

      {/* FILTER MODAL */}
      <Modal
        title={t("offersControlPage.filters")}
        activeModal={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      >
        <div className="space-y-3">
          <Textinput
            label={t("offersControlPage.keyword")}
            placeholder={t("offersControlPage.Enterkeyword")}
            value={filters.keyword}
            onChange={(e) => handleChange("keyword", e.target.value)}
          />

          <Select
            label={t("offersControlPage.processType")}
            placeholder={t("addOfferPage.selectOption")}
            options={[
              { label: t("offersControlPage.select.sale"), value: "sale" },
              { label: t("offersControlPage.select.rent"), value: "rent" },
            ]}
            value={filters.processType}
            onChange={(e) => handleChange("processType", e.target.value)}
          />

          <Select
            label={t("offersControlPage.estateType")}
            placeholder={t("addOfferPage.selectOption")}
            options={[
              { label: t("offersControlPage.select.house"), value: "house" },
              { label: t("offersControlPage.select.villa"), value: "villa" },
              { label: t("offersControlPage.select.land"), value: "land" },
            ]}
            value={filters.estateType}
            onChange={(e) => handleChange("estateType", e.target.value)}
          />

          <Textinput
            label={t("offersControlPage.city")}
            placeholder={t("offersControlPage.Placeholdercity")}
            value={filters.city}
            onChange={(e) => handleChange("city", e.target.value)}
          />

          <Textinput
            label={t("offersControlPage.bedrooms")}
            placeholder={t("offersControlPage.Placeholderbedrooms")}
            type="number"
            value={filters.bedrooms}
            onChange={(e) => handleChange("bedrooms", e.target.value)}
          />

          <div className="flex gap-2">
            <Textinput
              placeholder={t("offersControlPage.minPrice")}
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleChange("minPrice", e.target.value)}
            />
            <Textinput
              placeholder={t("offersControlPage.maxPrice")}
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleChange("maxPrice", e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              text={t("offersControlPage.reset")}
              className="btn-secondary w-full"
              onClick={resetFilters}
            />
            <Button
              text={t("offersControlPage.applyFilters")}
              className="btn-dark w-full"
              onClick={applySearchFilters}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OffersControlPage;
