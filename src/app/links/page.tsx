import Image from "next/image";
import type { Metadata } from "next";
import {
  FaEnvelope,
  FaInstagram,
  FaShoppingBag,
  FaYoutube,
} from "react-icons/fa";
import { BsMusicNoteBeamed } from "react-icons/bs";
import {
  HiOutlineHeart,
  HiOutlinePhotograph,
  HiOutlineSparkles,
  HiOutlineVideoCamera,
} from "react-icons/hi";

export const metadata: Metadata = {
  title: "JohnAllLinx | [[its.just.john]]",
  description:
    "The official one-link hub for [[its.just.john]] music, shop, socials, videos, support, and contact.",
  robots: {
    index: false,
    follow: true,
  },
};

const featuredLinks = [
  {
    label: "Listen to the Music",
    description: "Catalog, releases, and sonic journal entries.",
    href: "/music",
    icon: BsMusicNoteBeamed,
  },
  {
    label: "Shop Gear",
    description: "Fern Drip apparel, drops, and artist goods.",
    href: "/shop",
    icon: FaShoppingBag,
  },
  {
    label: "Support on Venmo",
    description: "Send love straight to the fern fund.",
    href: "https://account.venmo.com/u/Ferndrip-itsjustjohn",
    icon: HiOutlineHeart,
  },
];

const socialLinks = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/itsjustjohntho/",
    icon: FaInstagram,
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@itsjustjohn-tho",
    icon: FaYoutube,
  },
  {
    label: "Gallery",
    href: "/gallery",
    icon: HiOutlinePhotograph,
  },
  {
    label: "Videos",
    href: "/videos",
    icon: HiOutlineVideoCamera,
  },
  {
    label: "Studio Extras",
    href: "/extras",
    icon: HiOutlineSparkles,
  },
  {
    label: "Email",
    href: "mailto:aloha@bruhitsjustjohn.com",
    icon: FaEnvelope,
  },
];

export default function LinksPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#10180f] text-white">
      <section className="relative isolate flex min-h-screen items-center px-5 py-8 sm:px-8">
        <Image
          src="/terrarium.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 -z-30 object-cover opacity-55"
        />
        <Image
          src="/cloudleft1.png"
          alt=""
          width={1152}
          height={896}
          priority
          className="pointer-events-none absolute -left-64 top-0 -z-20 hidden w-[48rem] opacity-55 blur-[1px] md:block"
        />
        <Image
          src="/cloudright1.png"
          alt=""
          width={1152}
          height={896}
          priority
          className="pointer-events-none absolute -right-72 top-4 -z-20 hidden w-[50rem] opacity-50 blur-[1px] md:block"
        />
        <Image
          src="/moss3.png"
          alt=""
          width={1366}
          height={768}
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-44 w-full object-cover opacity-70 sm:h-56"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(5,8,5,0.62),rgba(16,24,15,0.72)_42%,#10180f_100%)]" />

        <div className="mx-auto grid w-full max-w-6xl items-center gap-8 md:grid-cols-[0.9fr_1.1fr]">
          <div className="relative mx-auto hidden w-full max-w-md md:block">
            <Image
              src="/jar bottom.png"
              alt="Fern Drip terrarium jar"
              width={618}
              height={768}
              className="h-auto w-full drop-shadow-[0_28px_60px_rgba(0,0,0,0.55)]"
              priority
            />
            <Image
              src="/Ferndrip.png"
              alt=""
              width={580}
              height={401}
              className="absolute left-1/2 top-[18%] w-[68%] -translate-x-1/2 opacity-90 drop-shadow-[0_12px_24px_rgba(0,0,0,0.45)]"
            />
          </div>

          <div className="mx-auto flex w-full max-w-xl flex-col items-center md:items-start">
            <div className="relative mb-4 h-28 w-28 overflow-hidden rounded-full border border-white/25 bg-black/35 shadow-2xl shadow-black/50 md:h-32 md:w-32">
              <Image
                src="/IJJ LOGO.png"
                alt="[[its.just.john]] logo"
                fill
                sizes="128px"
                className="object-contain p-2"
                priority
              />
            </div>

            <p className="mb-2 text-xs font-black uppercase tracking-[0.36em] text-emerald-100/85">
              JohnAllLinx
            </p>
            <h1 className="text-center text-5xl font-black leading-none text-white drop-shadow-[0_5px_20px_rgba(0,0,0,0.7)] sm:text-6xl md:text-left">
              [[its.just.john]]
            </h1>
            <p className="mt-4 max-w-md text-center text-sm font-semibold leading-6 text-zinc-100 drop-shadow-[0_3px_12px_rgba(0,0,0,0.8)] sm:text-base md:text-left">
              Fern drip, glass jar transmissions, music, visuals, shop,
              support, and direct contact from Mountain View, Hawaii.
            </p>

            <div className="mt-7 grid w-full gap-3">
              {featuredLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target={
                      link.href.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      link.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="group flex min-h-20 items-center gap-4 border border-emerald-100/20 bg-[#f5f7fa]/[0.11] px-5 py-4 text-left shadow-lg shadow-black/30 backdrop-blur-md transition duration-200 hover:-translate-y-0.5 hover:border-emerald-100/70 hover:bg-emerald-50/20"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ffe066] text-zinc-950 transition group-hover:scale-105">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-base font-black text-white">
                        {link.label}
                      </span>
                      <span className="mt-1 block text-sm leading-5 text-zinc-200">
                        {link.description}
                      </span>
                    </span>
                  </a>
                );
              })}
            </div>

            <div className="mt-5 grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
              {socialLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <a
                    key={link.href}
                    href={link.href}
                    target={
                      link.href.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      link.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="flex min-h-16 items-center justify-center gap-2 border border-white/15 bg-black/40 px-3 py-3 text-sm font-bold text-zinc-100 backdrop-blur-sm transition hover:border-[#ffe066]/80 hover:bg-[#ffe066] hover:text-zinc-950"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate">{link.label}</span>
                  </a>
                );
              })}
            </div>

            <p className="mt-8 text-center text-xs uppercase tracking-[0.24em] text-zinc-300 md:text-left">
              bruhitsjustjohn.com/links
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
