import React, { useEffect, useMemo, useState } from "react";
import {
  useGetOffersQuery,
  useDeleteOfferMutation,
} from "@/store/api/Offers/OffersApi";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import GlobalFilter from "../table/react-tables/GlobalFilter";
import { Link, useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import { MenuItem } from "@headlessui/react";
import ListLoading from "@/components/skeleton/ListLoading";
import DeleteModal from "@/components/DeleteModal";
import { useTranslation } from "react-i18next";

const actions = [
  { name: "view", icon: "heroicons-outline:eye" },
  { name: "edit", icon: "heroicons:pencil-square" },
];

const OffersPage = () => {
  const { t } = useTranslation();
  const { data, error, isLoading, isSuccess, refetch } = useGetOffersQuery();
  const navigate = useNavigate();

  const [
    deleteOffer,
    {
      isLoading: isDeleting,
      isError,
      error: deleteError,
      isSuccess: isDeleteSuccess,
      reset,
    },
  ] = useDeleteOfferMutation();

  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    if (isSuccess) console.log("Offers Data:", data);
    if (error) console.log("Offers error:", error);
  }, [data, isSuccess, error]);

  // الحذف (عنصر واحد أو عدة عناصر)
  const handleDelete = async () => {
    try {
      if (selectedRows.length > 0) {
        // حذف كل العناصر المحددة
        await Promise.all(selectedRows.map((id) => deleteOffer(id).unwrap()));
      } else if (selectedOffer?._id) {
        // حذف عنصر واحد
        await deleteOffer(selectedOffer._id).unwrap();
      }

      refetch();
      setIsDeleteModalOpen(false);
      setSelectedOffer(null);
      setSelectedRows([]);
      reset();
    } catch (err) {
      console.error(err);
    }
  };

  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const toggleSelectAll = (rows) => {
    const ids = rows.map((r) => r.original._id);
    const allSelected = ids.every((id) => selectedRows.includes(id));
    if (allSelected) {
      setSelectedRows((prev) => prev.filter((id) => !ids.includes(id)));
    } else {
      setSelectedRows((prev) => [...new Set([...prev, ...ids])]);
    }
  };

  const tableData = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((offer) => ({
      _id: offer._id,
      propertyCode: offer.code,
      propertyType: offer.estateType,
      operationType: offer.processType,
      price: offer.price,
      city: offer.city,
    }));
  }, [data]);

  const columns = useMemo(
    () => [
      {
        id: "selection",

        Cell: ({ row }) => (
          <input
            type="checkbox"
            className="table-checkbox"
            checked={selectedRows.includes(row.original._id)}
            onChange={() => toggleRow(row.original._id)}
          />
        ),
      },
      { Header: t("offersPage.code"), accessor: "propertyCode" },
      { Header: t("offersPage.type"), accessor: "propertyType" },
      { Header: t("offersPage.operation"), accessor: "operationType" },
      { Header: t("offersPage.price"), accessor: "price" },
      { Header: t("offersPage.city"), accessor: "city" },
      {
        Header: t("offersPage.map"),
        Cell: ({ row }) => (
          <Link
            to={`/offers/${row.original._id}/map`}
            className="text-blue-600 hover:underline"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={25}
              height={25}
              viewBox="0 0 100 100"
            >
              <path
                fill="currentColor"
                d="m70.387 70l-3.854 7.247l18.87-3.085c-3.808-1.91-8.963-3.275-15.016-4.162m-48.61 1.58C13.037 73.885 7.5 77.662 7.5 83.272a8.4 8.4 0 0 0 .774 3.497l30.285-4.95zM91.79 80l-42.15 6.87l11.116 12.646C79.01 97.881 92.5 92.05 92.5 83.272c0-1.17-.252-2.257-.71-3.271m-49.272 8.055l-28.48 4.655C21.566 97.374 34.853 100 50 100c.918 0 1.815-.026 2.719-.045z"
              ></path>
              <path
                fill="currentColor"
                d="M50.002 0c-16.3 0-29.674 13.333-29.674 29.596c0 6.252 1.987 12.076 5.342 16.865l19.234 33.25l.082.107c.759.991 1.5 1.773 2.37 2.348c.87.576 1.95.92 3.01.814c2.118-.212 3.415-1.708 4.646-3.376l.066-.086l21.234-36.141l.012-.023c.498-.9.866-1.816 1.178-2.708a29.3 29.3 0 0 0 2.17-11.05C79.672 13.333 66.302 0 50.002 0m0 17.045c7.071 0 12.59 5.509 12.59 12.55c0 7.043-5.519 12.55-12.59 12.55c-7.072 0-12.594-5.508-12.594-12.55c0-7.04 5.523-12.55 12.594-12.55"
                color="currentColor"
              ></path>
            </svg>
          </Link>
        ),
      },
      {
        Header: t("offersPage.actionsTitle"),
        Cell: ({ row }) => {
          const offer = row.original;
          return (
            <Dropdown
              label={<Icon icon="heroicons-outline:dots-vertical" />}
              classMenuItems="absolute right-0 w-[160px] top-full mt-1 z-[99999]"
            >
              {actions.map((item, i) => (
                <MenuItem key={i}>
                  <div
                    className={`${
                      item.name === "delete"
                        ? "bg-danger-500/30 text-danger-500 hover:bg-danger-500 hover:text-white"
                        : "hover:bg-slate-900 hover:text-white dark:hover:bg-slate-600/50"
                    } w-full px-4 py-2 text-sm cursor-pointer flex space-x-2 items-center rtl:space-x-reverse`}
                    onClick={() => {
                      if (item.name === "edit")
                        navigate(`/offers/edit/${offer._id}`);
                      else if (item.name === "view")
                        navigate(`/offers/view/${offer._id}`);
                      else if (item.name === "delete") {
                        setSelectedOffer(offer);
                        setIsDeleteModalOpen(true);
                      }
                    }}
                  >
                    <Icon icon={item.icon} />
                    <span>{t(`offersPage.actions.${item.name}`)}</span>
                  </div>
                </MenuItem>
              ))}
            </Dropdown>
          );
        },
      },
    ],
    [selectedRows, t, navigate],
  );

  const tableInstance = useTable(
    { columns, data: tableData },
    useGlobalFilter,
    usePagination,
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    state,
    setGlobalFilter,
    prepareRow,
  } = tableInstance;

  const { globalFilter, pageIndex } = state;

  if (isLoading)
    return (
      <Card noBorder>
        <div className="md:flex justify-between items-center mb-6">
          <h4 className="card-title">{t("offersPage.title")}</h4>
        </div>
        <ListLoading count={6} />
      </Card>
    );

  if (error) return <div>{t("offersPage.errors.load")}</div>;

  return (
    <Card noBorder>
      <div className="md:flex justify-between items-center mb-6">
        <h4 className="card-title">{t("offersPage.title")}</h4>
        <div className="flex space-x-3 items-center">
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
          <Button
            text={t("offersPage.addOffer")}
            icon="heroicons-outline:plus"
            className="btn-dark"
            onClick={() => navigate("/offers/add")}
          />
          {selectedRows.length > 0 && (
            <Button
              text={t("offersPage.deleteSelected")}
              icon="heroicons-outline:trash"
              className="btn-danger"
              onClick={() => {
                setSelectedOffer({ _id: null, propertyCode: "Multiple" });
                setIsDeleteModalOpen(true);
              }}
            />
          )}
        </div>
      </div>

      <div className="-mx-6">
        <div className="inline-block min-w-full align-middle">
          <table {...getTableProps()} className="min-w-full divide-y ">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th {...column.getHeaderProps()} className="table-th">
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    className={`hover:bg-slate-100 transition-colors ${
                      selectedRows.includes(row.original._id)
                        ? "bg-blue-50"
                        : ""
                    }`}
                  >
                    {row.cells.map((cell) => (
                      <td {...cell.getCellProps()} className="table-td">
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-between mt-6 items-center">
        <span className="text-sm">
          {t("offersPage.pagination.page")} {pageIndex + 1} of{" "}
          {pageOptions.length}
        </span>
        <div className="flex space-x-3">
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            <Icon icon="heroicons-outline:chevron-left" />
          </button>
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            <Icon icon="heroicons-outline:chevron-right" />
          </button>
        </div>
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          reset();
        }}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        isError={isError}
        isSuccess={isDeleteSuccess}
        errorMessage={deleteError?.data?.message}
        itemName={
          selectedRows.length > 0
            ? "Multiple Items"
            : selectedOffer?.propertyCode
        }
      />
    </Card>
  );
};

export default OffersPage;
