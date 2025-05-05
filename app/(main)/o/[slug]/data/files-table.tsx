"use client";

import { formatDistanceToNow } from "date-fns";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import CONNECTOR_MAP from "@/lib/connector-map";
import { getStatusDisplayName } from "@/lib/utils";

import ManageFileMenu from "./manage-file-menu";

interface Props {
  tenant: {
    id: string;
    slug: string;
  };
  initialFiles: any[];
}

export default function FilesTable({ tenant, initialFiles }: Props) {
  const [files, setFiles] = useState(initialFiles);
  const [currentPage, setCurrentPage] = useState(1); // basic pagination
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const ITEMS_PER_PAGE = 12; // basic pagination

  useEffect(() => {
    const checkFilesStatus = async () => {
      try {
        const response = await fetch("/api/tenants/current/documents", {
          headers: { tenant: tenant.slug },
        });
        const data = await response.json();

        if (data.documents) {
          setFiles(data.documents);

          // Check if any files are still processing
          const hasProcessingFiles = data.documents.some(
            (file: any) => file.status !== "ready" && file.status !== "failed",
          );

          // If no more processing files, clear the interval
          if (!hasProcessingFiles && intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    // Initial check for processing files
    const hasProcessingFiles = initialFiles.some((file) => file.status !== "ready" && file.status !== "failed");

    // Set up polling if needed
    if (hasProcessingFiles) {
      intervalRef.current = setInterval(checkFilesStatus, 5000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [initialFiles, tenant.slug]);

  //   TODO: implement cursor based pagination
  // TODO: get pages of files from res.result.pagination.nextCursor
  const totalPages = Math.ceil(files.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentFiles = files.slice(startIndex, endIndex);

  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="text-[14px] font-[500] text-[#1D1D1F] pl-1">
          {files.length} {files.length === 1 ? "file" : "files"}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-1 rounded-md ${currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"}`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`p-1 rounded-md ${currentPage === totalPages ? "text-gray-400 cursor-not-allowed" : "text-gray-600 hover:bg-gray-100"}`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[600px]">Name</TableHead>
              <TableHead className="w-[200px]">Connection</TableHead>
              <TableHead className="w-[200px]">Date added</TableHead>
              <TableHead className="w-[200px]">Date modified</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentFiles.map((file) => (
              <TableRow key={file.id}>
                <TableCell className="font-medium flex items-center">
                  <div>{file.name}</div>
                </TableCell>
                <TableCell>
                  {file.metadata.source_type ? (
                    <div className="flex items-center gap-2">
                      <Image
                        src={CONNECTOR_MAP[file.metadata.source_type][1]}
                        alt={CONNECTOR_MAP[file.metadata.source_type][0]}
                        className="mr-1"
                      />
                      {CONNECTOR_MAP[file.metadata.source_type][0]}
                    </div>
                  ) : (
                    "-"
                  )}
                </TableCell>
                <TableCell>{formatDistanceToNow(new Date(file.createdAt), { addSuffix: true })}</TableCell>
                <TableCell>{formatDistanceToNow(new Date(file.updatedAt), { addSuffix: true })}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {file.status !== "ready" && file.status !== "failed" && (
                      <Loader2 className="h-4 w-4 animate-spin text-[#006EDB]" />
                    )}
                    {getStatusDisplayName(file.status)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <ManageFileMenu id={file.id} tenant={tenant} isConnectorFile={!!file.metadata?.source_type} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
