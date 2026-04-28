import { TabPanel } from "@headlessui/react";
import Textinput from "@/components/ui/Textinput";

export default function ContactTab({ formData, handleChange, t }) {
  return (
    <TabPanel>
      <div className="grid md:grid-cols-2 gap-4">
        <Textinput
          label={t("addOfferPage.agentName")}
          placeholder={t("addOfferPage.placeholders.agentName")}
          value={formData.agentName}
          onChange={handleChange("agentName")}
        />

        <Textinput
          label={t("addOfferPage.agentPhone")}
          placeholder={t("addOfferPage.placeholders.agentPhone")}
          value={formData.agentPhone}
          onChange={handleChange("agentPhone")}
        />

        {/* optional: owner info (حسب schema) */}
        <Textinput
          label={t("addOfferPage.ownerName")}
          placeholder={t("addOfferPage.placeholders.ownerName")}
          value={formData.ownerName}
          onChange={handleChange("ownerName")}
        />

        <Textinput
          label={t("addOfferPage.ownerNumber")}
          placeholder={t("addOfferPage.placeholders.ownerNumber")}
          value={formData.ownerNumber}
          onChange={handleChange("ownerNumber")}
        />

        <div>
          <label className="block mb-2 text-sm font-medium">
            {t("addOfferPage.PropertyPartner")}
          </label>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.partnership?.map((item, index) => (
              <span
                key={index}
                className="flex items-center gap-2 bg-gray-200 px-3 py-1 rounded-full text-sm"
              >
                {item}
                <button
                  type="button"
                  onClick={() => removePartner(index)}
                  className="text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* Input */}
          <Textinput
            placeholder={t("addOfferPage.placeholders.PropertyPartner")}
            value={partnerInput}
            onChange={(e) => setPartnerInput(e.target.value)}
            onKeyDown={handlePartnerKeyDown}
          />
        </div>
      </div>
    </TabPanel>
  );
}
