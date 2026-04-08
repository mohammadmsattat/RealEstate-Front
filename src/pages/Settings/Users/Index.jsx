// src/pages/UsersPage.js
import React, { useMemo } from "react";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import ListLoading from "@/components/skeleton/ListLoading";
import GlobalFilter from "@/pages/table/react-tables/GlobalFilter";
import { useGetUsersQuery } from "@/store/api/auth/UsersApi";

const UsersPage = () => {
  const { data, error, isLoading, isSuccess } = useGetUsersQuery();
console.log(error);
console.log(data);

  // تحويل البيانات لتلائم جدول React Table
  const tableData = useMemo(() => {
    if (!data?.data) return [];
    return data.data.map((user) => ({
      _id: user._id,
      username: user.username,
      role: user.role?.name || "N/A", // assuming role has a "name" property
      status: user.status,
    }));
  }, [data]);

  const columns = useMemo(
    () => [
      { Header: "Username", accessor: "username" },
      { Header: "Role", accessor: "role" },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ value }) => (
          <span
            className={`inline-block px-3 py-1 rounded-full ${
              value === "active"
                ? "bg-green-100 text-green-600"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {value}
          </span>
        ),
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="relative z-50">
            <button className="text-blue-600 hover:underline">
              View
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const tableInstance = useTable(
    { columns, data: tableData },
    useGlobalFilter,
    usePagination
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
          <h4 className="card-title">Users Table</h4>
        </div>
        <ListLoading count={6} />
      </Card>
    );

  if (error) return <div>Error loading users</div>;

  return (
    <Card noBorder>
      <div className="md:flex justify-between items-center mb-6">
        <h4 className="card-title">Users Table</h4>
        <div className="flex space-x-3 items-center">
          <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
        </div>
      </div>

      <div className="-mx-6">
        <div className="inline-block min-w-full align-middle">
          <table {...getTableProps()} className="min-w-full divide-y divide-slate-100">
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
                  <tr {...row.getRowProps()} className="hover:bg-slate-100 transition-colors">
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
    </Card>
  );
};

export default UsersPage;