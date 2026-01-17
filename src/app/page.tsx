"use client";

import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

import UploadButton from "./upload-button";
import FileCard from "./file-card";

function Home() {
  const user = useUser();
  const organization = useOrganization();

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization?.organization?.id ?? user.user?.id;
  }

  const files = useQuery(api.files.getFiles, orgId ? { orgId } : "skip");

  return (
    <main className="container min-h-[calc(100vh-61px)] mx-auto py-12">
      <div>
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Your Files</h1>

          <UploadButton />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {files?.map((file) => (
          <FileCard key={file._id} file={file} />
        ))}
      </div>
    </main>
  );
}

export default Home;
