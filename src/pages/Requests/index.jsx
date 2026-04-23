import React, { useEffect, useMemo, useState } from "react";

import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import GlobalFilter from "../table/react-tables/GlobalFilter";
import { useNavigate } from "react-router-dom";
import Button from "@/components/ui/Button";
import Dropdown from "@/components/ui/Dropdown";
import { MenuItem } from "@headlessui/react";
import ListLoading from "@/components/skeleton/ListLoading";
import DeleteModal from "@/components/DeleteModal";

import {
  useDeleteRequestMutation,
  useGetRequestsQuery,
} from "@/store/api/Requests/RequestApi";
import { useTranslation } from "react-i18next";

const actions = [
  { name: "view", icon: "heroicons-outline:eye" },
  { name: "edit", icon: "heroicons:pencil-square" },
];

const RequestsPage = () => {
  const { t } = useTranslation();
  const { data, error, isLoading, isSuccess, refetch } = useGetRequestsQuery();
  const navigate = useNavigate();

  const [
    deleteRequest,
    {
      isLoading: isDeleting,
      isError,
      error: deleteError,
      isSuccess: isDeleteSuccess,
      reset,
    },
  ] = useDeleteRequestMutation();

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    if (isSuccess) console.log("Requests Data:", data);
    if (error) console.log("Requests error:", error);
  }, [data, isSuccess, error]);

  const handleDelete = async () => {
    try {
      if (selectedRows.length > 0) {
        await Promise.all(selectedRows.map((id) => deleteRequest(id).unwrap()));
      } else if (selectedRequest?._id) {
        await deleteRequest(selectedRequest._id).unwrap();
      }

      refetch();
      setIsDeleteModalOpen(false);
      setSelectedRequest(null);
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

  // Transform data
  const tableData = useMemo(() => {
    if (!data?.data) return [];

    return data.data.map((req) => ({
      _id: req._id,
      requestNumber: req.requestNumber,
      customerName: req.customer?.name,
      phone: req.customer?.phone,
      estateType: req.requirements?.estateTypes?.[0],
      processType: req.requirements?.processType,
      city: req.requirements?.city,
      minPrice: req.requirements?.price?.minUSD,
      maxPrice: req.requirements?.price?.maxUSD,
    }));
  }, [data]);

  const columns = useMemo(
    () => [
      {
        id: "selection",
        Cell: ({ row }) => (
          <input
            type="checkbox"
            className="table-checkbox cursor-pointer"
            checked={selectedRows.includes(row.original._id)}
            onChange={() => toggleRow(row.original._id)}
          />
        ),
      },

      { Header: "Request Number", accessor: "requestNumber" },
      { Header: "Customer Name", accessor: "customerName" },
      { Header: "Phone", accessor: "phone" },
      { Header: "Property Type", accessor: "estateType" },
      { Header: "Operation Type", accessor: "processType" },
      { Header: "City", accessor: "city" },

      {
        Header: "Price",
        Cell: ({ row }) =>
          `${row.original.minPrice || 0} - ${row.original.maxPrice || 0} USD`,
      },

      {
        Header: "Actions",
        Cell: ({ row }) => {
          const request = row.original;

          return (
            <Dropdown
              label={<Icon icon="heroicons-outline:dots-vertical" />}
              classMenuItems="absolute right-0 w-[160px] top-full mt-1 z-[99999]"
            >
              {actions.map((item, i) => (
                <MenuItem key={i}>
                  <div
                    className="w-full px-4 py-2 text-sm cursor-pointer flex space-x-2 items-center"
                    onClick={() => {
                      if (item.name === "edit")
                        navigate(`/Requests/edit/${request._id}`);
                      else if (item.name === "view")
                        navigate(`/Requests/view/${request._id}`);
                      else if (item.name === "delete") {
                        setSelectedRequest(request);
                        setIsDeleteModalOpen(true);
                      }
                    }}
                  >
                    <Icon icon={item.icon} />
                    <span>{item.name}</span>
                  </div>
                </MenuItem>
              ))}
            </Dropdown>
          );
        },
      },
    ],
    [selectedRows, navigate],
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
        <ListLoading count={6} />
      </Card>
    );

  if (error) return <div>Error loading requests</div>;

  return (
    <Card noBorder>
      <div className="md:flex justify-between items-center mb-6">
        <h4 className="card-title">Requests</h4>

        <div className="flex space-x-3 items-center">
          <GlobalFilter
            filter={globalFilter}
            setFilter={setGlobalFilter}
            t={t}
          />

          <Button
            text="Add Request"
            icon="heroicons-outline:plus"
            className="btn-dark"
            onClick={() => navigate("/requests/add")}
          />

          {selectedRows.length > 0 && (
            <Button
              text="Delete Selected"
              icon="heroicons-outline:trash"
              className="btn-danger"
              onClick={() => {
                setSelectedRequest({ _id: null });
                setIsDeleteModalOpen(true);
              }}
            />
          )}
        </div>
      </div>

      <div className="-mx-6">
        <table {...getTableProps()} className="min-w-full divide-y">
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
                <tr {...row.getRowProps()} className="hover:bg-slate-200">
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

      <div className="flex justify-between mt-6 items-center">
        <span>
          Page {pageIndex + 1} of {pageOptions.length}
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
            ? "Multiple Requests"
            : selectedRequest?.requestNumber
        }
      />
    </Card>
  );
};

export default RequestsPage;
