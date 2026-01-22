"use client";

import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import { GridIcon, Loader2, RowsIcon } from "lucide-react";
import Image from "next/image";
import UploadButton from "./upload-button";
import FileCard from "./file-card";
import { useState } from "react";
import { SearchBar } from "./search-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataTable from "./file-table";
import { columns } from "./columns";

function Placeholder() {
  return (
    <div className="flex flex-col gap-8 w-full items-center mt-24">
      <Image
        src="/empty.svg"
        width="300"
        height="300"
        alt="an image of a picture and directory icon"
      />
      <div className="text-2xl">You have no files, upload one now</div>
      <UploadButton />
    </div>
  );
}

function FileBrowser({
  tittle,
  favoritesOnly,
  deletedOnly,
}: {
  tittle: string;
  favoritesOnly?: boolean;
  deletedOnly?: boolean;
}) {
  const user = useUser();
  const organization = useOrganization();
  const [query, setQuery] = useState("");

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization?.organization?.id ?? user.user?.id;
  }

  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : "skip",
  );

  const files = useQuery(
    api.files.getFiles,
    orgId ? { orgId, query, favorites: favoritesOnly, deletedOnly } : "skip",
  );
  const isLoading = files === undefined;

  const modifiedFiles =
    files?.map((file) => ({
      ...file,
      isFavorited: (favorites ?? []).some(
        (favorite) => favorite.fileId === file._id,
      ),
    })) ?? [];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">{tittle}</h1>

        <SearchBar setQuery={setQuery} />

        <UploadButton />
      </div>

      <Tabs defaultValue="grid">
        <TabsList className="mb-2">
          <TabsTrigger value="grid" className="flex gap-2 items-center">
            <GridIcon />
            Grid
          </TabsTrigger>
          <TabsTrigger value="table" className="flex gap-2 items-center">
            <RowsIcon /> Table
          </TabsTrigger>
        </TabsList>

        {isLoading && (
          <div className="flex flex-col gap-8 w-full items-center mt-24">
            <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
            <div className="text-2xl">Loading your files...</div>
          </div>
        )}

        <TabsContent value="grid">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {modifiedFiles?.map((file) => {
              return <FileCard key={file._id} file={file} />;
            })}
          </div>
        </TabsContent>
        <TabsContent value="table">
          {" "}
          <DataTable columns={columns} data={modifiedFiles} />
        </TabsContent>
      </Tabs>

      {files?.length === 0 && <Placeholder />}
    </div>
  );
}

export default FileBrowser;
