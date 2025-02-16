"use client";

import React, { useCallback } from "react";
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
  Button,
  NavbarBrand,
} from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type Session } from "next-auth";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Logo from "./../../../public/logo.png";

export default function Navigation({ session }: { session: Session | null }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = ["Dashboard"];

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const handleClick = () => {
    router.push(pathname + "?" + createQueryString("credentials", "login"), {
      scroll: false,
    });
  };

  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        wrapper: "section py-0 max-w-[1340px]",
      }}
    >
      <NavbarContent className="">
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
        />
        <NavbarBrand className="">
          <Link href="/" color="foreground">
            <Image
              src={Logo}
              alt="logo"
              className="h-[100px] w-[200px] object-contain"
            />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden gap-4 sm:flex"
        justify="center"
      ></NavbarContent>
      <NavbarContent justify="end">
        {session && (
          <>
            <NavbarItem className="hidden lg:flex">
              <Button color="success" as={Link} href="/dashboard">
                Dashboard
              </Button>
            </NavbarItem>
            <NavbarItem className="hidden lg:flex">
              <Button
                color="warning"
                href="/dashboard"
                onPress={() => signOut({ callbackUrl: "/" })}
              >
                Logout
              </Button>
            </NavbarItem>
          </>
        )}
        {!session && (
          <NavbarItem className="hidden lg:flex">
            <Button color="primary" onClick={handleClick} variant="shadow">
              Log In
            </Button>
          </NavbarItem>
        )}
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              className="w-full"
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
              }
              href="#"
              size="lg"
            >
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
