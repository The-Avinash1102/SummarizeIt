"use client";
import { useUploadThing } from "@/utils/uploadthing";
import UploadFormInput from "./upload-form-input";
import { z } from "zod";
import { generatePdfSummary, storePdfSummaryAction } from "@/actions/upload-action";
import { useRef, useState } from "react";

// Schema
const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid File" })
    .refine((file) => file.size <= 20 * 1024 * 1024, {
      message: "File size should be less than 20 MB",
    })
    .refine(
      (file) => file.type.startsWith("application/pdf"),
      "File must be a pdf"
    ),
});

export default function UploadForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const { startUpload, routeConfig } = useUploadThing("pdfUploader", {
    onClientUploadComplete: () => {
      console.log("upload successfull!");
    },
    onUploadError: (err) => {
      console.error("error occured while uploading file", err);
    },
    onUploadBegin: ({ file }) => {
      console.log("upload has begin for", file);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      const formdata = new FormData(e.currentTarget);
      const file = formdata.get("file") as File;

      // Validating the fields
      const validatedFields = schema.safeParse({ file });

      console.log(validatedFields);

      if (!validatedFields.success) {
        console.log("success");
        console.log(
          validatedFields.error.flatten().fieldErrors.file?.[0] ??
            "Invalid File"
        );
        setIsLoading(false);
        return;
      }
      // schema with zod
      // upload the file to {uploadthing}
      const resp = await startUpload([file]);
      if (!resp) {
        setIsLoading(false);
        return;
      }
      // parse the pdf using langchain

      const result = await generatePdfSummary(resp);

      const { data = null, message = null } = result || {};

      if (data) {

        let storeResult:any;

        console.log("Saving PDF...");

        if (data.summary) {
          storeResult = await storePdfSummaryAction({
            summary:data.summary,
            fileUrl:resp[0].serverData.file.url,
            title:data.title,
            fileName: file.name,
          });
          // save the summary to the database
          
          alert('Your summary has been generated and saved');
                  formRef.current?.reset();


        }
      }
      // summarise the pdf using gemini

      // save the summary to the database
      // redirect to the individual summary page
    } catch (error) {
      setIsLoading(false);
      console.error("Error occured", error);
      formRef.current?.reset();
    }

    console.log("Form submitted");
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <UploadFormInput
        isLoading={isLoading}
        ref={formRef}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
