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
            {t("offersPage.viewOnMap")}
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
          <table
            {...getTableProps()}
            className="min-w-full divide-y divide-slate-100"
          >
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
