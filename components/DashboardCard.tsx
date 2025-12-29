export default function DashboardCard({
    children,
    title,
    action
}: {
    children: React.ReactNode;
    title?: string;
    action?: React.ReactNode;
}) {
    return (
        <div className="relative group h-full">
            {/* Gradient Glow Effect on Hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-accent/20 to-purple-400/20 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>

            <div className="relative bg-card/80 backdrop-blur-xl border border-white/5 rounded-3xl p-6 h-full shadow-lg transition-all duration-300 hover:shadow-accent/5 hover:-translate-y-1">
                {(title || action) && (
                    <div className="flex justify-between items-center mb-6">
                        {title && <h3 className="text-lg font-bold text-card-foreground tracking-tight">{title}</h3>}
                        {action}
                    </div>
                )}
                {children}
            </div>
        </div>
    );
}
