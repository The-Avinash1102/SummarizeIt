import { PizzaIcon } from "lucide-react";

export default function DemoSection() {
    return (
        <section style={{ position: 'relative' }}>
            <div style={{ paddingBottom: '3rem', maxWidth: '64rem', margin: '0 auto', paddingLeft: '1rem', paddingRight: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
                    <div className="inline-flex">

                    </div>
                    <PizzaIcon style={{ width: '1.5rem', height: '1.5rem' }} />
                    <h3 style={{ fontWeight: '700', fontSize: '1.875rem', maxWidth: '36rem', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1.5rem' }}>
                        Watch how SummariseIt transform the PDF into an easy-to-read summary!
                    </h3>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingLeft: '0.5rem', paddingRight: '0.5rem', paddingTop: '0', paddingBottom: '0' }}>
                   
                    {/* Summary Viewer */}


                </div>

            </div>
        </section>
    );
}