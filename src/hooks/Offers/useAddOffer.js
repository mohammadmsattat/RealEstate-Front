import { useState } from "react";
import { useCreateOfferMutation } from "@/store/api/Offers/OffersApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function useAddOffer() {
  const { t } = useTranslation();
  const navigation = useNavigate();

  const [isMapOpen, setIsMapOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    code: "",
    description: "",
    processType: "",
    estateType: "",
    city: "",
    neighborhood: "",
    address: "",
    offerNumber: "",
    staffParcode: "",
    totalSpace: "",
    builtArea: "",
    landArea: "",
    bedrooms: "",
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

    currency: "",
    paymentType: "",
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

    areaUnit: "",

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

  const [errors, setErrors] = useState({});
  const [createOffer, { isLoading, isSuccess }] = useCreateOfferMutation();

  const numberFields = [
    "totalSpace",
    "builtArea",
    "landArea",
    "bathrooms",
    "floorNumber",
    "totalFloors",
    "yearBuilt",
    "downPayment",
    "installmentMonths",
    "pricePerMeterFrom",
    "pricePerMeterTo",
  ];

  const handleChange = (field) => (e) => {
    let value = e.target.value;
    console.log(field, e.target?.value, e);
    if (numberFields.includes(field)) {
      if (value === "") {
        value = "";
      } else {
        value = Number(value);

        if (value < 0) value = 0;
      }
    }

    // حذف الخطأ مباشرة عند التعديل
    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));

    if (field.includes(".")) {
      const [parent, child] = field.split(".");

      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
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
    setFeatures((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const setLatLng = (latlng) => {
    setFormData((prev) => ({
      ...prev,
      location: { lat: latlng.lat, lng: latlng.lng },
    }));
  };

  // 🔥 🔥 🔥 TRANSFORM LAYER
  const buildPayload = () => {
    return {
      ...formData,

      //  إصلاح rooms
      rooms: Number(formData.bedrooms) || 0,
      offerNumber: formData.offerNumber || undefined,
      staffParcode: formData.staffParcode || undefined,
      //  تحويل الأرقام
      totalSpace: Number(formData.totalSpace) || 0,
      builtArea: Number(formData.builtArea) || 0,
      landArea: Number(formData.landArea) || 0,
      bathrooms: Number(formData.bathrooms) || 0,

      floorNumber: formData.floorNumber ? Number(formData.floorNumber) : null,

      totalFloors: formData.totalFloors ? Number(formData.totalFloors) : null,

      yearBuilt: formData.yearBuilt ? Number(formData.yearBuilt) : null,
      OwnershipType: formData.OwnershipType ? formData.OwnershipType : null,
      propertyCondition: formData.propertyCondition,
      downPayment: Number(formData.downPayment) || 0,
      installmentMonths: Number(formData.installmentMonths) || 0,

      pricePerMeterFrom: formData.pricePerMeterFrom
        ? Number(formData.pricePerMeterFrom)
        : null,

      pricePerMeterTo: formData.pricePerMeterTo
        ? Number(formData.pricePerMeterTo)
        : null,

      //  price object
      price: {
        minSYP: Number(formData.price.minSYP) || 0,
        maxSYP: Number(formData.price.maxSYP) || 0,
        minUSD: Number(formData.price.minUSD) || 0,
        maxUSD: Number(formData.price.maxUSD) || 0,
      },

      //  features
      // features: features,

      // حذف UI فقط
      bedrooms: undefined,
    };
  };

  const validateRequiredFields = () => {
    const newErrors = {};

    const requiredFields = [
      {
        key: "city",
        value: formData.city,
        label: t("validation.fields.city"),
      },

      {
        key: "processType",
        value: formData.processType,
        label: t("validation.fields.operationType"),
      },
      {
        key: "estateType",
        value: formData.estateType,
        label: t("validation.fields.estateType"),
      },

      {
        key: "code",
        value: formData.code,
        label: t("validation.fields.code"),
      },

      {
        key: "map",
        value: formData.location.lat && formData.location.lng,
        label: t("validation.fields.map"),
      },
    ];

    for (const field of requiredFields) {
      const isEmpty =
        field.value === undefined || field.value === null || field.value === "";

      if (isEmpty) {
        newErrors[field.key] = t("validation.required", {
          field: field.label,
        });
      }
    }

    setErrors(newErrors);

    // أول خطأ فقط toast
    const firstError = Object.values(newErrors)[0];

    if (firstError) {
      toast.error(firstError);
      return false;
    }

    return true;
  };
  console.log(formData.propertyType);

  const handleSubmit = async () => {
    if (!validateRequiredFields()) return;
    console.log("Payload before transformation:", buildPayload());
    const payload = buildPayload();
    const form = new FormData();

    Object.keys(payload).forEach((key) => {
      const value = payload[key];

      if (value === undefined || value === null || value === "") return;

      if (key === "location") {
        form.append("location[lat]", value.lat);
        form.append("location[lng]", value.lng);
      } else if (key === "price") {
        Object.keys(value).forEach((p) => {
          form.append(`price[${p}]`, value[p]);
        });
      } else if (key === "features") {
        Object.keys(value).forEach((f) => {
          form.append(`features[${f}]`, String(value[f]));
        });
      } else if (key === "nearbyPlaces") {
        Object.keys(value).forEach((n) => {
          form.append(`nearbyPlaces[${n}]`, value[n]);
        });
      } else if (Array.isArray(value)) {
        value.forEach((v) => form.append(key, v));
      } else if (typeof value === "object") {
        Object.keys(value).forEach((k) => {
          form.append(`${key}[${k}]`, value[k]);
        });
      } else {
        form.append(key, value);
      }
    });

    // ✅ files
    if (files.mainImage) form.append("mainImage", files.mainImage);
    files.images.forEach((f) => form.append("images", f));
    files.files.forEach((f) => form.append("files", f));
    files.videoFiles.forEach((f) => form.append("videoFiles", f));

    try {
      await createOffer(form).unwrap();
      toast.success("Offer added successfully");
      setTimeout(() => {
        navigation("/offers");
      }, 1200);
    } catch (err) {
      toast.error("Failed to add offer");
      console.error(err);
    }
  };

  return {
    t,
    formData,
    features,
    files,
    errors,
    isLoading,
    isSuccess,
    setFiles,
    handleChange,
    handleFeature,
    setLatLng,

    handleSubmit,

    isMapOpen,
    setIsMapOpen,
    openMapModal: () => setIsMapOpen(true),
    closeMapModal: () => setIsMapOpen(false),
  };
}
