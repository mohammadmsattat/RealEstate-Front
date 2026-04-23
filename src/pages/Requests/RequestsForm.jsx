import React, { Fragment } from "react";
import Textinput from "@/components/ui/Textinput";
import Select from "@/components/ui/Select";
import Icon from "@/components/ui/Icon";
import { Tab, TabList, TabPanel, TabPanels, TabGroup } from "@headlessui/react";

const tabs = [
  { key: "basic", label: "Basic Info", icon: "heroicons-outline:information-circle" },
  { key: "location", label: "Location", icon: "heroicons-outline:map" },
  { key: "details", label: "Property Details", icon: "heroicons-outline:home" },
  { key: "financial", label: "Budget", icon: "heroicons-outline:currency-dollar" },
  { key: "contact", label: "Customer", icon: "heroicons-outline:user" },
];

export default function RequestsForm({
  formData,
  handleChange,
}) {

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
                {tab.label}
              </button>
            )}
          </Tab>
        ))}
      </TabList>

      <TabPanels className="mt-6 space-y-6">

        {/* BASIC */}
        <TabPanel>
          <div className="grid md:grid-cols-2 gap-4">

            <Select
              label="Operation Type"
              value={formData.requirements?.processType || ""}
              options={[
                { label: "Sale", value: "for_sale" },
                { label: "Rent", value: "for_rent" },
              ]}
              onChange={handleChange("requirements.processType")}
            />

            <Select
              label="Property Type"
              value={formData.requirements?.estateTypes?.[0] || ""}
              options={[
                { label: "Apartment", value: "apartment" },
                { label: "Villa", value: "villa" },
                { label: "House", value: "house" },
              ]}
              onChange={(e) => {
                handleChange("requirements.estateTypes")({
                  target: { value: [e.target.value] }
                });
              }}
            />

          </div>
        </TabPanel>

        {/* LOCATION */}
        <TabPanel>
          <div className="grid md:grid-cols-2 gap-4">
            <Textinput
              label="City"
              value={formData.requirements?.city || ""}
              onChange={handleChange("requirements.city")}
            />

            <Textinput
              label="Neighborhood"
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
              label="Min Rooms"
              value={formData.requirements?.minRooms || ""}
              onChange={handleChange("requirements.minRooms")}
            />

            <Textinput
              type="number"
              label="Max Rooms"
              value={formData.requirements?.maxRooms || ""}
              onChange={handleChange("requirements.maxRooms")}
            />

            <Textinput
              type="number"
              label="Min Space"
              value={formData.requirements?.minSpace || ""}
              onChange={handleChange("requirements.minSpace")}
            />

            <Textinput
              type="number"
              label="Max Space"
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
              label="Min Price (USD)"
              value={formData.requirements?.price?.minUSD || ""}
              onChange={handleChange("requirements.price.minUSD")}
            />

            <Textinput
              type="number"
              label="Max Price (USD)"
              value={formData.requirements?.price?.maxUSD || ""}
              onChange={handleChange("requirements.price.maxUSD")}
            />

            <Textinput
              type="number"
              label="Min Price (SYP)"
              value={formData.requirements?.price?.minSYP || ""}
              onChange={handleChange("requirements.price.minSYP")}
            />

            <Textinput
              type="number"
              label="Max Price (SYP)"
              value={formData.requirements?.price?.maxSYP || ""}
              onChange={handleChange("requirements.price.maxSYP")}
            />

          </div>
        </TabPanel>

        {/* CUSTOMER */}
        <TabPanel>
          <div className="grid md:grid-cols-2 gap-4">

            <Textinput
              label="Customer Name"
              value={formData.customer?.name || ""}
              onChange={handleChange("customer.name")}
            />

            <Textinput
              label="Phone"
              value={formData.customer?.phone || ""}
              onChange={handleChange("customer.phone")}
            />

            <Textinput
              label="Email"
              value={formData.customer?.email || ""}
              onChange={handleChange("customer.email")}
            />

          </div>
        </TabPanel>

      </TabPanels>
    </TabGroup>
  );
}