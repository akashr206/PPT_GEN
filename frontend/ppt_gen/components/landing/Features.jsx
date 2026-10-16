import { useRef } from "react";
import { Sparkles, Palette, Monitor, Smartphone } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function Features() {
    const containerRef = useRef(null);

    useGSAP(() => {
        gsap.fromTo(".feature-card", 
        {
            y: 150,
            opacity: 0,
            scale: 0.8,
            rotationX: -45,
            filter: "blur(20px)"
        },
        {
            y: 0,
            opacity: 1,
            scale: 1,
            rotationX: 0,
            filter: "blur(0px)",
            duration: 1.2,
            stagger: 0.15,
            ease: "back.out(1.2)",
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 75%",
            }
        });
    }, { scope: containerRef });

    return (
        <section ref={containerRef} className="min-h-screen flex flex-col justify-center py-10 relative z-10 w-full max-w-7xl 2xl:max-w-330 mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-5 md:gap-6 max-w-7xl 2xl:max-w-[1536px] mx-auto text-left" style={{ perspective: "2000px" }}>
                {/* Large Main Feature (Spans 2 cols, 2 rows) */}
                <div className="feature-card md:col-span-2 md:row-span-2 p-8 md:p-10 rounded-[1.25rem] bg-gradient-to-br from-white/[0.08] to-transparent border border-white/10 hover:border-white/20 backdrop-blur-xl transition-all flex flex-col justify-end relative overflow-hidden group">
                    <div className="absolute top-8 right-8 w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                        <Sparkles size={24} />
                    </div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] group-hover:bg-blue-500/30 transition-all" />
                    <div className="relative z-10 mt-32">
                        <h3 className="text-3xl md:text-4xl font-semibold text-white mb-4 tracking-tight">
                            AI-Powered Creation
                        </h3>
                        <p className="text-white/60 text-lg md:text-xl leading-relaxed">
                            Turn any text prompt or raw idea into a fully
                            structured, beautifully designed presentation in
                            a matter of seconds. Let the AI do the heavy
                            lifting.
                        </p>
                    </div>
                </div>

                {/* Top Right Feature (Spans 2 cols, 1 row) */}
                <div className="feature-card md:col-span-2 p-8 md:p-10 rounded-[1.25rem] bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:bg-white/[0.05] transition-all flex flex-col justify-between group">
                    <div className="flex justify-between items-start mb-12">
                        <h3 className="text-2xl font-semibold text-white tracking-tight">
                            Stunning Designs
                        </h3>
                        <div className="w-10 h-10 rounded-xl bg-violet-500/20 text-violet-400 flex items-center justify-center">
                            <Palette size={20} />
                        </div>
                    </div>
                    <p className="text-white/60 text-lg leading-relaxed">
                        Access premium themes and dynamic layouts that
                        automatically adapt to your content instantly,
                        ensuring pixel-perfect slides every time.
                    </p>
                </div>

                {/* Bottom Right Features (1 col, 1 row each) */}
                <div className="feature-card p-8 rounded-[1.25rem] bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:bg-white/[0.05] transition-all flex flex-col justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-12">
                        <Monitor size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Real-time Editing
                        </h3>
                        <p className="text-white/60 text-base leading-relaxed">
                            Fine-tune text, icons, and colors instantly.
                        </p>
                    </div>
                </div>

                <div className="feature-card p-8 rounded-[1.25rem] bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:bg-white/[0.05] transition-all flex flex-col justify-between">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-12">
                        <Smartphone size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-white mb-2">
                            Export Anywhere
                        </h3>
                        <p className="text-white/60 text-base leading-relaxed">
                            Download as PPTX, PDF or present directly.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
