import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import Textinput from "@/components/ui/Textinput";
import Select from "@/components/ui/Select";
import { useGetOffersQuery } from "@/store/api/Offers/OffersApi";
import { socketService } from "@/socketService";

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
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState({});

  const normalizedFilters = normalizeFilters(appliedFilters);

  const { data } = useGetOffersQuery(normalizedFilters, {
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

  const removeFilter = (key) => {
    setAppliedFilters((prev) => {
      const updated = { ...prev };
      delete updated[key];
      return updated;
    });
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
      {/* ================= MAIN ================= */}
      <div className="flex-1">
        <Card
          title="Offers"
          subtitle={`Results: ${data?.data?.length || 0}`}
          headerSlot={
            <div className="flex gap-2">
              <Button
                text={`Filters (${activeFilters.length})`}
                className="btn-dark"
                onClick={() => setIsFilterModalOpen(true)}
              />

              <Button
                text="Apply on Map"
                className={`btn-dark ${
                  activeFilters.length ? "" : "opacity-50 cursor-not-allowed"
                }`}
                disabled={!activeFilters.length}
                onClick={applyFilters}
              />
            </div>
          }
        >
          <table className="min-w-full divide-y">
            <thead>
              <tr>
                <th className="table-th">Code</th>
                <th className="table-th">Type</th>
                <th className="table-th">Price</th>
                <th className="table-th">City</th>
                <th className="table-th">Bedrooms</th>
                <th className="table-th">Space</th>
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
                    No data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>

      {/* ================= MODAL ================= */}
      <Modal
        title="Filters"
        activeModal={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
      >
        <div className="space-y-3">
          <Textinput
            label="Keyword"
            value={filters.keyword}
            onChange={(e) => handleChange("keyword", e.target.value)}
          />

          <Select
            label="Process Type"
            options={[
              { label: "Sale", value: "sale" },
              { label: "Rent", value: "rent" },
            ]}
            value={filters.processType}
            onChange={(e) => handleChange("processType", e.target.value)}
          />

          <Select
            label="Estate Type"
            options={[
              { label: "House", value: "house" },
              { label: "Villa", value: "villa" },
              { label: "Land", value: "land" },
            ]}
            value={filters.estateType}
            onChange={(e) => handleChange("estateType", e.target.value)}
          />

          <Textinput
            label="City"
            value={filters.city}
            onChange={(e) => handleChange("city", e.target.value)}
          />

          <Textinput
            label="Bedrooms"
            type="number"
            value={filters.bedrooms}
            onChange={(e) => handleChange("bedrooms", e.target.value)}
          />

          <div className="flex gap-2">
            <Textinput
              placeholder="Min Price"
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleChange("minPrice", e.target.value)}
            />
            <Textinput
              placeholder="Max Price"
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleChange("maxPrice", e.target.value)}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              text="Reset"
              className="btn-secondary w-full"
              onClick={resetFilters}
            />

            <Button
              text="Apply Filters"
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