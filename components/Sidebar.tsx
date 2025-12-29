import {
    LayoutDashboard,
    LineChart,
    Calculator,
    Activity,
    PieChart,
    User,
    Settings,
    History,
    Newspaper,
    MessageSquare,
    ChevronLeft,
    ChevronRight,
    Menu
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils"; // Assuming you have utility for classnames, effectively clsx/tailwind-merge

interface SidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

export default function Sidebar({ isCollapsed, toggleSidebar }: SidebarProps) {
    return (
        <aside
            className={`h-screen fixed left-0 top-0 bg-background/80 backdrop-blur-xl border-r border-white/5 flex flex-col z-50 transition-all duration-300 ${isCollapsed ? 'w-20' : 'w-64'}`}
        >
            {/* Brand / Toggle */}
            <div className="p-6 flex items-center justify-between">
                {!isCollapsed && (
                    <h1 className="text-2xl font-extrabold bg-gradient-to-r from-accent via-purple-400 to-cyan-400 bg-clip-text text-transparent tracking-tight whitespace-nowrap">
                        FlexFinance
                    </h1>
                )}
                <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-white/10 rounded-lg text-muted-foreground hover:text-white transition-colors mx-auto"
                >
                    {isCollapsed ? <Menu className="w-6 h-6" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8 scrollbar-hide">
                <div>
                    {!isCollapsed && (
                        <h3 className="text-[10px] font-bold text-muted-foreground/60 mb-4 px-2 uppercase tracking-[0.2em]">Menu</h3>
                    )}
                    <nav className="space-y-2">
                        <NavItem
                            href="/"
                            icon={LayoutDashboard}
                            label="Dashboard"
                            active
                            isCollapsed={isCollapsed}
                        />
                    </nav>
                </div>

                {/* Trend on Finance Section */}
                <div>
                    {!isCollapsed && (
                        <h3 className="text-[10px] font-bold text-muted-foreground/60 mb-4 px-2 uppercase tracking-[0.2em]">Trend on Finance</h3>
                    )}
                    <nav className="space-y-2">
                        <NavItem
                            href="/social-trend"
                            icon={Newspaper}
                            label="Social Trend"
                            isCollapsed={isCollapsed}
                            badge="HOT"
                        />
                    </nav>
                </div>
            </div>
        </aside>
    );
}

function NavItem({
    icon: Icon,
    label,
    active = false,
    hasDot = false,
    badge,
    href = "#",
    isCollapsed = false
}: {
    icon: any;
    label: string;
    active?: boolean;
    hasDot?: boolean;
    badge?: string;
    href?: string;
    isCollapsed?: boolean;
}) {
    return (
        <Link
            href={href}
            title={isCollapsed ? label : ""}
            className={`
                flex items-center gap-4 px-3 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden
                ${active
                    ? "text-white font-semibold shadow-2xl shadow-accent/20"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                }
                ${isCollapsed ? "justify-center" : ""}
            `}
        >
            {active && (
                <div className="absolute inset-0 bg-accent/90 backdrop-blur-md rounded-xl -z-10" />
            )}

            <Icon className={`w-5 h-5 min-w-[20px] transition-transform group-hover:scale-110 ${active ? "text-white" : "text-muted-foreground group-hover:text-white"}`} />

            {!isCollapsed && (
                <span className="flex-1 truncate duration-200">{label}</span>
            )}

            {!isCollapsed && hasDot && (
                <div className="w-2 h-2 rounded-full bg-destructive shadow-lg shadow-destructive/50" />
            )}

            {!isCollapsed && badge && (
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 rounded-full">
                    {badge}
                </span>
            )}
        </Link>
    );
}
