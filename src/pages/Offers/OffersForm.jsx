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
    <>
      <TabGroup>
        <TabList className="flex flex-wrap gap-4 border-b pb-3">
          {tabs.map((tItem, i) => (
            <Tab as={Fragment} key={i}>
              {({ selected }) => (
                <button
                  className={`flex items-center gap-2 px-3 py-2 rounded transition
                    ${selected ? "bg-gray-200 text-dark-600" : "text-gray-500"}`}
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
                  placeholder={t("addOfferPage.placeholders.title")}
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
                placeholder={t("addOfferPage.placeholders.code")}
                value={formData.code}
                onChange={handleChange("code")}
              />

              <Select
                label={t("addOfferPage.operationType")}
                placeholder={t("addOfferPage.selectOption")}
                value={formData.processType}
                options={["sale", "rent"].map((op) => ({
                  label: t(`addOfferPage.select.operation.${op}`),
                  value: op,
                }))}
                onChange={handleChange("processType")}
              />

              <Select
                label={t("addOfferPage.propertyType")}
                placeholder={t("addOfferPage.selectOption")}
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
              placeholder={t("addOfferPage.placeholders.description")}
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

          {/* DETAILS */}
          <TabPanel>
            <div className="grid md:grid-cols-3 gap-4">
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
                type="number"
                label={t("addOfferPage.totalFloors")}
                placeholder={t("addOfferPage.placeholders.totalFloors")}
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
                placeholder={t("addOfferPage.placeholders.price")}
                value={formData.price}
                onChange={handleChange("price")}
              />
              <Textinput
                label={t("addOfferPage.pricePerMeter")}
                placeholder={t("addOfferPage.placeholders.pricePerMeter")}
                value={formData.pricePerMeter}
                onChange={handleChange("pricePerMeter")}
              />
              <Select
                label={t("addOfferPage.paymentMethod")}
                placeholder={t("addOfferPage.placeholders.downPayment")}
                value={formData.paymentType}
                options={["cash", "installment"].map((p) => ({
                  label: t(`addOfferPage.select.payment.${p}`),
                  value: p,
                }))}
                onChange={handleChange("paymentType")}
              />
              <Textinput
                label={t("addOfferPage.downPayment")}
                placeholder={t("addOfferPage.placeholders.downPayment")}
                value={formData.downPayment}
                onChange={handleChange("downPayment")}
              />
              <Textinput
                label={t("addOfferPage.installmentMonths")}
                placeholder={t("addOfferPage.placeholders.installmentMonths")}
                value={formData.installmentMonths}
                onChange={handleChange("installmentMonths")}
              />
              <Textinput
                type="date"
                label={t("addOfferPage.listingExpiryDate")}
                placeholder={t("addOfferPage.placeholders.listingExpiryDate")}
                value={formData.listingExpiryDate}
                onChange={handleChange("listingExpiryDate")}
              />
              <Textinput
                type="date"
                label={t("addOfferPage.closedDate")}
                placeholder={t("addOfferPage.placeholders.closedDate")}
                value={formData.closedDate}
                onChange={handleChange("closedDate")}
              />
            </div>
          </TabPanel>
          {/* CONTACT */}
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

              <Textinput
                label={t("addOfferPage.agentEmail")}
                placeholder={t("addOfferPage.placeholders.agentEmail")}
                value={formData.agentEmail}
                onChange={handleChange("agentEmail")}
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
            </div>
          </TabPanel>
          {/* MEDIA */}
          <TabPanel>
            <div className="space-y-6">
              {/* MAIN IMAGE */}
              <div>
                <Fileinput
                  label={t("addOfferPage.images.mainImage")}
                  selectedFile={files.mainImage}
                  onChange={(e) =>
                    setFiles({ ...files, mainImage: e.target.files[0] })
                  }
                />
              </div>

              {/* MULTI IMAGES */}
              <div>
                <Fileinput
                  label={t("addOfferPage.images.images")}
                  multiple
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files || []);
                    setFiles({
                      ...files,
                      images: [...files.images, ...newFiles],
                    });
                  }}
                />

                <div className="mt-2 space-y-2">
                  {files.images.map((file, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-slate-50 p-2 rounded"
                    >
                      <span className="text-sm">{file.name}</span>
                      <button
                        onClick={() =>
                          setFiles({
                            ...files,
                            images: files.images.filter((_, i) => i !== index),
                          })
                        }
                        className="text-red-500 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* DOCUMENT FILES */}
              <div>
                <Fileinput
                  label={t("addOfferPage.documents")}
                  multiple
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files || []);
                    setFiles({
                      ...files,
                      files: [...files.files, ...newFiles],
                    });
                  }}
                />

                <div className="mt-2 space-y-2">
                  {files.files.map((file, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-slate-50 p-2 rounded"
                    >
                      <span className="text-sm">{file.name}</span>
                      <button
                        onClick={() =>
                          setFiles({
                            ...files,
                            files: files.files.filter((_, i) => i !== index),
                          })
                        }
                        className="text-red-500 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* VIDEO FILES */}
              <div>
                <Fileinput
                  label={t("addOfferPage.videoFiles")}
                  multiple
                  accept="video/*"
                  onChange={(e) => {
                    const newFiles = Array.from(e.target.files || []);
                    setFiles({
                      ...files,
                      videoFiles: [...files.videoFiles, ...newFiles],
                    });
                  }}
                />

                <div className="mt-2 space-y-2">
                  {files.videoFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-slate-50 p-2 rounded"
                    >
                      <span className="text-sm">{file.name}</span>
                      <button
                        onClick={() =>
                          setFiles({
                            ...files,
                            videoFiles: files.videoFiles.filter(
                              (_, i) => i !== index,
                            ),
                          })
                        }
                        className="text-red-500 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </>
  );
}
