import Link from "next/link";
import { FileText } from "lucide-react";

export default function Header() {
    return (
        <nav className="container flex items-center justify-between py-4 lg:px-8 px-2 mx-auto">
            {/* Left: Logo */}
            <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2">
                    <FileText className="w-5 h-5 lg:w-8 lg:h-8 text-shadow-gray-900 hover:rotate-12 transform transition duration-200 ease-in-out" />
                    <span className="font-extrabold lg:text-xl text-gray-900">Summerise</span>
                </Link>
            </div>

            {/* Right: Nav Links */}
            <div className="flex items-center gap-6">
                <Link href="/#pricing" className="hover:underline">Pricing</Link>
                <Link href="/sign-in" className="hover:underline">Sign-in</Link>
            </div>
        </nav>
    );
}
