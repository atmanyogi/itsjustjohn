import Image from "next/image";
import type { Metadata } from "next";
import { FaEnvelope, FaInstagram, FaYoutube, FaHeart } from "react-icons/fa";
import { BsMusicNoteBeamed, BsGlobe } from "react-icons/bs";

export const metadata: Metadata = {
  title: "Portals | [[its.just.john]]",
  description:
    "The official portal hub for [[its.just.john]]. Connect, listen, explore visual works, and contact directly.",
  robots: {
    index: false,
    follow: true,
  },
};

const links = [
  {
    label: "Official Website",
    sublabel: "bruhitsjustjohn.com",
    description: "Step into the full terrarium interface and interactive extra worlds.",
    href: "/",
    isExternal: false,
    accent: "border-zinc-500/10 hover:border-zinc-400/40 hover:bg-zinc-950/20",
    icon: BsGlobe,
    glow: "rgba(161,161,170,0.3)",
  },
  {
    label: "Listen to the Music",
    sublabel: "Interactive Player",
    description: "Immerse in the glass jar transmissions, releases, and full music catalog.",
    href: "/music",
    isExternal: false,
    accent: "border-yellow-500/10 hover:border-yellow-400/40 hover:bg-yellow-950/20",
    icon: BsMusicNoteBeamed,
    glow: "rgba(251,191,36,0.3)",
  },
  {
    label: "Official Music IG",
    sublabel: "@itsjustjohntho",
    description: "Direct music community updates and behind-the-scenes transmissions.",
    href: "https://www.instagram.com/itsjustjohntho/",
    isExternal: true,
    accent: "border-pink-500/10 hover:border-pink-400/40 hover:bg-pink-950/20",
    icon: FaInstagram,
    glow: "rgba(236,72,153,0.3)",
  },
  {
    label: "YouTube Productions",
    sublabel: "Official Videos",
    description: "Visual narratives, video episodes, and cinematic documentation.",
    href: "https://www.youtube.com/@itsjustjohn-tho",
    isExternal: true,
    accent: "border-red-500/10 hover:border-red-400/40 hover:bg-red-950/20",
    icon: FaYoutube,
    glow: "rgba(239,68,68,0.3)",
  },
  {
    label: "Creative Visual Works",
    sublabel: "@vibevisualshawaii",
    description: "High-vibe branding, artist assets, and visual productions from Hawaii.",
    href: "https://www.instagram.com/vibevisualshawaii/",
    isExternal: true,
    accent: "border-emerald-500/10 hover:border-emerald-400/40 hover:bg-emerald-950/20",
    icon: FaInstagram,
    glow: "rgba(52,211,153,0.3)",
  },
  {
    label: "Support Me With",
    sublabel: "@Ferndrip-itsjustjohn",
    description: "Send direct direct love to the fern fund, supporting independent art.",
    href: "https://account.venmo.com/u/Ferndrip-itsjustjohn",
    isExternal: true,
    accent: "border-rose-500/10 hover:border-rose-400/40 hover:bg-rose-950/20",
    icon: FaHeart,
    glow: "rgba(244,63,94,0.3)",
  },
  {
    label: "Inquiries & Contact",
    sublabel: "aloha@bruhitsjustjohn.com",
    description: "Reach out directly for booking inquiries, client services, or direct connects.",
    href: "mailto:aloha@bruhitsjustjohn.com",
    isExternal: true,
    accent: "border-cyan-500/10 hover:border-cyan-400/40 hover:bg-cyan-950/20",
    icon: FaEnvelope,
    glow: "rgba(6,182,212,0.3)",
  },
];

export default function LinksPage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#090d09] text-white">
      {/* Background Graphic elements */}
      <Image
        src="/terrarium.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 -z-30 object-cover opacity-25 filter blur-[2px] scale-105 pointer-events-none"
      />
      <div className="absolute inset-0 -z-20 bg-[linear-gradient(180deg,rgba(5,8,5,0.85)_0%,rgba(9,13,9,0.92)_50%,#090d09_100%)] pointer-events-none" />

      {/* Decorative cloud shapes in background for atmosphere */}
      <div className="absolute top-[10%] left-[-20%] -z-10 w-[60%] aspect-square rounded-full bg-emerald-950/10 blur-[120px] pointer-events-none animate-pulse duration-[8s]" />
      <div className="absolute bottom-[20%] right-[-25%] -z-10 w-[70%] aspect-square rounded-full bg-[#ffe066]/5 blur-[150px] pointer-events-none animate-pulse duration-[12s]" />

      <section className="relative flex justify-center items-center py-16 px-4 md:px-8">
        <div className="w-full max-w-lg flex flex-col items-center">
          {/* Fern Drip Logo Header Design */}
          <div className="relative w-full max-w-[280px] aspect-[6444/3745] mb-6 filter drop-shadow-[0_4px_30px_rgba(52,211,153,0.2)] hover:scale-105 active:scale-95 transition-transform duration-500">
            <Image
              src="/Fern%20Drip%20Logo.png"
              alt="Fern Drip Logo"
              fill
              sizes="280px"
              className="object-contain pointer-events-none"
              priority
            />
          </div>

          {/* Subtitle / Header */}
          <div className="text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.45em] text-[#ffe066]/90 mb-2 drop-shadow-md">
              JohnAllLinx Portal
            </p>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_3px_10px_rgba(0,0,0,0.5)]">
              [[its.just.john]]
            </h1>
          </div>

          {/* Dope custom written explanation bio */}
          <div className="mt-5 text-center max-w-md">
            <p className="text-sm sm:text-base font-semibold leading-relaxed text-zinc-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] px-2">
              Transmitting raw art, translating artists stories through sound and vivid imagery under a creative canopy built and lived through Hilo Hawaii on the Big Island.
              <span className="block mt-4 text-emerald-400 font-bold tracking-wide">
                Click below to discover
              </span>
            </p>
          </div>

          {/* Links Portals Stack */}
          <div className="mt-10 w-full space-y-4">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.isExternal ? "_blank" : undefined}
                  rel={link.isExternal ? "noopener noreferrer" : undefined}
                  className={`group flex items-center justify-between border bg-[#f5f7fa]/[0.03] backdrop-blur-lg p-[18px] rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1 ${link.accent}`}
                  style={{
                    boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.4)",
                  }}
                >
                  <div className="flex items-center gap-4 min-w-0 w-full">
                    {/* Glowing tactile icon button */}
                    <span 
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 text-[#ffe066] transition-all duration-300 group-hover:bg-[#ffe066] group-hover:text-black group-hover:border-transparent animate-button-glow"
                      style={{
                        WebkitBackfaceVisibility: "hidden",
                      }}
                    >
                      <Icon className="h-5 w-5 pointer-events-none" />
                    </span>
                    <div className="min-w-0 flex-1 text-left">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-base font-black text-white tracking-wide group-hover:text-[#ffe066] transition-colors leading-tight truncate">
                          {link.label}
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#ffe066]/70 group-hover:text-white transition-colors shrink-0">
                          {link.sublabel}
                        </span>
                      </div>
                      <span className="mt-1.5 block text-xs leading-relaxed text-zinc-400 group-hover:text-zinc-200 transition-colors">
                        {link.description}
                      </span>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>

          {/* Simple custom footer */}
          <footer className="mt-16 text-center text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500/80">
            © {new Date().getFullYear()} bruhitsjustjohn.com/links
          </footer>
        </div>
      </section>
    </main>
  );
}
