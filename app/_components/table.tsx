"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "./checkbox";
import { CopyIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import useViewportHeightLeft from "./viewport_height";
import { useRouter } from "next/navigation";
import Image from "next/image";

export interface SimpleColumnDef<T> {
  header: React.ReactNode;
  accessorKey?: keyof T;
  cell?: (value: T[keyof T] | undefined, row: T) => React.ReactNode;
  className?: string;
  size?: number;
  disableSorting?: boolean;
  allowCopy?: boolean;
  linkPattern?: string;
}

interface TableProps<T> {
  data: T[];
  columns: SimpleColumnDef<T>[];
  allowOrderBy?: boolean;
  orderBy?: string | null;
  onOrderByChange?: (key: string) => void;
  allowRowSelection?: boolean;
  onSelectedRowIndicesChange?: (indices: number[]) => void;
}

export function DataGridShadcn<T extends Record<string, unknown>>({
  data,
  columns,
  allowOrderBy = false,
  orderBy = null,
  onOrderByChange = () => {},
  allowRowSelection = false,
  onSelectedRowIndicesChange = () => {},
}: TableProps<T>) {
  const router = useRouter();
  const tableRef = useRef<HTMLDivElement>(null);
  const { height: tableHeight } = useViewportHeightLeft(tableRef);

  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [isDescSort, setIsDescSort] = useState<boolean>(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const rowBackgroundGroups = useMemo(() => {
    const groups: Record<number, number> = {};
    if (!sortColumn || !data.length) return groups;

    let currentGroupValue: unknown = null;
    let groupIndex = 0;

    data.forEach((row, index) => {
      const value = row[sortColumn as keyof T];
      if (index === 0) {
        currentGroupValue = value;
      } else if (value !== currentGroupValue) {
        currentGroupValue = value;
        groupIndex = 1 - groupIndex;
      }
      groups[index] = groupIndex;
    });

    return groups;
  }, [data, sortColumn]);

  useEffect(() => {
    if (!allowOrderBy || !orderBy) return;
    const isDesc = orderBy.startsWith("-");
    const columnId = isDesc ? orderBy.substring(1) : orderBy;
    setSortColumn(columnId);
    setIsDescSort(isDesc);
  }, [orderBy, allowOrderBy]);

  useEffect(() => {
    onSelectedRowIndicesChange(selectedRows);
  }, [selectedRows, onSelectedRowIndicesChange]);

  const handleRowSelection = (rowIndex: number) => {
    setSelectedRows((prev) =>
      prev.includes(rowIndex)
        ? prev.filter((r) => r !== rowIndex)
        : [...prev, rowIndex]
    );
  };

  return (
    <div
      ref={tableRef}
      className="rounded-md border bg-white overflow-auto"
      style={{ height: tableHeight }}
    >
      <Table>
        <TableHeader className="border-b border-slate-200">
          <TableRow className="h-16">
            {allowRowSelection && (
              <TableHead className="h-16 px-4 w-[50px]">
                <Checkbox
                  onClick={() => {
                    setSelectedRows((prev) =>
                      prev.length === data.length
                        ? []
                        : data.map((_, index) => index)
                    );
                  }}
                />
              </TableHead>
            )}
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={cn("h-16 p-0")}
                style={{
                  width: column.size,
                  minWidth: column.size,
                  maxWidth: column.size,
                  fontWeight: sortColumn === column.accessorKey ? 600 : "normal",
                }}
              >
                <div className="flex items-center px-4 py-2 gap-1">
                  <div className={cn("truncate", allowOrderBy && !column.disableSorting && "cursor-pointer")}>
                    {column.header}
                  </div>
                  {allowOrderBy && !column.disableSorting && column.accessorKey && (
                    <div className="flex flex-col items-center justify-center w-[30px]">
                      <button
                        onClick={() => onOrderByChange(column.accessorKey as string)}
                        className={cn(
                          "h-4 w-4 transition-opacity",
                          sortColumn === column.accessorKey && !isDescSort
                            ? "opacity-100"
                            : "opacity-30 hover:opacity-75"
                        )}
                      >
                        <Image src="/icons/sort-up.svg" alt="" width={20} height={20} />
                      </button>
                      <button
                        onClick={() => onOrderByChange("-" + String(column.accessorKey))}
                        className={cn(
                          "h-4 w-4 transition-opacity",
                          sortColumn === column.accessorKey && isDescSort
                            ? "opacity-100"
                            : "opacity-30 hover:opacity-75"
                        )}
                      >
                        <Image src="/icons/sort-down.svg" alt="" width={20} height={20} />
                      </button>
                    </div>
                  )}
                </div>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length ? (
            data.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={cn(
                  "h-16",
                  selectedRows.includes(rowIndex) && "bg-LIGHTORANGE",
                  sortColumn &&
                    !selectedRows.includes(rowIndex) &&
                    rowBackgroundGroups[rowIndex] === 0 &&
                    "bg-GREY bg-opacity-10"
                )}
              >
                {allowRowSelection && (
                  <TableCell className="h-16 px-4 w-[50px]">
                    <Checkbox
                      checked={selectedRows.includes(rowIndex)}
                      onClick={() => handleRowSelection(rowIndex)}
                    />
                  </TableCell>
                )}
                {columns.map((column, colIndex) => {
                  const cellValue = column.accessorKey
                    ? row[column.accessorKey]
                    : undefined;
                  return (
                    <TableCell
                      key={colIndex}
                      className={cn("px-4 py-2", column.className)}
                      style={{
                        width: column.size,
                        minWidth: column.size,
                        maxWidth: column.size,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "truncate",
                            column.linkPattern && "cursor-pointer text-ORANGE2 underline"
                          )}
                          onClick={() => {
                            if (column.linkPattern && cellValue !== undefined) {
                              const url = column.linkPattern.replace(
                                "{{value}}",
                                String(cellValue)
                              );
                              router.push(url);
                            }
                          }}
                        >
                          {column.cell
                            ? column.cell(cellValue, row)
                            : String(cellValue ?? "")}
                        </div>
                        {column.allowCopy && (
                          <CopyIcon
                            size={14}
                            className="text-ORANGE2 cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(String(cellValue ?? ""));
                              toast.success("Copied to clipboard");
                            }}
                          />
                        )}
                      </div>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-10">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default DataGridShadcn;
