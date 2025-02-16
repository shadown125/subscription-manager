"use client";

import React from "react";
import { Button } from "@heroui/react";
import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";

import FadeInImage from "./fade-in-image";
import AppScreenshotSkewed from "./app-screenshot-skewed";
import Link from "next/link";

export default function Staging() {
  return (
    <div className="relative flex h-screen min-h-dvh w-full flex-col overflow-hidden bg-background">
      <div className="container mx-auto mt-[80px] flex max-w-[1024px] flex-col items-start px-8">
        <div className="z-20 flex flex-col items-start justify-center gap-[18px] sm:gap-6">
          <LazyMotion features={domAnimation}>
            <m.div
              animate="kick"
              className="flex flex-col gap-6"
              exit="auto"
              initial="auto"
              transition={{
                duration: 0.25,
                ease: "easeInOut",
              }}
              variants={{
                auto: { width: "auto" },
                kick: { width: "auto" },
              }}
            >
              <AnimatePresence mode="wait">
                <m.div
                  key={1}
                  animate={{ filter: "blur(0px)", opacity: 1, x: 0 }}
                  className="text-start text-[clamp(40px,10vw,44px)] font-bold leading-[1.2] tracking-tighter sm:text-[64px]"
                  initial={{ filter: "blur(16px)", opacity: 0, x: 15 + 1 * 2 }}
                  transition={{
                    bounce: 0,
                    delay: 0.01 * 10,
                    duration: 0.8 + 0.1 * 8,
                    type: "spring",
                  }}
                >
                  <div className="bg-hero-section-title from-[#FFFFFF] to-[#FFFFFF66] bg-clip-text text-transparent">
                    All Subscription <br /> in one place.
                  </div>
                </m.div>

                <m.div
                  key={2}
                  animate={{ filter: "blur(0px)", opacity: 1, x: 0 }}
                  className="text-start font-normal leading-7 text-default-500 sm:w-[466px] sm:text-[18px]"
                  initial={{ filter: "blur(16px)", opacity: 0, x: 15 + 1 * 3 }}
                  transition={{
                    bounce: 0,
                    delay: 0.01 * 30,
                    duration: 0.8 + 0.1 * 9,
                    type: "spring",
                  }}
                >
                  Best subscriptions management app. Get notified when a
                  subscription is due, and keep track of your expenses.
                </m.div>

                <m.div
                  key={3}
                  animate={{ filter: "blur(0px)", opacity: 1, x: 0 }}
                  className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6"
                  initial={{ filter: "blur(16px)", opacity: 0, x: 15 + 1 * 4 }}
                  transition={{
                    bounce: 0,
                    delay: 0.01 * 50,
                    duration: 0.8 + 0.1 * 10,
                    type: "spring",
                  }}
                >
                  <Button
                    as={Link}
                    href="#features"
                    className="h-10 w-[163px] bg-default-foreground px-[16px] py-[10px] text-small font-medium leading-5 text-background"
                    radius="full"
                  >
                    Get Started
                  </Button>
                </m.div>
              </AnimatePresence>
            </m.div>
          </LazyMotion>
        </div>
      </div>
      <LazyMotion features={domAnimation}>
        <AnimatePresence mode="wait">
          <m.div
            key={2}
            animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
            className="absolute top-[40%] w-full"
            initial={{ filter: "blur(16px)", opacity: 0, y: 300 }}
            transition={{
              bounce: 0,
              delay: 0.01 * 10,
              duration: 0.8 + 0.1 * 8,
              type: "spring",
            }}
          >
            <AppScreenshotSkewed
              className="w-full"
              image={"/open-graph-image.png"}
            />
          </m.div>
        </AnimatePresence>
      </LazyMotion>

      <div className="pointer-events-none absolute inset-0 top-[-25%] z-10 scale-150 select-none sm:scale-125">
        <FadeInImage
          fill
          priority
          alt="Gradient background"
          src="https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/backgrounds/bg-gradient.png"
        />
      </div>
    </div>
  );
}
