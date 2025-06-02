import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function HeroSection() {
    return (
        <section style={{ position: 'relative', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '4rem', paddingBottom: '2rem', transition: 'all', animation: 'in', maxWidth: '100%', paddingLeft: '1rem', paddingRight: '1rem' }}>
        
            <div style={{ display: 'inline-flex', alignItems: 'center', borderRadius: '9999px', fontSize: '0.875rem', border: '1px solid transparent', padding: '0.125rem 0.625rem', textAlign: 'center', fontWeight: '600', transition: 'color 0.2s', cursor: 'pointer' }}>
                <span>AI-Powered PDF Summarization</span>
            </div>
        
            <h1 style={{ fontWeight: '800', fontSize: '1.5rem', paddingTop: '1rem', paddingBottom: '1rem', textAlign: 'center' }}>
                Extract Key Insights from PDFs in Seconds
            </h1>
        
            <h2 style={{ fontSize: '1.125rem', textAlign: 'center', paddingLeft: '1rem', paddingRight: '1rem', marginBottom: '1.5rem', maxWidth: '56rem', marginLeft: 'auto', marginRight: 'auto' }}>
                SummariseIt uses AI to analyze your PDFs and extract the most important information, saving you hours of reading time.
            </h2>
        
            <Button size="lg" variant={'link'} style={{ color: 'white', backgroundColor: 'black', padding: '0.75rem 1.5rem', fontSize: '1.125rem' }}>
                <Link href={"/#pricing"} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span>Try SummariseIt</span><ArrowRight style={{ height: '1rem', width: '1rem' }} />
                </Link>
            </Button>
        
            <div style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)' }}>
                
            </div>
        </section>
    );
}