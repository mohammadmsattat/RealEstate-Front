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
    <>
      {/* Header with Save Button */}
      {/* <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800">
          {t("addOfferPage.title") || "Add New Offer"}
        </h2>
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
        >
          {t("addOfferPage.actions.save") || "Save Offer"}
        </button>
      </div> */}

      <TabGroup>
        <TabList className="flex flex-wrap gap-4 border-b pb-3">
          {tabs.map((tItem, i) => (
            <Tab as={Fragment} key={i}>
              {({ selected }) => (
                <button
                  className={`flex items-center gap-2 px-3 py-2 rounded transition
                    ${selected ? "bg-blue-100 text-blue-600" : "text-gray-500"}`}
                >
                  <Icon icon={tItem.icon} />{" "}
                  {t(`addOfferPage.tabs.${tItem.key}`)}
                </button>
              )}
            </Tab>
          ))}
        </TabList>

        <TabPanels className="mt-6 space-y-6" unmount={false}>
          {/* BASIC */}
          <TabPanel>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Textinput
                  label={t("addOfferPage.titleField")}
                  value={formData.title}
                  onChange={handleChange("title")}
                  className={errors?.title ? "border-red-500" : ""}
                />
                {errors?.title && (
                  <p className="text-red-500 text-sm">{errors?.title}</p>
                )}
              </div>

              <Textinput
                label={t("addOfferPage.propertyCode")}
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
                options={["house", "villa", "land"].map((pt) => ({
                  label: t(`addOfferPage.select.property.${pt}`),
                  value: pt,
                }))}
                onChange={handleChange("estateType")}
              />
            </div>

            <Textarea
              label={t("addOfferPage.description")}
              value={formData.description}
              onChange={handleChange("description")}
              className={errors?.description ? "border-red-500" : ""}
            />
          </TabPanel>

          {/* LOCATION */}

          <TabPanel>
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Textinput
                  label={t("addOfferPage.city")}
                  value={formData.city}
                  onChange={handleChange("city")}
                />
                <Textinput
                  label={t("addOfferPage.area")}
                  value={formData.neighborhood}
                  onChange={handleChange("neighborhood")}
                />
              </div>

              <Textarea
                label={t("addOfferPage.address")}
                value={formData.address}
                onChange={handleChange("address")}
              />

              <div className="grid md:grid-cols-2 gap-4">
                <Textinput
                  label={t("addOfferPage.latitude")}
                  value={formData.location?.lat || ""}
                  disabled
                />
                <Textinput
                  label={t("addOfferPage.longitude")}
                  value={formData.location?.lng || ""}
                  disabled
                />
              </div>

              <button
                type="button"
                onClick={onOpenMap}
                className="flex items-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
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

          {/* DETAILS */}
          <TabPanel>
            <div className="grid md:grid-cols-3 gap-4">
              <Textinput
                label={t("addOfferPage.areaSize")}
                value={formData.totalSpace}
                onChange={handleChange("totalSpace")}
              />
              <Textinput
                label={t("addOfferPage.builtArea")}
                value={formData.builtArea}
                onChange={handleChange("builtArea")}
              />
              <Textinput
                label={t("addOfferPage.landArea")}
                value={formData.landArea}
                onChange={handleChange("landArea")}
              />
              <Textinput
                label={t("addOfferPage.rooms")}
                value={formData.bedrooms}
                onChange={handleChange("bedrooms")}
              />
              <Textinput
                label={t("addOfferPage.bathrooms")}
                value={formData.bathrooms}
                onChange={handleChange("bathrooms")}
              />
              <Textinput
                label={t("addOfferPage.floorNumber")}
                value={formData.floorNumber}
                onChange={handleChange("floorNumber")}
              />
              <Textinput
                label={t("addOfferPage.totalFloors")}
                value={formData.totalFloors}
                onChange={handleChange("totalFloors")}
              />
            </div>
          </TabPanel>

          {/* FINANCIAL */}
          <TabPanel>
            <div className="grid md:grid-cols-2 gap-4">
              <Textinput
                label={t("addOfferPage.price")}
                value={formData.price}
                onChange={handleChange("price")}
              />
              <Textinput
                label={t("addOfferPage.pricePerMeter")}
                value={formData.pricePerMeter}
                onChange={handleChange("pricePerMeter")}
              />
              <Select
                label={t("addOfferPage.paymentMethod")}
                value={formData.paymentType}
                options={["cash", "installment"].map((p) => ({
                  label: t(`addOfferPage.select.payment.${p}`),
                  value: p,
                }))}
                onChange={handleChange("paymentType")}
              />
              <Textinput
                label={t("addOfferPage.downPayment")}
                value={formData.downPayment}
                onChange={handleChange("downPayment")}
              />
              <Textinput
                label={t("addOfferPage.installmentMonths")}
                value={formData.installmentMonths}
                onChange={handleChange("installmentMonths")}
              />
              <Textinput
                type="date"
                label={t("addOfferPage.listingExpiryDate")}
                value={formData.listingExpiryDate}
                onChange={handleChange("listingExpiryDate")}
              />
              <Textinput
                type="date"
                label={t("addOfferPage.closedDate")}
                value={formData.closedDate}
                onChange={handleChange("closedDate")}
              />
            </div>
          </TabPanel>

          {/* MEDIA */}
          <TabPanel>
            <div className="space-y-4">
              <Fileinput
                label={t("addOfferPage.images.mainImage")}
                selectedFile={files.mainImage}
                onChange={(e) =>
                  setFiles({ ...files, mainImage: e.target.files[0] })
                }
              />
              <Fileinput
                label={t("addOfferPage.images.images")}
                multiple
                selectedFiles={files.images || []}
                onChange={(e) =>
                  setFiles({
                    ...files,
                    images: Array.from(e.target.files || []),
                  })
                }
              />
              <Fileinput
                label={t("addOfferPage.documents")}
                multiple
                selectedFiles={files.files || []}
                onChange={(e) =>
                  setFiles({
                    ...files,
                    files: Array.from(e.target.files || []),
                  })
                }
              />
              <Fileinput
                label={t("addOfferPage.videoFiles")}
                multiple
                accept="video/*"
                selectedFiles={files.videoFiles || []}
                onChange={(e) =>
                  setFiles({
                    ...files,
                    videoFiles: Array.from(e.target.files || []),
                  })
                }
              />
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </>
  );
}
