import { BrainCircuit, FileOutput, FileText } from "lucide-react";
import { ReactNode } from "react";

type Step = {
    icon: ReactNode;
    label: string;
    description: string;
};

const steps: Step[] = [
    {
        icon: <FileText size={48} strokeWidth={1.5} />,
        label: 'Upload a PDF',
        description: 'Simply drag and drop your PDF document or click on upload',
    },
    {
        icon: <BrainCircuit size={48} strokeWidth={1.5} />,
        label: 'AI Analysis',
        description: 'Our advanced AI processes and analyzes your document',
    },
    {
        icon: <FileOutput size={48} strokeWidth={1.5} />,
        label: 'Get Summary',
        description: 'Receive a clear, concise summary of your document',
    },
];

export default function HowItWorks() {
    return (
        <section style={{
            position: 'relative',overflow: 'hidden',backgroundColor: '#f9fafb',paddingTop: '1.5rem',paddingBottom: '3rem',textAlign: 'center',
        }}>
            <div style={{
                paddingBottom: '1.5rem',maxWidth: '72rem',margin: '0 auto',paddingLeft: '1rem',paddingRight: '1rem',
            }}>
                <h2 style={{
                    fontSize: '1.6rem',fontWeight: '600',lineHeight: '1.3',color: '#111827',marginBottom: '1rem',
                }}>
                    How it works
                </h2>
                <h3 style={{
                    fontSize: '0.95rem',fontWeight: '400',lineHeight: '1.5',color: '#4b5563',marginTop: '0.5rem',maxWidth: '50rem',margin: '0 auto',
                }}>
                    Transform any PDF into an easy-to-read summary in three simple steps
                </h3>

                <div style={{
                    display: 'grid',gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',gap: '2rem',maxWidth: '96rem',margin: '3rem auto 0',position: 'relative',cursor: 'pointer',padding: '0 2rem',
                }}>
                    {steps.map((step, index) => (
                        <div key={index} className="group">
                            <StepItem {...step} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function StepItem({ icon, label, description }: Step) {
    return (
        <div style={{
            position: 'relative',padding: '1.5rem',borderRadius: '1.2rem',backgroundColor: '#ffffff10',backdropFilter: 'blur(10px)',border: '1px solid rgba(255, 255, 255, 0.15)',display: 'flex',flexDirection: 'column',gap: '1rem',justifyContent: 'center',alignItems: 'center',width: '100%',transition: 'all 0.3s ease',cursor: 'pointer',boxShadow: '0 6px 10px rgba(0, 0, 0, 0.1)',
        }}>
            <div style={{
                display: 'flex',justifyContent: 'center',alignItems: 'center',height: '5.5rem',width: '5.5rem',borderRadius: '1rem',backgroundColor: '#ffffff20',transition: 'all 0.3s ease',padding: '1rem',
            }} className="group-hover:scale-110 group-hover:bg-black/20">
                <div style={{ color: '#4b5563' }}>
                    {icon}
                </div>
            </div>

            <h4 style={{
                fontSize: '1.2rem',fontWeight: '600',color: '#111827',transition: 'color 0.3s ease',
            }} className="group-hover:text-blue-600">
                {label}
            </h4>
            <p style={{
                fontSize: '1rem',fontWeight: '400',color: '#6b7280',textAlign: 'center',lineHeight: '1.4', transition: 'color 0.3s ease',
            }} className="group-hover:text-gray-900">
                {description}
            </p>
        </div>
    );
}