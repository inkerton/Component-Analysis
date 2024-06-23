import { format } from "date-fns";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";

import React, { useEffect, useMemo, useState } from "react";
import { useDeleteSbomByIdMutation, useGetSbomsQuery } from "../../../redux/services/api/SbomApi";
import { useNavigate } from "react-router";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import trash from "../../../assets/svgs/trash.svg";

const SbomTable = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  const { data: tableData, isLoading, isSuccess, isError } = useGetSbomsQuery();
  const [deleteSbom, { isSuccess: deleteSuccess, isLoading: deleteLoading, isError: deleteError, error }] =
    useDeleteSbomByIdMutation();

  useEffect(() => {
    console.log("Am here");
    if (isSuccess && !isLoading && !isError) {
      setData(tableData);
    }
  }, [isSuccess, isLoading, isError, tableData]);

  useEffect(() => {
    if (deleteSuccess && !deleteError && !deleteLoading) {
      toast.success("Sbom deleted successfully");
    }
    if (deleteError && !deleteLoading) {
      toast.error(`${error?.data?.message || "something went wrong"}`);
    }
  }, [deleteSuccess, deleteError, deleteLoading, error?.data?.message]);

  const handleDelete = async (sbomId) => {
    try {
      console.log(sbomId);
      await deleteSbom(sbomId);
    } catch (error) {
      console.log(error);
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 150,
      },
      {
        accessorKey: "format",
        header: "Format",
        size: 150,
      },
      {
        accessorKey: "language",
        header: "Language",
        size: 200,
      },
      {
        accessorFn: (row) => format(new Date(row.createdAt), "yyyy-MM-dd"),
        header: "Generated On",
        size: 50,
      },
      {
        accessorKey: "action",
        header: "Action",
        Cell: ({ cell }) => {
          const sbomId = cell.row.original._id;
          return (
            <div className="flex justify-center" >
              <div className="" >
              <button 
                type="button" 
                class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 dark:shadow-lg dark:shadow-red-150/80 font-medium rounded-lg text-sm px-3 py-1 text-center me-2 "
                style={{backgroundColor: "#ffffff"}}
                onClick={(e) => {
                  handleDelete(sbomId);
                  e.stopPropagation();
                }}
              >
                Delete
              </button>

              </div>
            </div>
          );
        },
        size: 50,
      },
    ],
    []
  );

  // Add striped rows
  const table = useMaterialReactTable({
    columns,
    data,

    muiTableBodyProps: {
      sx: {
        '& tr:nth-of-type(odd)': { 
          backgroundColor: '#f5f5f5'
        }
      }
    },


    muiTableBodyRowProps: ({row}) => ({
      // Add row click handling 
      onClick: (event) => {
        console.info(row.original._id);
        const sbomId = row.original?._id;
        if (sbomId) {
          navigate(`/sbom/${sbomId}`);
        }
      },
      sx: {
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: '#eee' 
        }
      }
    }),

    muiTableProps: {
      sx: {
        // Custom table styles  
        borderCollapse: 'collapse',
        width: '100%',
        border: '1px solid #ddd',
        borderRadius: 4,
        boxShadow: '0px 2px 10px #ddd',

        // Header styling
        '& .MuiTableCell-head': {
          backgroundColor: '#798bff',
          color: 'white',
          fontWeight: 'bold',
          border: '1px solid #ddd',
          padding: '8px',
        },

        // Cell styling
        '& .MuiTableCell-body': {
          border: '1px solid #ddd',
          padding: '8px',
        },

        // Hover effect for rows
        '& .MuiTableRow-root:hover': {
          backgroundColor: '#eee',
        },
        '& .MuiTableRow-root:nth-child(odd)': {
          backgroundColor: '#f9f9f9 !important',
        },
      }
    }
  })

  return (
    <MaterialReactTable 
      table={table}
    />
  )
};

export default SbomTable;
