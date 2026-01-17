"use client";

import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import UploadButton from "./upload-button";
import FileCard from "./file-card";
import { Loader2 } from "lucide-react";
import Image from "next/image";

function Home() {
  const user = useUser();
  const organization = useOrganization();

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization?.organization?.id ?? user.user?.id;
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");
  const isLoading = files === undefined;

  return (
    <main className="container min-h-[calc(100vh-61px)] mx-auto py-12">
      {isLoading && (
        <div className="flex flex-col gap-8 w-full items-center mt-24">
          <Loader2 className="h-32 w-32 animate-spin text-gray-500" />
          <div className="text-2xl">Loading your files...</div>
        </div>
      )}

      {!isLoading && files.length === 0 && (
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
      )}

      {!isLoading && files.length > 0 && (
        <>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Your Files</h1>

            <UploadButton />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
            {files?.map((file) => (
              <FileCard key={file._id} file={file} />
            ))}
          </div>
        </>
      )}
    </main>
  );
}

export default Home;
