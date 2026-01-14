"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";

function Home() {
  const files = useQuery(api.files.getFiles);
  const createFile = useMutation(api.files.createFile);

  return (
    <div>
      <Button onClick={() => createFile({ name: "Hello World" })}>
        Click Me
      </Button>
      {files && <p>Files: {files.length}</p>}
    </div>
  );
}

export default Home;
