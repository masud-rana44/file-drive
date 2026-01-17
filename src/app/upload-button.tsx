"use client";

import { z } from "zod";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const formSchema = z.object({
  tittle: z.string().min(1).max(200),
  file: z
    .custom<FileList>((val) => val instanceof FileList)
    .refine((files) => files.length > 0, "required"),
});

function UploadButton() {
  const user = useUser();
  const organization = useOrganization();
  const [isFileDialogOpen, setIsFileDialogOpen] = useState(false);

  let orgId: string | undefined = undefined;
  if (organization.isLoaded && user.isLoaded) {
    orgId = organization?.organization?.id ?? user.user?.id;
  }

  const createFile = useMutation(api.files.createFile);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tittle: "",
      file: undefined,
    },
  });

  const fileRef = form.register("file");

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!orgId) return;

    const postUrl = await generateUploadUrl();

    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": values.file[0]!.type },
      body: values.file[0],
    });

    const { storageId } = await result.json();

    try {
      await createFile({
        name: values.tittle,
        orgId,
        fileId: storageId,
      });

      form.reset();
      setIsFileDialogOpen(false);

      toast.success("File uploaded successfully");
    } catch (error) {
      toast.error("Your file could not be uploaded. Please try again later.");
    }
  }

  return (
    <Dialog
      open={isFileDialogOpen}
      onOpenChange={(isOpen) => {
        setIsFileDialogOpen(isOpen);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button>Upload File</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload your File Here</DialogTitle>
          <DialogDescription>
            This file will be accessible to everyone in you organization
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="tittle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tittle</FormLabel>
                  <FormControl>
                    <Input disabled={form.formState.isSubmitting} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={() => (
                <FormItem>
                  <FormLabel>File</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      disabled={form.formState.isSubmitting}
                      {...fileRef}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="flex items-center gap-2"
            >
              {form.formState.isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              <span>Submit</span>
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default UploadButton;
