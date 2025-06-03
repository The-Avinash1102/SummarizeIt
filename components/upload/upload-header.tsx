import { Badge } from "@/components/ui/badge"
import { Sparkles } from "lucide-react"

export default function UploadHeader(){
    return(
        <div className="flex flex-col items-center justify-center gap-6 text-center">
                <div className="relative p-[1px] overflow-hidden rounded-full group">
                <Badge variant={'secondary'} className="relative px-6 py-2 text-base font-bold rounded-full"><Sparkles size={18} className="animate-pulse h-8 w-8 mr-2"/><span> AI-powered Content Creation</span></Badge>
                </div>

                <div className="capitalize  tracking-tight sm:text-3xl text-center">
                    <h1 className="font-bold text-3xl">Start Uploading Your PDF&apos;s</h1>
                    <p className="text-gray-600 p-2 text-xl">Upload your PDF and viola!!</p>
                </div>
            </div>
    )
}