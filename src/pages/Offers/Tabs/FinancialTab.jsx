import { TabPanel } from "@headlessui/react";
import Textinput from "@/components/ui/Textinput";
import Select from "@/components/ui/Select";

export default function FinancialTab({
  formData,
  handleChange,
  t,
}) {
  return (
    <TabPanel>
      <div className="grid md:grid-cols-2 gap-4">

        {/* PRICE RANGE - SYP */}
        <Textinput
          label={t("addOfferPage.priceMinSYP")}
          placeholder={t("addOfferPage.placeholders.priceMinSYP")}
          type="number"
          value={formData.price?.minSYP || ""}
          onChange={handleChange("price.minSYP")}
        />

        <Textinput
          label={t("addOfferPage.priceMaxSYP")}
          placeholder={t("addOfferPage.placeholders.priceMaxSYP")}
          type="number"
          value={formData.price?.maxSYP || ""}
          onChange={handleChange("price.maxSYP")}
        />

        {/* PRICE RANGE - USD */}
        <Textinput
          label={t("addOfferPage.priceMinUSD")}
          placeholder={t("addOfferPage.placeholders.priceMinUSD")}
          type="number"
          value={formData.price?.minUSD || ""}
          onChange={handleChange("price.minUSD")}
        />

        <Textinput
          label={t("addOfferPage.priceMaxUSD")}
          placeholder={t("addOfferPage.placeholders.priceMaxUSD")}
          type="number"
          value={formData.price?.maxUSD || ""}
          onChange={handleChange("price.maxUSD")}
        />

        {/* PRICE PER METER */}
        <Textinput
          label={t("addOfferPage.pricePerMeterFrom")}
          placeholder={t("addOfferPage.placeholders.pricePerMeterFrom")}
          type="number"
          value={formData.pricePerMeterFrom || ""}
          onChange={handleChange("pricePerMeterFrom")}
        />

        <Textinput
          label={t("addOfferPage.pricePerMeterTo")}
          placeholder={t("addOfferPage.placeholders.pricePerMeterTo")}
          type="number"
          value={formData.pricePerMeterTo || ""}
          onChange={handleChange("pricePerMeterTo")}
        />

        {/* PAYMENT TYPE */}
        <Select
          label={t("addOfferPage.paymentMethod")}
          value={formData.paymentType}
          options={[
            { label: t("addOfferPage.select.payment.cash"), value: "cash" },
            {
              label: t("addOfferPage.select.payment.installment"),
              value: "installment",
            },
          ]}
          onChange={handleChange("paymentType")}
        />

        {/* DOWN PAYMENT */}
        <Textinput
          label={t("addOfferPage.downPayment")}
          placeholder={t("addOfferPage.placeholders.downPayment")}
          type="number"
          value={formData.downPayment || ""}
          onChange={handleChange("downPayment")}
        />

        {/* INSTALLMENT MONTHS */}
        <Textinput
          label={t("addOfferPage.installmentMonths")}
          placeholder={t("addOfferPage.placeholders.installmentMonths")}
          type="number"
          value={formData.installmentMonths || ""}
          onChange={handleChange("installmentMonths")}
        />

        {/* CLOSED DATE */}
        <Textinput
          type="date"
          label={t("addOfferPage.closedDate")}
          placeholder={t("addOfferPage.placeholders.closedDate")}
          value={formData.closedDate || ""}
          onChange={handleChange("closedDate")}
        />

      </div>
    </TabPanel>
  );
}