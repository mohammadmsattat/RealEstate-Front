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

  const openMapModal = () => setIsMapOpen(true);
  const closeMapModal = () => setIsMapOpen(false);

  const { data, isLoading } = useGetOfferByIdQuery(id);
  const [updateOffer] = useUpdateOfferMutation();

  const [formData, setFormData] = useState({
    title: "",
    code: "",
    description: "",
    processType: "sale",
    estateType: "house",
    city: "",
    neighborhood: "",
    address: "",

    totalSpace: "",
    builtArea: "",
    landArea: "",
    bedrooms: "",
    bathrooms: "",
    floorNumber: "",
    totalFloors: "",

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

    propertyCondition: "good",
    yearBuilt: "",
    furnishingStatus: "unfurnished",

    agentName: "",
    agentPhone: "",
    agentEmail: "",

    ownerName: "",
    ownerNumber: "",

    location: { lat: "", lng: "" },

    listingExpiryDate: "",
    closedDate: "",
  });

  const [features, setFeatures] = useState({});
  const [files, setFiles] = useState({
    mainImage: null,
    images: [],
    files: [],
    videoFiles: [],
  });

  // ================= helpers =================
  const clean = (v) => (v === null || v === undefined ? "" : v);

  const isValid = (v) => v !== "" && v !== null && v !== undefined;

  // ================= fill data =================
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
      bedrooms: clean(offer.bedrooms),
      bathrooms: clean(offer.bathrooms),
      floorNumber: clean(offer.floorNumber),
      totalFloors: clean(offer.totalFloors),

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

      propertyCondition: clean(offer.propertyCondition) || "good",
      yearBuilt: clean(offer.yearBuilt),
      furnishingStatus: clean(offer.furnishingStatus) || "unfurnished",

      agentName: clean(offer.agentName),
      agentPhone: clean(offer.agentPhone),
      agentEmail: clean(offer.agentEmail),

      ownerName: clean(offer.ownerName),
      ownerNumber: clean(offer.ownerNumber),

      location: {
        lat: offer.location?.lat ?? "",
        lng: offer.location?.lng ?? "",
      },

      listingExpiryDate: clean(offer.listingExpiryDate),
      closedDate: clean(offer.closedDate),
    });

    setFeatures(offer.features || {});
  }, [data]);

  // ================= handlers =================
  const handleChange = (field) => (e) => {
    const value = e.target.value;

    // دعم nested مثل price.minSYP
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

  // ================= submit =================
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

      if (isValid(value)) {
        form.append(key, value);
      }
    });

    // features
    Object.keys(features).forEach((key) => {
      form.append(`features[${key}]`, String(features[key]));
    });

    // files
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
    handleChange,
    handleFeature,
    setFiles,
    setLatLng,
    handleSubmit,
    isMapOpen,
    setIsMapOpen,
    openMapModal,
    closeMapModal,
  };
}