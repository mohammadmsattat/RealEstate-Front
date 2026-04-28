import { TabPanel } from "@headlessui/react";
import Textinput from "@/components/ui/Textinput";

export default function ContactTab({ formData, handleChange ,t }) {
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

              <Textinput
                label={t("addOfferPage.PropertyPartner")}
                placeholder={t("addOfferPage.placeholders.PropertyPartner")}
                value={formData.ownerNumber}
                onChange={handleChange("partnership")}
              />
            </div>
          </TabPanel>
  );
}