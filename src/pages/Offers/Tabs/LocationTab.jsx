import { TabPanel } from "@headlessui/react";
import Textinput from "@/components/ui/Textinput";
import MapModal from "../mapModal";
import Textarea from "@/components/ui/Textarea";
import Icon from "@/components/ui/Icon";

export default function LocationTab({
  formData,
  handleChange,
  isMapOpen,
  onOpenMap,
  onCloseMap,
  setLatLng,
  t,
}) {
  return (
    <TabPanel>
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Textinput
            label={t("addOfferPage.city")}
            placeholder={t("addOfferPage.placeholders.city")}
            value={formData.city}
            onChange={handleChange("city")}
          />
          <Textinput
            label={t("addOfferPage.area")}
            placeholder={t("addOfferPage.placeholders.area")}
            value={formData.neighborhood}
            onChange={handleChange("neighborhood")}
          />
        </div>

        <Textarea
          label={t("addOfferPage.address")}
          placeholder={t("addOfferPage.placeholders.address")}
          value={formData.address}
          onChange={handleChange("address")}
        />

        <div className="grid md:grid-cols-2 gap-4">
          <Textinput
            label={t("addOfferPage.latitude")}
            placeholder={t("addOfferPage.placeholders.latitude")}
            value={formData.location?.lat || ""}
            disabled
          />
          <Textinput
            label={t("addOfferPage.longitude")}
            placeholder={t("addOfferPage.placeholders.longitude")}
            value={formData.location?.lng || ""}
            disabled
          />
        </div>

        <button
          type="button"
          onClick={onOpenMap}
          className="btn-dark flex items-center gap-2 px-4 py-2  rounded-lg  transition"
        >
          <Icon icon="heroicons-outline:map" />
          {t("addOfferPage.openMap") || "Open Map to Select Location"}
        </button>
      </div>

      {/* ✅ استخدم onCloseMap هنا */}
      <MapModal
        isOpen={isMapOpen}
        onClose={onCloseMap}
        setLatLng={setLatLng}
        lat={formData.location?.lat}
        lng={formData.location?.lng}
      />
    </TabPanel>
  );
}
