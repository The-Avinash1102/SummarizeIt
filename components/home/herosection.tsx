import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";

export default function HeroSection() {
    return (
        <section className="relative mx-auto flex flex-col items-center justify-center py-16 sm:py-20 lg:pb-28 transition-all animate-in max-w-full px-4 lg:px-0">
    <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent w-fit">
        <span>AI-Powered PDF Summarization</span>
    </div>
    <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl bg-clip-text">
            Extract Key Insights from PDFs in Seconds
        </h1>
        <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto">
            SummariseIt uses AI to analyze your PDFs and extract the most important information, saving you hours of reading time.
        </p>
    </div>
    <Button size="lg" className="gap-1 transition-all duration-300 shadow-md hover:shadow-lg">
        Try SummariseIt<ArrowRight className="h-4 w-4" />
    </Button>
    <div className="relative rounded-xl overflow-hidden shadow-2xl">
    </div>
</section>
    );
}
