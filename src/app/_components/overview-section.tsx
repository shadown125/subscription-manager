"use client";

import { cn } from "@/utils";
import { BellRing, LockKeyhole, SquareKanban, Zap } from "lucide-react";
import dynamic from "next/dynamic";
import { Fade, Slide } from "react-awesome-reveal";

const Grid = dynamic(() => import("./grid-style"), { ssr: false });

const OverviewSection = () => {
  const content = [
    {
      title: "Subscription Management",
      description:
        "Manage all of your subscriptions in one place. Keep track of your expenses and never miss a payment.",
      icon: <SquareKanban size={24} />,
    },
    {
      title: "Notifications",
      description:
        "Get notified through email about upcoming payments and never miss a deadline.",
      icon: <BellRing size={24} />,
    },
    {
      title: "Expense Tracking",
      description:
        "Track your expenses and see how much you spend on subscriptions.",
      icon: <LockKeyhole size={24} />,
    },
    {
      title: "Intuitive subscription view",
      description:
        "View all of your monthly subscriptions in a simple and intuitive way.",
      icon: <LockKeyhole size={24} />,
    },
    {
      title: "Filters & Categories",
      description:
        "Filter, sort and update your columns to meet your best view of subscriptions list.",
      icon: <LockKeyhole size={24} />,
    },
    {
      title: "Mobile support",
      description:
        "Access your subscriptions in mobile devices on the go with Responsive design.",
      icon: <LockKeyhole size={24} />,
    },
    {
      title: "Data privacy",
      description:
        "Your data is safe with us. We don't share your data with anyone.",
      icon: <LockKeyhole size={24} />,
    },
    {
      title: "24/7 Support",
      description: "Our support team is available 24/7 to help you.",
      icon: <Zap size={24} />,
    },
  ];

  return (
    <section id="features" className="bg-grid-small-black relative py-20 pl-8">
      <div
        aria-hidden="true"
        className="px:5 absolute inset-x-0 top-3 z-0 h-full w-full transform-gpu overflow-hidden blur-3xl dmd:right-20 dmd:h-auto dmd:w-auto dmd:px-36"
      >
        <div
          className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#FF71D7] to-[#C9A9E9] opacity-20"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>
      <div className="wrapper">
        <Slide triggerOnce>
          <h2 className="text-6xl font-semibold text-white dmd:text-4xl">
            Fully{" "}
            <span className="bg-gradient-to-b from-[#FF705B] to-[#FFB457] bg-clip-text text-transparent">
              Featured
            </span>{" "}
          </h2>
          <h2 className="text-6xl font-semibold text-white dmd:text-4xl">
            Subscription{" "}
            <span className="bg-gradient-to-b from-[#5EA2EF] to-[#0072F5] bg-clip-text text-transparent">
              Management App
            </span>
          </h2>
        </Slide>
        <div className="mt-12 grid grid-cols-4 gap-x-8 dlg:grid-cols-2 dlg:gap-4 dmd:grid-cols-1">
          <Fade triggerOnce cascade duration={600}>
            {content.map(({ title, description, icon }, index) => (
              <div
                key={title}
                className={cn(
                  "group/feature relative flex h-full flex-col py-8 dlg:border-r dark:border-neutral-800",
                  (index === 0 || index === 4) &&
                    "dlg:border-l dark:border-neutral-800",
                  index < 4 && "dlg:border-b dark:border-neutral-800",
                )}
              >
                {index < 4 && (
                  <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-t from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800" />
                )}
                {index >= 4 && (
                  <div className="pointer-events-none absolute inset-0 h-full w-full bg-gradient-to-b from-neutral-100 to-transparent opacity-0 transition duration-200 group-hover/feature:opacity-100 dark:from-neutral-800" />
                )}
                <div className="relative z-10 mb-4 px-10 text-neutral-600 dark:text-neutral-400">
                  {icon}
                </div>
                <div className="relative z-10 mb-2 px-10 text-lg font-bold">
                  <div className="absolute inset-y-0 left-0 h-6 w-1 origin-center rounded-br-full rounded-tr-full bg-neutral-300 transition-all duration-200 group-hover/feature:h-8 group-hover/feature:bg-blue-500 dark:bg-neutral-700" />
                  <span className="inline-block text-neutral-800 transition duration-200 group-hover/feature:translate-x-2 dark:text-neutral-100">
                    {title}
                  </span>
                </div>
                <p className="relative z-10 max-w-xs px-10 text-sm text-neutral-600 dark:text-neutral-300">
                  {description}
                </p>
                <Grid size={30} />
              </div>
            ))}
          </Fade>
        </div>
      </div>
    </section>
  );
};

export default OverviewSection;
