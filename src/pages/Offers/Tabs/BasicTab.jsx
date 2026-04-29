import { TabPanel } from "@headlessui/react";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";

export default function BasicTab({ formData, handleChange, t }) {
  return (
    <TabPanel>
      <div className="grid md:grid-cols-2 gap-4">
        <Textinput
          label={t("addOfferPage.offerNumber")}
          placeholder={t("addOfferPage.placeholders.offerNumber")}
          value={formData.offerNumber || ""}
          onChange={handleChange("offerNumber")}
        />

        <Textinput
          label={t("addOfferPage.staffBarcode")}
          placeholder={t("addOfferPage.placeholders.staffBarcode")}
          value={formData.staffParcode || ""}
          onChange={handleChange("staffParcode")}
        />

        <Textinput
          label={t("addOfferPage.titleField")}
          placeholder={t("addOfferPage.placeholders.title")}
          value={formData.title}
          onChange={handleChange("title")}
        />

        <Textinput
          label={t("addOfferPage.propertyCode")}
          placeholder={t("addOfferPage.placeholders.code")}
          value={formData.code}
          onChange={handleChange("code")}
        />

        <Select
          label={t("addOfferPage.operationType")}
          value={formData.processType}
          options={["sale", "rent"].map((op) => ({
            label: t(`addOfferPage.select.operation.${op}`),
            value: op,
          }))}
          onChange={handleChange("processType")}
        />

        <Select
          label={t("addOfferPage.propertyType")}
          value={formData.estateType}
          options={["house", "villa", "land", "farm", "servicedPlot"].map(
            (pt) => ({
              label: t(`addOfferPage.select.property.${pt}`),
              value: pt,
            }),
          )}
          onChange={handleChange("estateType")}
        />
      </div>

      <Textarea
        label={t("addOfferPage.description")}
        placeholder={t("addOfferPage.placeholders.description")}
        value={formData.description}
        onChange={handleChange("description")}
      />
    </TabPanel>
  );
}
