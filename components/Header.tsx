import { Search, Settings, Bell } from "lucide-react";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";

export default function Header() {
    return (
        <header className="sticky top-0 z-40 flex items-center justify-between px-8 py-5 bg-background/50 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
            <div>
                <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
                    Dashboard
                </h2>
            </div>

            <div className="flex items-center gap-6">
                {/* Search */}
                <div className="relative hidden md:block group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-accent transition-colors" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-72 pl-11 pr-4 py-2.5 bg-white/5 border border-white/5 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:bg-white/10 transition-all placeholder:text-muted-foreground/70"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <ThemeToggle />

                    <button className="p-2.5 rounded-full hover:bg-white/5 text-muted-foreground transition-all hover:text-foreground hover:scale-105 active:scale-95">
                        <Settings className="w-5 h-5" />
                    </button>

                    <button className="p-2.5 rounded-full hover:bg-white/5 text-muted-foreground transition-all hover:text-foreground hover:scale-105 active:scale-95 relative">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full ring-2 ring-background animate-pulse" />
                    </button>

                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-accent to-purple-400 p-[2px] cursor-pointer hover:shadow-lg hover:shadow-accent/20 transition-all">
                        <div className="w-full h-full bg-card rounded-full flex items-center justify-center overflow-hidden">
                            {/* Placeholder for user avatar - using a smooth gradient div */}
                            <div className="w-full h-full bg-gradient-to-br from-[#2a2a35] to-[#1a1a20] flex items-center justify-center font-bold text-accent text-sm">
                                JD
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
