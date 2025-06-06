import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export default function CtaSection() {
    return <section className="bg-gray-50 py-12">
        <div className="py-12 lg:py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Ready to save Hours of reading time?</h2>
                    <p className="mx-auto max-w-2xl text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400 ">Transform the lengthy documents int clear, actionable insights with our AI-powered summariser</p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row justify-center">
                    <div>
                        <Button size={"lg"} variant={'link'} className="w-full bg-gray-900 hover:bg-gray-700 text-white hover:no-underline flex items-center justify-center ">
                            <Link href="/#pricing " className="flex items-center justify-center">Get Started<span><ArrowRight className="ml-2 h-4 w-4 animate-pulse flex items-center justify-center"/></span></Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </section>
}