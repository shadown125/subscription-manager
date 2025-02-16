"use client";

import React from "react";
import { Chip, Divider, Link } from "@heroui/react";
import Image from "next/image";
import Logo from "./../../../public/logo.png";

export default function PageFooter() {
  return (
    <footer className="section py-0">
      <div className="wrapper">
        <div className="w-full max-w-7xl py-12 md:flex md:items-center md:justify-between">
          {/* <div className="flex flex-col items-center justify-center gap-2 md:order-2 md:items-end">
          <ThemeSwitch />
        </div> */}
          <div className="flex w-full flex-col items-center md:flex-row md:justify-between">
            <div className="dmd:order-1 dmd:mt-0 mt-4">
              <div className="flex items-center justify-center gap-3 md:justify-start">
                <div className="flex items-center">
                  <Link href="/" color="foreground">
                    <Image
                      src={Logo}
                      alt="logo"
                      className="h-[40px] w-[100px] object-contain"
                    />
                  </Link>
                </div>
                <Divider className="h-4" orientation="vertical" />
                <Chip
                  className="border-none px-0 text-default-500"
                  color="success"
                  variant="dot"
                >
                  All systems operational
                </Chip>
              </div>
              <p className="ml-2 text-center text-tiny text-default-400 md:text-start">
                &copy; Created by Scrumbuiss
              </p>
            </div>
            <div className="mt-3 flex gap-3">
              <Link href="/privacy-policy" color="foreground">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" color="foreground">
                Term of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
