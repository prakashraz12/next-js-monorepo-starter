import { Button } from "@repo/ui/components/button";
import { HeroVideo } from "../components/hero-video";
import { AppDownload } from "../components/app-download";
import { Navbar } from "../components/navbar";
import { SnookLogo } from "../components/snook-logo";
import {
  AnalyticsIllustration,
  BillingIllustration,
  BookingIllustration,
  LiveStatusIllustration,
  MembershipIllustration,
  PlayerTrackingIllustration,
} from "../components/feature-illustrations";

const features = [
  {
    title: "Smart Table Booking",
    description:
      "Let customers book snooker tables in real time with instant availability updates.",
    illustration: BookingIllustration,
  },
  {
    title: "Player & Match Tracking",
    description:
      "Record player stats, match results, and game history in one place.",
    illustration: PlayerTrackingIllustration,
  },
  {
    title: "Membership Management",
    description:
      "Manage monthly members, subscriptions, and loyalty benefits easily.",
    illustration: MembershipIllustration,
  },
  {
    title: "Billing & Payments",
    description:
      "Generate bills, track payments, and manage daily revenue without hassle.",
    illustration: BillingIllustration,
  },
  {
    title: "Live Table Status",
    description:
      "See which tables are free, occupied, or reserved in real time.",
    illustration: LiveStatusIllustration,
  },
  {
    title: "Analytics Dashboard",
    description:
      "Understand earnings, peak hours, and customer activity with simple reports.",
    illustration: AnalyticsIllustration,
  },
] as const;

const pricingPlans = [
  {
    name: "Free",
    price: "Free",
    period: "forever",
    description: "Perfect to get started offline at your club.",
    highlighted: false,
    features: [
      "Offline mode only",
      "No sync to database",
      "Core club management tools",
      "Single device usage",
    ],
    cta: "Get Started Free",
  },
  {
    name: "Basic",
    price: "NPR 999",
    period: "per annum",
    description: "Ideal for small clubs getting organized online.",
    highlighted: true,
    features: [
      "Up to 5 staff members",
      "Up to 5 customers",
      "Up to 5 pool/snooker tables",
      "Cloud sync & backup",
      "Email support",
    ],
    cta: "Choose Basic",
  },
  {
    name: "Pro",
    price: "NPR 2,999",
    period: "per annum",
    description: "Everything unlimited for growing snooker clubs.",
    highlighted: false,
    features: [
      "Unlimited staff members",
      "Unlimited customers",
      "Unlimited tables",
      "Advanced analytics",
      "Priority support",
    ],
    cta: "Go Pro",
  },
] as const;

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="mt-0.5 size-4 shrink-0 text-[#26a579]"
      aria-hidden
    >
      <path
        fill="currentColor"
        d="M16.7 5.3a1 1 0 0 1 0 1.4l-7.2 7.2a1 1 0 0 1-1.4 0L3.3 9.1a1 1 0 1 1 1.4-1.4l3.4 3.4 6.5-6.5a1 1 0 0 1 1.4 0z"
      />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-screen items-center overflow-hidden">
        <HeroVideo />
        <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/60 to-black/80" />

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6 py-24">
          <div className="mb-6">
            <SnookLogo height={56} />
          </div>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Manage Your Snooker Club Like a Pro
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-200 sm:text-xl">
            Track bookings, player records, memberships, payments, and
            performance—all from one simple dashboard. 🚀
          </p>

          <div className="mt-10">
            <AppDownload variant="hero" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-[#f8fcfa] py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold tracking-widest text-[#26a579] uppercase">
              Core Features
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Everything your snooker club needs
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-600">
              Run your club smarter with tools built specifically for table
              bookings, players, and daily operations.
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Illustration = feature.illustration;
              return (
                <article
                  key={feature.title}
                  className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#26a579]/30 hover:shadow-md"
                >
                  <div className="mb-5 flex h-28 items-center justify-center rounded-xl bg-[#e8f7f1] transition group-hover:bg-[#d4f0e4]">
                    <Illustration />
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-900">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <p className="text-sm font-semibold tracking-widest text-[#26a579] uppercase">
              Pricing
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
              Simple plans for every club
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-zinc-600">
              Start free offline, then upgrade when you&apos;re ready for cloud
              sync and unlimited growth.
            </p>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <article
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border p-8 ${
                  plan.highlighted
                    ? "border-[#26a579] shadow-md"
                    : "border-zinc-200"
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#26a579] px-3 py-1 text-xs font-semibold text-white">
                    Most Popular
                  </span>
                )}

                <h3 className="text-xl font-semibold text-zinc-900">
                  {plan.name}
                </h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-zinc-900">
                    {plan.price}
                  </span>
                  <span className="text-sm text-zinc-500">{plan.period}</span>
                </div>
                <p className="mt-3 text-sm text-zinc-600">{plan.description}</p>

                <ul className="mt-8 flex flex-1 flex-col gap-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-start gap-2 text-sm text-zinc-700"
                    >
                      <CheckIcon />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`mt-8 w-full ${
                    plan.highlighted
                      ? "bg-[#26a579] text-white hover:bg-[#1f8c66]"
                      : "border-[#26a579]/30 text-[#26a579] hover:bg-[#26a579]/5"
                  }`}
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  {plan.cta}
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-100 bg-[#e8f7f1] py-20">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
            Ready to run your club like a pro?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-zinc-600">
            Download Snook App today and take control of bookings, players, and
            revenue from one powerful dashboard.
          </p>
          <div className="mt-8 flex justify-center">
            <AppDownload variant="light" centered />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white py-8">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <SnookLogo height={36} />
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Snook App. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
