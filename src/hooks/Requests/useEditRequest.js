import { useEffect, useState } from "react";
import {
  useGetRequestByIdQuery,
  useUpdateRequestMutation,
} from "@/store/api/Requests/RequestApi";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

export const useEditRequest = () => {
  const { id } = useParams();
  const navigation = useNavigate();

  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const openMapModal = () => setIsMapOpen(true);
  const closeMapModal = () => setIsMapOpen(false);

  // 🔥 fetch
  const { data, isLoading: isFetching } = useGetRequestByIdQuery(id);
  console.log(data);

  // 🔥 update
  const [updateRequest, { isLoading: isUpdating }] = useUpdateRequestMutation();

  const [formData, setFormData] = useState({
    requestNumber: "",

    customer: {
      name: "",
      email: "",
      phone: "",
    },
    requirements: {
      processType: "",
      estateTypes: [],
      city: "",
      neighborhood: "",
      minRooms: "",
      maxRooms: "",
      minSpace: "",
      maxSpace: "",
      price: {
        minUSD: "",
        maxUSD: "",
        minSYP: "",
        maxSYP: "",
      },
    },
  });

  const [errors, setErrors] = useState({});

  // 🧠 fill form (مرة وحدة فقط)
  useEffect(() => {
    if (data && !isInitialized) {
      const req = data.data || data;

      setFormData({
        requestNumber: req.requestNumber || "",
        customer: {
          name: req.customer?.name || "",
          email: req.customer?.email || "",
          phone: req.customer?.phone || "",
        },
        requirements: {
          processType: req.requirements?.processType || "",
          estateTypes: req.requirements?.estateTypes || [],
          city: req.requirements?.city || "",
          neighborhood: req.requirements?.neighborhood || "",
          minRooms: req.requirements?.minRooms || "",
          maxRooms: req.requirements?.maxRooms || "",
          minSpace: req.requirements?.minSpace || "",
          maxSpace: req.requirements?.maxSpace || "",
          price: {
            minUSD: req.requirements?.price?.minUSD || "",
            maxUSD: req.requirements?.price?.maxUSD || "",
            minSYP: req.requirements?.price?.minSYP || "",
            maxSYP: req.requirements?.price?.maxSYP || "",
          },
        },
      });

      setIsInitialized(true);
    }
  }, [data, isInitialized]);

  // نفس handleChange
  const handleChange = (path) => (e) => {
    const value = e.target.value;

    setFormData((prev) => {
      const keys = path.split(".");
      const newData = { ...prev };
      let current = newData;

      keys.forEach((key, i) => {
        if (i === keys.length - 1) {
          current[key] = value;
        } else {
          current[key] = current[key] || {};
          current = current[key];
        }
      });

      return newData;
    });
  };

  const validate = () => {
    const newErrors = {};

    const requiredFields = [
      {
        key: "requestNumber",
        value: formData.requestNumber,
        label: "Request Number",
      },

      {
        key: "estateTypes",
        value: formData.requirements.estateTypes?.length > 0,
        label: "Property Type",
      },

      {
        key: "processType",
        value: formData.requirements.processType,
        label: "Operation Type",
      },

      {
        key: "city",
        value: formData.requirements.city,
        label: "City",
      },
    ];

    for (const field of requiredFields) {
      const isEmpty =
        field.value === undefined ||
        field.value === null ||
        field.value === "" ||
        field.value === false;

      if (isEmpty) {
        newErrors[field.key] = `${field.label} is required`;
      }
    }

    setErrors(newErrors);

    const firstError = Object.values(newErrors)[0];

    if (firstError) {
      toast.error(firstError);
      return false;
    }

    return true;
  };

  // submit update
  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = new FormData();

    Object.keys(formData.customer).forEach((key) => {
      payload.append(`customer[${key}]`, formData.customer[key]);
    });

    Object.keys(formData.requirements).forEach((key) => {
      if (key === "price") {
        Object.keys(formData.requirements.price).forEach((p) => {
          payload.append(
            `requirements[price][${p}]`,
            formData.requirements.price[p],
          );
        });
      } else if (Array.isArray(formData.requirements[key])) {
        formData.requirements[key].forEach((val) => {
          payload.append(`requirements[${key}][]`, val);
        });
      } else {
        payload.append(`requirements[${key}]`, formData.requirements[key]);
      }
    });

    try {
      await updateRequest({ id, data: formData }).unwrap();
      toast.success("Request updated successfully");
      setTimeout(() => {
        navigation("/Requests");
      }, 0);
    } catch (err) {
      console.error(err);
      toast.error("Update failed");
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    errors,
    isLoading: isUpdating || isFetching,
    isMapOpen,
    openMapModal,
    closeMapModal,
  };
};
