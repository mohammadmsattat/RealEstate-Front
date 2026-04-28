import React, { Fragment, useState, useEffect } from "react";
import Textinput from "@/components/ui/Textinput";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Icon from "@/components/ui/Icon";
import Fileinput from "@/components/ui/Fileinput";
import { Tab, TabList, TabPanel, TabPanels, TabGroup } from "@headlessui/react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import "leaflet-geosearch/dist/geosearch.css";
import { useTranslation } from "react-i18next";
import MapModal from "./mapModal";
import BasicTab from "./Tabs/BasicTab";
import LocationTab from "./Tabs/LocationTab";
import DetailsTab from "./Tabs/DetailsTab";
import FinancialTab from "./Tabs/FinancialTab";
import ContactTab from "./Tabs/ContactTab";
import MediaTab from "./Tabs/MediaTab";

function SearchControl() {
  const map = useMap();
  useEffect(() => {
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: true,
      autoClose: true,
      retainZoomLevel: false,
    });
    map.addControl(searchControl);
    return () => map.removeControl(searchControl);
  }, [map]);
  return null;
}

function LocationPicker({ setLatLng }) {
  const [position, setPosition] = useState([33.3152, 44.3661]);
  const map = useMap();

  useEffect(() => {
    const handleClick = (e) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
      setLatLng(e.latlng);
    };

    map.on("click", handleClick);
    return () => map.off("click", handleClick);
  }, [map]);

  return <Marker position={position} />;
}

const tabs = [
  { key: "basic", icon: "heroicons-outline:information-circle" },
  { key: "location", icon: "heroicons-outline:map" },
  { key: "details", icon: "heroicons-outline:home" },
  { key: "financial", icon: "heroicons-outline:currency-dollar" },
  { key: "contact", icon: "heroicons-outline:user" },
  { key: "media", icon: "heroicons-outline:photograph" },
];

export default function OfferForm({
  formData,
  features,
  files,
  errors,
  handleChange,
  handleFeature,
  setFiles,
  setLatLng,
  handleSubmit,
  isMapOpen,
  onOpenMap,
  onCloseMap,
}) {
  const { t } = useTranslation();

  return (
    <TabGroup>
      <TabList className="flex flex-wrap gap-4 border-b pb-3">
        {tabs.map((tItem, i) => (
          <Tab as={Fragment} key={i}>
            {({ selected }) => (
              <button
                className={`flex items-center gap-2 px-3 py-2 rounded transition
                  ${selected ? "bg-gray-200 text-dark-600" : "text-gray-500"}`}
              >
                <Icon icon={tItem.icon} />
                {t(`addOfferPage.tabs.${tItem.key}`)}
              </button>
            )}
          </Tab>
        ))}
      </TabList>

      <TabPanels className="mt-6 space-y-6" unmount={false}>
        <BasicTab
          t={t}
          formData={formData}
          errors={errors}
          handleChange={handleChange}
        />

        <LocationTab
          t={t}
          formData={formData}
          setLatLng={setLatLng}
          isMapOpen={isMapOpen}
          onOpenMap={onOpenMap}
          onCloseMap={onCloseMap}
          handleChange={handleChange}
        />

        <DetailsTab t={t} formData={formData} handleChange={handleChange} />

        <FinancialTab t={t} formData={formData} handleChange={handleChange}  />

        <ContactTab t={t} formData={formData} handleChange={handleChange} />

        <MediaTab t={t} files={files} setFiles={setFiles} />
      </TabPanels>
    </TabGroup>
  );
}
