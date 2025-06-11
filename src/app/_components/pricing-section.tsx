"use client";

import React, { useCallback } from "react";
import { Icon } from "@iconify/react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Link,
  Spacer,
} from "@heroui/react";
import { cn } from "@heroui/react";

import type { ButtonProps } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { Session } from "next-auth";

enum FrequencyEnum {
  Yearly = "yearly",
  Quarterly = "quarterly",
}

enum TiersEnum {
  Access = "access",
}

type Tier = {
  key: TiersEnum;
  title: string;
  price:
    | {
        [FrequencyEnum.Yearly]: string;
        [FrequencyEnum.Quarterly]: string;
      }
    | string;
  priceSuffix?: string;
  href: string;
  pricePromotion?: string;
  description?: string;
  mostPopular?: boolean;
  featured?: boolean;
  features?: string[];
  buttonText: string;
  buttonColor?: ButtonProps["color"];
  buttonVariant: ButtonProps["variant"];
  onClick: () => void;
};

export default function PricingSection({
  session,
}: {
  session: Session | null;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

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

  const { mutate: createStripeSession } =
    api.stripe.createStripeSession.useMutation({
      onSuccess(data) {
        window.location.href = data?.url ?? "/dashboard?settings=billing";
      },
    });

  const handleStripeSessionClick = () => {
    try {
      createStripeSession({
        priceId: "price_1QtFP6GvvuU72vBATFS1HoY3",
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error("Error creating stripe session");
    }
  };

  const tiers: Array<Tier> = [
    {
      key: TiersEnum.Access,
      title: "Lifetime Access",
      description: "Unlimited access to all features",
      href: "#",
      mostPopular: true,
      // pricePromotion: "$9.99",
      price: "Free",
      featured: true,
      features: [
        "Create unlimited subscriptions",
        "Get up to 10 email notifications per day",
        "Help center access",
        "Updates and new features",
      ],
      buttonText: "Get started",
      buttonColor: "primary",
      buttonVariant: "solid",
      onClick: session ? () => router.push("/dashboard") : handleClick,
    },
  ];

  return (
    <section className="section" id="pricing">
      <div className="wrapper max-w-5xl">
        <div className="relative flex flex-col items-center py-24">
          <div
            aria-hidden="true"
            className="px:5 absolute inset-x-0 top-3 z-0 h-full w-full transform-gpu overflow-hidden blur-3xl md:right-20 md:h-auto md:w-auto md:px-36"
          >
            <div
              className="mx-auto aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#FF71D7] to-[#C9A9E9] opacity-30"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div className="flex max-w-xl flex-col text-center">
            <h2 className="text-6xl font-semibold light:text-background dmd:text-4xl dark:text-white">
              <span className="bg-gradient-to-b from-[#FF705B] to-[#FFB457] bg-clip-text text-transparent">
                Get{" "}
              </span>
              Lifetime{" "}
            </h2>
            <h2 className="text-6xl font-semibold text-white dmd:text-4xl">
              <span className="bg-gradient-to-b from-[#FF71D7] to-[#C9A9E9] bg-clip-text text-transparent">
                Access{" "}
              </span>
              <span className="bg-gradient-to-b from-[#5EA2EF] to-[#0072F5] bg-clip-text text-transparent">
                Now!{" "}
              </span>
            </h2>
          </div>
          <Spacer y={12} />
          <div className="grid grid-cols-1 justify-center gap-4">
            {tiers.map((tier) => (
              <Card
                key={tier.key}
                isBlurred
                className={cn(
                  "min-w-[400px] bg-background/60 p-3 dark:bg-default-100/50",
                  {
                    "!border-small border-secondary/50": tier.mostPopular,
                  },
                )}
                shadow="md"
              >
                {tier.mostPopular ? (
                  <Chip
                    className="absolute right-4 top-4"
                    color="secondary"
                    variant="flat"
                  >
                    Most Popular
                  </Chip>
                ) : null}
                <CardHeader className="flex flex-col items-start gap-2 pb-6">
                  <h2 className="text-large font-medium">{tier.title}</h2>
                  <p className="text-medium text-default-500">
                    {tier.description}
                  </p>
                </CardHeader>
                <Divider />
                <CardBody className="gap-8">
                  <p className="flex items-baseline gap-1 pt-2">
                    <span className="text-md inline bg-gradient-to-br from-foreground to-foreground-600 bg-clip-text font-semibold leading-8 tracking-tight text-red-500 line-through">
                      {tier.pricePromotion && tier.pricePromotion}
                    </span>
                    <span className="inline bg-gradient-to-br from-foreground to-foreground-600 bg-clip-text text-4xl font-semibold leading-7 tracking-tight text-lime-500">
                      {typeof tier.price === "string" && tier.price}
                    </span>
                  </p>
                  <ul className="flex flex-col gap-2">
                    {tier.features?.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Icon
                          className="text-secondary"
                          icon="ci:check"
                          width={24}
                        />
                        <p className="text-default-500">{feature}</p>
                      </li>
                    ))}
                  </ul>
                </CardBody>
                <CardFooter>
                  <Button
                    fullWidth
                    color="secondary"
                    onClick={tier.onClick}
                    variant={tier.buttonVariant}
                  >
                    {tier.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
