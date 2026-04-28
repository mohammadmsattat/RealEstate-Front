import { TabPanel } from "@headlessui/react";
import Textinput from "@/components/ui/Textinput";
import Select from "@/components/ui/Select";
import ReactSelect from "react-select";

const directionOptions = [
  { label: "North", value: "north" },
  { label: "South", value: "south" },
  { label: "East", value: "east" },
  { label: "West", value: "west" },
];

// MultiSelect wrapper بدون كسر التصميم
const MultiSelect = (props) => <ReactSelect {...props} isMulti />;

export default function DetailsTab({ formData, handleChange, t }) {
  return (
    <TabPanel>
      <div className="grid md:grid-cols-2 gap-4">

        <Textinput
          label="Facade"
          value={formData.facade || ""}
          onChange={handleChange("facade")}
        />

        <Select
          label="Property Condition"
          value={formData.propertyCondition}
          options={[
            "new",
            "excellent",
            "very_good",
            "good",
            "needs_renovation",
            "under_construction",
          ].map((v) => ({
            label: v,
            value: v,
          }))}
          onChange={handleChange("propertyCondition")}
        />

        <Textinput
          label="Furnishing"
          value={formData.Furnishing?.join(",") || ""}
          onChange={(e) =>
            handleChange("Furnishing")({
              target: { value: e.target.value.split(",") },
            })
          }
        />

        <div>
          <label className="form-label">Directions</label>

          <MultiSelect
            className="react-select"
            classNamePrefix="select"
            options={directionOptions}
            value={directionOptions.filter((opt) =>
              formData.directions?.includes(opt.value)
            )}
            onChange={(selected) => {
              handleChange("directions")({
                target: {
                  value: selected ? selected.map((s) => s.value) : [],
                },
              });
            }}
          />
        </div>

        <Textinput
          label="features"
          value={formData.features?.join(",") || ""}
          onChange={(e) =>
            handleChange("features")({
              target: { value: e.target.value.split(",") },
            })
          }
        />

        <Textinput
          type="number"
          label={t("addOfferPage.areaSize")}
          placeholder={t("addOfferPage.placeholders.areaSize")}
          value={formData.totalSpace}
          onChange={handleChange("totalSpace")}
        />

        <Textinput
          type="number"
          label={t("addOfferPage.builtArea")}
          placeholder={t("addOfferPage.placeholders.builtArea")}
          value={formData.builtArea}
          onChange={handleChange("builtArea")}
        />

        <Textinput
          type="number"
          label={t("addOfferPage.landArea")}
          placeholder={t("addOfferPage.placeholders.landArea")}
          value={formData.landArea}
          onChange={handleChange("landArea")}
        />

        <Textinput
          type="number"
          label={t("addOfferPage.rooms")}
          placeholder={t("addOfferPage.placeholders.rooms")}
          value={formData.bedrooms}
          onChange={handleChange("bedrooms")}
        />

        <Textinput
          type="number"
          label={t("addOfferPage.bathrooms")}
          placeholder={t("addOfferPage.placeholders.bathrooms")}
          value={formData.bathrooms}
          onChange={handleChange("bathrooms")}
        />

        <Textinput
          type="number"
          label={t("addOfferPage.floorNumber")}
          placeholder={t("addOfferPage.placeholders.floorNumber")}
          value={formData.floorNumber}
          onChange={handleChange("floorNumber")}
        />

        <Textinput
          type="string"
          label={t("addOfferPage.roofPriority")}
          placeholder={t("addOfferPage.placeholders.roofPriority")}
          value={formData.roofPriority}
          onChange={handleChange("roofPriority")}
        />

        <Textinput
          type="number"
          label={t("addOfferPage.yearBuilt")}
          placeholder={t("addOfferPage.placeholders.yearBuilt")}
          value={formData.yearBuilt}
          onChange={handleChange("yearBuilt")}
        />
        <Textinput
          type="string"
          label={t("addOfferPage.recordNumber")}
          placeholder={t("addOfferPage.placeholders.recordNumber")}
          value={formData.recordNumber}
          onChange={handleChange("recordNumber")}
        />
        <Textinput
          type="string"
          label={t("addOfferPage.parcelNumber")}
          placeholder={t("addOfferPage.placeholders.parcelNumber")}
          value={formData.parcelNumber}
          onChange={handleChange("parcelNumber")}
        />

        <Textinput
          type="number"
          label={t("addOfferPage.totalFloors")}
          placeholder={t("addOfferPage.placeholders.totalFloors")}
          value={formData.totalFloors}
          onChange={handleChange("totalFloors")}
        />
      </div>
    </TabPanel>
  );
}