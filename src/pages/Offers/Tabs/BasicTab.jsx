import { TabPanel } from "@headlessui/react";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";

export default function BasicTab({ formData, handleChange, t }) {
  return (
    <TabPanel>
      <div className="grid md:grid-cols-2 gap-4">
        <Textinput
          label="Offer Number"
          value={formData.offerNumber || ""}
          onChange={handleChange("offerNumber")}
        />

        <Textinput
          label="Employee Barcode"
          value={formData.staffParcode || ""}
          onChange={handleChange("staffParcode")}
        />

        <Textinput
          label={t("addOfferPage.titleField")}
          value={formData.title}
          onChange={handleChange("title")}
        />

        <Textinput
          label={t("addOfferPage.propertyCode")}
          value={formData.code}
          onChange={handleChange("code")}
        />

        <Select
          label={t("addOfferPage.operationType")}
          value={formData.processType}
          options={["sale", "rent"].map((op) => ({
            label: op,
            value: op,
          }))}
          onChange={handleChange("processType")}
        />

        <Select
          label={t("addOfferPage.propertyType")}
          value={formData.estateType}
          options={["house", "villa", "land", "Farm", "Serviced Plot"].map(
            (pt) => ({
              label: pt,
              value: pt,
            }),
          )}
          onChange={handleChange("estateType")}
        />
      </div>

      <Textarea
        label={t("addOfferPage.description")}
        value={formData.description}
        onChange={handleChange("description")}
      />
    </TabPanel>
  );
}
