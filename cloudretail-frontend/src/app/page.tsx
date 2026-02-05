"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background image */}
      <Image
        src="/logo/background.jpg"
        alt="Velino background"
        fill
        priority
        className="object-cover scale-105 blur-sm"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-6 py-14">
        <div className="w-full max-w-2xl">
          <div className="rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-2xl p-8 sm:p-10 text-center">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="rounded-2xl bg-white/70 backdrop-blur p-4 shadow-lg ring-1 ring-white/40">
                <Image
                  src="/logo/velino.png"
                  alt="Velino"
                  width={120}
                  height={120}
                  priority
                  className="h-auto w-[120px] sm:w-[140px]"
                />
              </div>
            </div>

            {/* Text */}
            <h1 className="mt-6 text-4xl sm:text-5xl font-extrabold tracking-tight text-white">
              Velino
            </h1>

            <p className="mt-3 text-white/80 text-base sm:text-lg">
              Smart. Simple. Stylish shopping.
            </p>

            <p className="mt-4 text-white/70 text-sm sm:text-base leading-relaxed">
              Discover trending products, seamless checkout, and fast order tracking —
              all in one place.
            </p>

            {/* Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push("/products")}
                className="rounded-xl bg-orange-600 px-8 py-3 text-white font-semibold hover:bg-orange-700 transition shadow-lg shadow-orange-600/25"
              >
                Let’s Shop →
              </button>

              <button
                onClick={() => router.push("/products")}
                className="rounded-xl border border-white/30 bg-white/10 px-8 py-3 text-white font-semibold hover:bg-white/15 transition"
              >
                Browse Products
              </button>
            </div>

            {/* Small footer text */}
            <div className="mt-8 text-xs text-white/55">
              © {new Date().getFullYear()} Velino — MVP Storefront
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
