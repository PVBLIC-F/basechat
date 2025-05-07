"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { MoreHorizontal, Trash } from "lucide-react";
import { Inter } from "next/font/google";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

interface Props {
  id: string;
  tenant: {
    slug: string;
  };
  isConnectorFile: boolean;
  onFileRemoved: (fileId: string) => void;
}

export default function ManageFileMenu({ id, tenant, isConnectorFile, onFileRemoved }: Props) {
  const router = useRouter();

  async function deleteFile() {
    if (isConnectorFile) {
      toast.error("This file is from a connector and cannot be deleted");
      return;
    }

    const toastId = toast.loading("Deleting file...");

    try {
      const res = await fetch(`/api/documents/${id}`, {
        headers: { tenant: tenant.slug },
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete file");

      toast.success("File deleted successfully", {
        id: toastId,
      });
      onFileRemoved(id);
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete file", {
        id: toastId,
      });
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button>
          <MoreHorizontal />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={inter.className}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuItem
                onSelect={deleteFile}
                className={cn(isConnectorFile && "cursor-not-allowed opacity-50")}
              >
                <Trash />
                Delete
              </DropdownMenuItem>
            </TooltipTrigger>
            {isConnectorFile && (
              <TooltipContent>
                <p>This file is from a connector and cannot be deleted.</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
