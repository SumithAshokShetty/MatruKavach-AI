"use client";

import React from "react";
import Link from "next/link";
import { Linkedin, Twitter, Youtube } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full relative bg-transparent pt-24 pb-12 px-4 border-t border-gray-100/50 mt-auto overflow-hidden">
            
            <div className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] pointer-events-none" style={{
                background: "radial-gradient(ellipse at bottom, rgba(249, 115, 22, 0.5) 0%, rgba(251, 146, 60, 0.3) 40%, rgba(219, 234, 254, 0.2) 75%, transparent 100%)",
                borderRadius: "50% 50% 0 0",
                filter: "blur(90px)",
                zIndex: -1
            }} />
            <div className="container mx-auto max-w-6xl relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-24 mb-16">
                    
                    <div className="col-span-1">
                        <h2 className="text-3xl font-heading font-medium tracking-tight text-black mb-2">
                            MatruKavach AI
                        </h2>
                        <p className="text-gray-500 text-sm mb-6">Environment-Aware Analytics</p>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <h4 className="text-xs font-bold tracking-widest text-gray-900 uppercase mb-2">Products</h4>
                        <Link href="/asha" className="text-gray-500 hover:text-black transition-colors text-sm">ASHA Portal</Link>
                        <Link href="/doctor" className="text-gray-500 hover:text-black transition-colors text-sm">Doctor Portal</Link>
                        <Link href="/admin" className="text-gray-500 hover:text-black transition-colors text-sm">Orchestrator Admin</Link>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <h4 className="text-xs font-bold tracking-widest text-gray-900 uppercase mb-2">Company</h4>
                        <Link href="#" className="text-gray-500 hover:text-black transition-colors text-sm">About us</Link>
                        <Link href="#" className="text-gray-500 hover:text-black transition-colors text-sm">Blogs</Link>
                        <Link href="#" className="text-gray-500 hover:text-black transition-colors text-sm">Careers</Link>
                        <Link href="#" className="text-gray-500 hover:text-black transition-colors text-sm">Terms of service</Link>
                        <Link href="#" className="text-gray-500 hover:text-black transition-colors text-sm">Privacy Policy</Link>
                    </div>

                    <div className="flex flex-col space-y-4">
                        <h4 className="text-xs font-bold tracking-widest text-gray-900 uppercase mb-2">Socials</h4>
                        <Link href="#" className="text-gray-500 hover:text-black transition-colors text-sm flex items-center gap-2">
                            LinkedIn
                        </Link>
                        <Link href="#" className="text-gray-500 hover:text-black transition-colors text-sm flex items-center gap-2">
                            X
                        </Link>
                        <Link href="#" className="text-gray-500 hover:text-black transition-colors text-sm flex items-center gap-2">
                            YouTube
                        </Link>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-100/50 text-xs text-gray-400">
                    <p>Copyright MatruKavach AI 2026</p>
                    <p className="mt-4 md:mt-0">All rights reserved, Built in India</p>
                </div>
            </div>
        </footer>
    );
}
