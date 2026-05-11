import React, { Fragment } from "react";
import Textinput from "@/components/ui/Textinput";
import Select from "@/components/ui/Select";
import Icon from "@/components/ui/Icon";
import { Tab, TabList, TabPanel, TabPanels, TabGroup } from "@headlessui/react";

const tabs = [
  {
    key: "basic",
    label: "Basic Info",
    icon: "heroicons-outline:information-circle",
  },
  { key: "location", label: "Location", icon: "heroicons-outline:map" },
  { key: "details", label: "Property Details", icon: "heroicons-outline:home" },
  {
    key: "financial",
    label: "Budget",
    icon: "heroicons-outline:currency-dollar",
  },
  { key: "contact", label: "Customer", icon: "heroicons-outline:user" },
];

export default function RequestsForm({ formData, handleChange, errors, t }) {
  return (
    <TabGroup>
      <TabList className="flex gap-4 border-b pb-3">
        {tabs.map((tab, i) => (
          <Tab as={Fragment} key={i}>
            {({ selected }) => (
              <button
                className={`flex items-center gap-2 px-3 py-2 rounded ${
                  selected ? "bg-gray-200" : "text-gray-500"
                }`}
              >
                <Icon icon={tab.icon} />
                {t(`requestsPage.tabs.${tab.key}`)}
              </button>
            )}
          </Tab>
        ))}
      </TabList>

      <TabPanels className="mt-6 space-y-6">
        {/* BASIC */}
        <TabPanel>
          <div className="grid md:grid-cols-2 gap-4">
            <Textinput
              label={t("requestsPage.requestNumber")}
              placeholder={t("requestsPage.placeholders.requestNumber")}
              value={formData.requestNumber || ""}
              onChange={handleChange("requestNumber")}
              error={errors.requestNumber}
            />

            <Select
              label={t("requestsPage.operationType")}
              value={formData.requirements?.processType || ""}
              options={[
                { label: t("requestsPage.select.sale"), value: "for_sale" },
                { label: t("requestsPage.select.rent"), value: "for_rent" },
              ]}
              onChange={handleChange("requirements.processType")}
              error={errors.processType}
            />

            <Select
              label={t("requestsPage.propertyType")}
              value={formData.requirements?.estateTypes?.[0] || ""}
              options={[
                {
                  label: t("requestsPage.select.apartment"),
                  value: "apartment",
                },
                { label: t("requestsPage.select.villa"), value: "villa" },
                { label: t("requestsPage.select.house"), value: "house" },
              ]}
              onChange={(e) => {
                handleChange("requirements.estateTypes")({
                  target: { value: [e.target.value] },
                });
              }}
              error={errors.estateTypes}
            />
          </div>
        </TabPanel>

        {/* LOCATION */}
        <TabPanel>
          <div className="grid md:grid-cols-2 gap-4">
            <Textinput
              label={t("requestsPage.city")}
              placeholder={t("requestsPage.placeholders.city")}
              value={formData.requirements?.city || ""}
              onChange={handleChange("requirements.city")}
              error={errors.city}
            />

            <Textinput
              label={t("requestsPage.neighborhood")}
              placeholder={t("requestsPage.placeholders.neighborhood")}
              value={formData.requirements?.neighborhood || ""}
              onChange={handleChange("requirements.neighborhood")}
            />
          </div>
        </TabPanel>

        {/* DETAILS */}
        <TabPanel>
          <div className="grid md:grid-cols-3 gap-4">
            <Textinput
              type="number"
              label={t("requestsPage.minRooms")}
              placeholder={t("requestsPage.placeholders.minRooms")}
              value={formData.requirements?.minRooms || ""}
              onChange={handleChange("requirements.minRooms")}
            />

            <Textinput
              type="number"
              label={t("requestsPage.maxRooms")}
              placeholder={t("requestsPage.placeholders.maxRooms")}
              value={formData.requirements?.maxRooms || ""}
              onChange={handleChange("requirements.maxRooms")}
            />

            <Textinput
              type="number"
              label={t("requestsPage.minSpace")}
              placeholder={t("requestsPage.placeholders.minSpace")}
              value={formData.requirements?.minSpace || ""}
              onChange={handleChange("requirements.minSpace")}
            />

            <Textinput
              type="number"
              label={t("requestsPage.maxSpace")}
              placeholder={t("requestsPage.placeholders.maxSpace")}
              value={formData.requirements?.maxSpace || ""}
              onChange={handleChange("requirements.maxSpace")}
            />
          </div>
        </TabPanel>

        {/* FINANCIAL */}
        <TabPanel>
          <div className="grid md:grid-cols-2 gap-4">
            <Textinput
              type="number"
              label={t("requestsPage.minPriceUSD")}
              placeholder={t("requestsPage.placeholders.minPriceUSD")}
              value={formData.requirements?.price?.minUSD || ""}
              onChange={handleChange("requirements.price.minUSD")}
            />

            <Textinput
              type="number"
              label={t("requestsPage.maxPriceUSD")}
              placeholder={t("requestsPage.placeholders.maxPriceUSD")}
              value={formData.requirements?.price?.maxUSD || ""}
              onChange={handleChange("requirements.price.maxUSD")}
            />

            <Textinput
              type="number"
              label={t("requestsPage.minPriceSYP")}
              placeholder={t("requestsPage.placeholders.minPriceSYP")}
              value={formData.requirements?.price?.minSYP || ""}
              onChange={handleChange("requirements.price.minSYP")}
            />

            <Textinput
              type="number"
              label={t("requestsPage.maxPriceSYP")}
              placeholder={t("requestsPage.placeholders.maxPriceSYP")}
              value={formData.requirements?.price?.maxSYP || ""}
              onChange={handleChange("requirements.price.maxSYP")}
            />
          </div>
        </TabPanel>

        {/* CUSTOMER */}
        <TabPanel>
          <div className="grid md:grid-cols-2 gap-4">
            <Textinput
              label={t("requestsPage.customerName")}
              placeholder={t("requestsPage.placeholders.customerName")}
              value={formData.customer?.name || ""}
              onChange={handleChange("customer.name")}
            />

            <Textinput
              label={t("requestsPage.phone")}
              placeholder={t("requestsPage.placeholders.phone")}
              value={formData.customer?.phone || ""}
              onChange={handleChange("customer.phone")}
            />

            <Textinput
              label={t("requestsPage.email")}
              placeholder={t("requestsPage.placeholders.email")}
              value={formData.customer?.email || ""}
              onChange={handleChange("customer.email")}
            />
          </div>
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}
