'use client'
import { useUploadThing } from "@/utils/uploadthing";
import UploadFormInput from "./upload-form-input";
import {z} from 'zod'

// Schema
const schema = z.object({
    file: z.instanceof(File,{message:'Invalid File'}).refine((file) => file.size <= 20*1024*1024,{message:'File size should be less than 20 MB'}).refine((file) => file.type.startsWith('application/pdf'),'File must be a pdf'),
})

export default function UploadForm() {

    const {startUpload, routeConfig} = useUploadThing
    ('pdfUploader', {
        onClientUploadComplete: () => {
            console.log('upload successfull!');
        },
        onUploadError: (err) => {
            console.error('error occured while uploading file',err);
        },
        onUploadBegin: ({file}) => {
            console.log('upload has begin for',file);
        },
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Form submitted');

        const formdata = new FormData(e.currentTarget);
        const file = formdata.get('file') as File;

// Validating the fields
        const validatedFields = schema.safeParse({file});

        console.log(validatedFields);

        if(!validatedFields.success){
            console.log('success');
            console.log(
                validatedFields.error.flatten().fieldErrors.file?.[0] ?? 'Invalid File'
            );
            return;
        }
// schema with zod
// upload the file to {uploadthing}
        const resp = await startUpload([file])
        if(!resp){
            return;
        }
// parse the pdf using langchain


// summarise the pdf using gemini
// save the summary to the database
// redirect to the individual summary page


    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
            <UploadFormInput onSubmit={handleSubmit} />
        </div>
    );
}
