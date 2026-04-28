import { TabPanel } from "@headlessui/react";
import Textinput from "@/components/ui/Textinput";
import Select from "@/components/ui/Select";

export default function FinancialTab({
  formData,
  setFormData,
  handleChange,
  t,
}) {
  const updatePrice = (key, value) => {
    console.log(key);
    console.log(value);

    setFormData((prev) => ({
      ...prev,
      price: {
        ...prev.price,
        [key]: value === "" ? "" : Number(value),
      },
    }));
  };

  return (
    <TabPanel>
      <div className="grid md:grid-cols-2 gap-4">
        {/* PRICE RANGE - SYP */}
        <Textinput
          label="Min Price (SYP)"
          type="number"
          value={formData.price?.minSYP || ""}
          onChange={handleChange("price.minSYP")}
        />

        <Textinput
          label="Max Price (SYP)"
          type="number"
          value={formData.price?.maxSYP || ""}
          onChange={handleChange("price.maxSYP")}
        />

        {/* PRICE RANGE - USD */}
        <Textinput
          label="Min Price (USD)"
          type="number"
          value={formData.price?.minUSD || ""}
          onChange={handleChange("price.minUSD")}
        />

        <Textinput
          label="Max Price (USD)"
          type="number"
          value={formData.price?.maxUSD || ""}
          onChange={handleChange("price.maxUSD")}
        />

        {/* PRICE PER METER RANGE ✔ الصحيح */}
        <Textinput
          label="Price Per Meter (From)"
          type="number"
          value={formData.pricePerMeterFrom || ""}
          onChange={handleChange("pricePerMeterFrom")}
        />

        <Textinput
          label="Price Per Meter (To)"
          type="number"
          value={formData.pricePerMeterTo || ""}
          onChange={handleChange("pricePerMeterTo")}
        />

        {/* PAYMENT TYPE */}
        <Select
          label={t("addOfferPage.paymentMethod")}
          value={formData.paymentType}
          options={[
            { label: "Cash", value: "cash" },
            { label: "Installment", value: "installment" },
            { label: "All", value: "all" },
          ]}
          onChange={handleChange("paymentType")}
        />

        {/* DOWN PAYMENT */}
        <Textinput
          label={t("addOfferPage.downPayment")}
          type="number"
          value={formData.downPayment || ""}
          onChange={handleChange("downPayment")}
        />

        {/* INSTALLMENT MONTHS */}
        <Textinput
          label={t("addOfferPage.installmentMonths")}
          type="number"
          value={formData.installmentMonths || ""}
          onChange={handleChange("installmentMonths")}
        />

        {/* CLOSED DATE */}
        <Textinput
          type="date"
          label={t("addOfferPage.closedDate")}
          value={formData.closedDate || ""}
          onChange={handleChange("closedDate")}
        />
      </div>
    </TabPanel>
  );
}
