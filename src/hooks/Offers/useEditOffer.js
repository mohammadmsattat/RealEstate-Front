import { useEffect, useState } from "react";
import {
  useGetOfferByIdQuery,
  useUpdateOfferMutation,
} from "@/store/api/Offers/OffersApi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export function useEditOffer() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [isMapOpen, setIsMapOpen] = useState(false);

  const { data, isLoading } = useGetOfferByIdQuery(id);
  const [updateOffer, { isLoading: isUpdating, isSuccess }] =
    useUpdateOfferMutation();

  // ================= FULL FORM STATE (MATCH ADD HOOK) =================
  const [formData, setFormData] = useState({
    title: "",
    code: "",
    description: "",
    processType: "sale",
    estateType: "house",
    offerNumber: "",
    staffParcode: "",
    city: "",
    neighborhood: "",
    address: "",

    totalSpace: "",
    builtArea: "",
    landArea: "",

    rooms: "",
    bathrooms: "",
    floorNumber: "",
    totalFloors: "",

    OwnershipType: "",

    price: {
      minSYP: "",
      maxSYP: "",
      minUSD: "",
      maxUSD: "",
    },

    pricePerMeterFrom: "",
    pricePerMeterTo: "",

    currency: "USD",
    paymentType: "cash",
    downPayment: "",
    installmentMonths: "",

    propertyCondition: "",
    yearBuilt: "",
    furnishingStatus: "unfurnished",

    agentName: "",
    agentPhone: "",
    agentEmail: "",

    ownerName: "",
    ownerNumber: "",
    partnership: "",

    location: {
      lat: "",
      lng: "",
    },

    areaUnit: "sqm",

    isNegotiable: false,
    shortDescription: "",

    videoUrl: "",
    virtualTourUrl: "",

    listingExpiryDate: "",
    closedDate: "",

    nearbyPlaces: {
      schools: 0,
      hospitals: 0,
      malls: 0,
      restaurants: 0,
      metro: 0,
    },

    directions: [],
    facade: "",
    recordNumber: "",
    parcelNumber: "",
    roofPriority: "",
  });

  const [features, setFeatures] = useState({
    hasBalcony: false,
    hasPool: false,
    hasGarage: false,
    hasAC: false,
    hasSecurity: false,
    hasGarden: false,
    hasParking: false,
    hasStorage: false,
    hasHeating: false,
    hasFurnished: false,
    hasJacuzzi: false,
    hasSauna: false,
    hasGym: false,
    hasSeaView: false,
    hasLandmarkView: false,
    isPetFriendly: false,
  });

  const [files, setFiles] = useState({
    mainImage: null,
    images: [],
    files: [],
    videoFiles: [],
  });

  // ================= HELPERS =================
  const clean = (v) => (v === null || v === undefined ? "" : v);

  // ================= FILL DATA FROM API =================
  useEffect(() => {
    if (!data?.data) return;

    const offer = data.data;

    setFormData({
      title: clean(offer.title),
      code: clean(offer.code),
      description: clean(offer.description),
      processType: clean(offer.processType) || "sale",
      estateType: clean(offer.estateType) || "house",

      city: clean(offer.city),
      neighborhood: clean(offer.neighborhood),
      address: clean(offer.address),

      totalSpace: clean(offer.totalSpace),
      builtArea: clean(offer.builtArea),
      landArea: clean(offer.landArea),
      offerNumber: clean(offer.offerNumber),
      staffParcode: clean(offer.staffParcode),
      rooms: clean(offer.rooms),
      bathrooms: clean(offer.bathrooms),
      floorNumber: clean(offer.floorNumber),
      totalFloors: clean(offer.totalFloors),

      OwnershipType: clean(offer.OwnershipType),

      price: {
        minSYP: offer.price?.minSYP ?? "",
        maxSYP: offer.price?.maxSYP ?? "",
        minUSD: offer.price?.minUSD ?? "",
        maxUSD: offer.price?.maxUSD ?? "",
      },

      pricePerMeterFrom: clean(offer.pricePerMeterFrom),
      pricePerMeterTo: clean(offer.pricePerMeterTo),

      currency: clean(offer.currency) || "USD",
      paymentType: clean(offer.paymentType) || "cash",
      downPayment: clean(offer.downPayment),
      installmentMonths: clean(offer.installmentMonths),

      propertyCondition: clean(offer.propertyCondition),
      yearBuilt: clean(offer.yearBuilt),
      furnishingStatus: clean(offer.furnishingStatus) || "unfurnished",

      agentName: clean(offer.agentName),
      agentPhone: clean(offer.agentPhone),
      agentEmail: clean(offer.agentEmail),

      ownerName: clean(offer.ownerName),
      ownerNumber: clean(offer.ownerNumber),
      partnership: clean(offer.partnership),

      location: {
        lat: offer.location?.lat ?? "",
        lng: offer.location?.lng ?? "",
      },

      areaUnit: clean(offer.areaUnit) || "sqm",
      isNegotiable: offer.isNegotiable ?? false,
      shortDescription: clean(offer.shortDescription),

      videoUrl: clean(offer.videoUrl),
      virtualTourUrl: clean(offer.virtualTourUrl),

      listingExpiryDate: clean(offer.listingExpiryDate),
      closedDate: clean(
        offer.closedDate
          ? new Date(offer.closedDate).toISOString().split("T")[0]
          : "",
      ),

      nearbyPlaces: {
        schools: offer.nearbyPlaces?.schools ?? 0,
        hospitals: offer.nearbyPlaces?.hospitals ?? 0,
        malls: offer.nearbyPlaces?.malls ?? 0,
        restaurants: offer.nearbyPlaces?.restaurants ?? 0,
        metro: offer.nearbyPlaces?.metro ?? 0,
      },

      directions: Array.isArray(offer.directions?.[0])
        ? offer.directions.flat()
        : offer.directions || [],
      facade: clean(offer.facade),
      recordNumber: clean(offer.recordNumber),
      parcelNumber: clean(offer.parcelNumber),
      roofPriority: clean(offer.roofPriority),
    });

    setFeatures(offer.features || {});
  }, [data]);

  // ================= HANDLERS =================
  const handleChange = (field) => (e) => {
    const value = e.target.value;

    if (field.includes(".")) {
      const [parent, child] = field.split(".");

      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value === "" ? "" : Number(value),
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleFeature = (key) => {
    setFeatures((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const setLatLng = (latlng) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        lat: latlng.lat,
        lng: latlng.lng,
      },
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    const form = new FormData();

    Object.keys(formData).forEach((key) => {
      const value = formData[key];

      if (key === "location") {
        form.append("location[lat]", value.lat);
        form.append("location[lng]", value.lng);
        return;
      }

      if (key === "price") {
        Object.keys(value).forEach((p) => {
          form.append(`price[${p}]`, value[p]);
        });
        return;
      }

      if (key === "nearbyPlaces") {
        Object.keys(value).forEach((n) => {
          form.append(`nearbyPlaces[${n}]`, value[n]);
        });
        return;
      }

      if (Array.isArray(value)) {
        value.forEach((v) => form.append(key, v));
        return;
      }

      if (typeof value === "object") {
        Object.keys(value).forEach((k) => {
          form.append(`${key}[${k}]`, value[k]);
        });
        return;
      }

      if (value !== "" && value !== null && value !== undefined) {
        form.append(key, value);
      }
    });

    Object.keys(features).forEach((key) => {
      form.append(`features[${key}]`, String(features[key]));
    });

    if (files.mainImage) form.append("mainImage", files.mainImage);
    files.images.forEach((f) => form.append("images", f));
    files.files.forEach((f) => form.append("files", f));
    files.videoFiles.forEach((f) => form.append("videoFiles", f));

    try {
      await updateOffer({ id, data: form }).unwrap();
      toast.success("Offer updated successfully");
      navigate("/offers");
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    }
  };

  return {
    t,
    formData,
    features,
    files,
    isLoading,
    isSuccess,
    isUpdating,
    handleChange,
    handleFeature,
    setFiles,
    setLatLng,
    handleSubmit,
    isMapOpen,
    setIsMapOpen,
    openMapModal: () => setIsMapOpen(true),
    closeMapModal: () => setIsMapOpen(false),
  };
}
