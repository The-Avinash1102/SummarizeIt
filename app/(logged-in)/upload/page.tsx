 import Header from "@/components/common/header";
import UploadForm from "@/components/upload/upload-form";
import UploadHeader from "@/components/upload/upload-header";


export default function Page() {
    return<section>
        <Header />
        <div className="flex flex-col justify-center items-center text-center gap-6">
             <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
            <UploadHeader />
            <UploadForm />
        </div>
        </div>
       
    </section>
}