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
        <div className="relative w-full max-w-lg">
            <div className="relative flex flex-col gap-4 h-full lg:gap-8 z-10 p-8 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center gap-4">
                <div>
                    <p className="text-lg lg:text-xl font-bold capitalize">{name}</p>
                    <p className="text-base-content/80 mt-2">{description}</p>
                </div>
            </div>
           
            <div>
                <p>${price}</p>
            </div>
            
            <div>
                {items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </div>
            
            
            <div>
                <Link href={paymentLink}>Buy Now</Link>
            </div>
            </div>
        </div>
    );
};

export default function PricingSection() {
    return (
        <section>
            <div style={{
                paddingTop: '3rem', paddingBottom: '3rem', maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto', paddingLeft: '1rem', paddingRight: '1rem',
            }}>
                <div>
                    <h2 className="text-3xl font-semibold">Pricing</h2>
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