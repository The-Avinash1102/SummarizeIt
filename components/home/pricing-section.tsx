import { cn } from "@/lib/utils";
import { ArrowRight, CheckIcon } from "lucide-react";
import Link from "next/link";

type PriceType = {
    name: string;
    price: number;
    description: string;
    items: string[];
    id: string;
    paymentLink: string;
    priceId: string;
}

const plans = [
    {
        name: 'Basic',
        price: 9,
        description: 'Perfect for occasional use',
        items: [
            '3 PDF summaries per day',
            'Standard processing speed',
            'Email support',
        ],
        id: 'basic',
        paymentLink: '', 
        priceId: 'basic-price-id',
    },
    {
        name: 'Pro',
        price: 19,
        description: 'For professionals and teams',
        items: [
            'Unlimited PDF summaries',
            'Priority Processing',
            '24/7 priority support',
            'Markdown Export',
        ],
        id: 'pro',
        paymentLink: '',
        priceId: 'pro-price-id',
    }
];

const PricingCard = ({ name, price, description, items, id, paymentLink }: PriceType) => {
    return (
        <div className="relative w-full max-w-lg hover:scale-105 hover:transition-all duration-300">
            <div className={cn(
                "relative flex flex-col h-full gap-4 lg:gap-8 z-10 p-8 border-[1px] border-gray-500/20 rounded-2xl",
                id === 'pro' && 'border-gray-400 gap-5 border-1'
            )}>
            <div className="flex justify-between items-center gap-4">
                <div>
                    <p className="text-lg lg:text-xl font-bold capitalize">{name}</p>
                    <p className="text-base-content/80 mt-2">{description}</p>
                </div>
            </div>
           
            <div className="gap-2">
                <p className="text-3xl font-extrabold tracking-tight ">${price} <span className="text-xs uppercase font-semibold">USD</span ><span className="text-xs font-semibold"> / per month</span></p>
            </div>
            
            <div className="space-y-1.5 leading-relaxed text-base flex-1">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-2 ">
                        <CheckIcon size={16} />
                        <span>{item}</span>
                    </li>
                ))}
            </div>
            
            
            <div className="space-y-1 flex justify-center w-full">
                <Link href={paymentLink} className="rounded-full flex items-center gap-2 bg-linear-to-r from-gray-900 to-gray-700 hover:from-gray-600 hover:to-gray-400 text-white w-full justify-center">Buy Now <ArrowRight size={16} /></Link>
            </div>
            </div>
        </div>
    );
};

export default function PricingSection() {
    return (
        <section className="relative overflow-hidden" id="pricing">
            <div style={{
                paddingTop: '3rem', paddingBottom: '3rem', maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1rem',
            }}>
                <div className="flex items-center justify-center w-full pb-8">
                    <h2 className="uppercase font-bold text-xl mb-4 text-gray-700">Pricing</h2>
                </div>
                <div className="relative flex justify-center flex-col lg:flex-row items-center lg:items-stretch gap-8">
                    {plans.map((plan) => (
                        <PricingCard key={plan.id} {...plan} />
                    ))}
                </div>
            </div>
        </section>
    );
}