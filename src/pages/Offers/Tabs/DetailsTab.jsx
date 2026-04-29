import { TabPanel } from "@headlessui/react";
import Textinput from "@/components/ui/Textinput";
import ReactSelect from "react-select";

const directionOptions = (t) => [
  { label: t("addOfferPage.direction.north"), value: "north" },
  { label: t("addOfferPage.direction.south"), value: "south" },
  { label: t("addOfferPage.direction.east"), value: "east" },
  { label: t("addOfferPage.direction.west"), value: "west" },
];

const MultiSelect = (props) => <ReactSelect {...props} isMulti />;

export default function DetailsTab({ formData, handleChange, t }) {
  const options = directionOptions(t);

  return (
    <TabPanel>
      <div className="grid md:grid-cols-2 gap-4">

        <Textinput
          label={t("addOfferPage.facade")}
          placeholder={t("addOfferPage.placeholders.facade")}
          value={formData.facade || ""}
          onChange={handleChange("facade")}
        />

        <Textinput
          label={t("addOfferPage.propertyCondition")}
          placeholder={t("addOfferPage.placeholders.propertyCondition")}
          value={formData.propertyCondition || ""}
          onChange={handleChange("propertyCondition")}
        />

        <Textinput
          label={t("addOfferPage.ownershipType")}
          placeholder={t("addOfferPage.placeholders.ownershipType")}
          value={formData.OwnershipType || ""}
          onChange={handleChange("ownershipType")}
        />

        {/* DIRECTIONS */}
        <div>
          <label className="form-label">
            {t("addOfferPage.direction.label")}
          </label>

          <MultiSelect
            className="react-select"
            classNamePrefix="select"
            options={options}
            value={options.filter((opt) =>
              formData.directions?.includes(opt.value),
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
          value={formData.rooms}
          onChange={handleChange("rooms")}
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
          type="text"
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
          type="text"
          label={t("addOfferPage.recordNumber")}
          placeholder={t("addOfferPage.placeholders.recordNumber")}
          value={formData.recordNumber}
          onChange={handleChange("recordNumber")}
        />

        <Textinput
          type="text"
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