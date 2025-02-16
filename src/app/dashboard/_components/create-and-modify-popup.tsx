"use client";

import React, { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalBody,
  DatePicker,
  Select,
  SelectItem,
  Skeleton,
} from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { api } from "@/trpc/react";
import { getLocalTimeZone, parseDate, today } from "@internationalized/date";
import {
  type BillingTypeOptions,
  billingTypeOptions,
  type CurrencyOptions,
  currencyOptions,
  type PeriodOptions,
  periodOptions,
  type StatusOptions,
  statusOptions,
} from "./data";

const subscriptionSchema = z.object({
  subscriptionName: z
    .string()
    .min(1, {
      message: "Enter subscription name",
    })
    .max(100, {
      message: "Subscription name too long",
    }),
  price: z
    .string()
    .min(1, {
      message: "Enter subscription price",
    })
    .max(255, {
      message: "Subscription price too long",
    })
    .refine((val) => !Number.isNaN(parseInt(val, 10)), {
      message: "Expected number, received a string",
    }),
});

export type SubscriptionSchema = z.infer<typeof subscriptionSchema>;

export default function CreateAndModifyPopup() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const utils = api.useUtils();

  const subscriptionParam = searchParams.get("subscription");
  const subscriptionIdParam = searchParams.get("subscription-id");

  const { data: currentSubscription, isLoading } =
    api.subscription.getById.useQuery({
      id: subscriptionIdParam ? parseInt(subscriptionIdParam) : null,
    });

  const [submitLoading, setSubmitLoading] = useState(false);
  const [date, setDate] = useState(
    currentSubscription
      ? parseDate(currentSubscription.billingDate)
      : today(getLocalTimeZone()),
  );
  const [billingType, setBillingType] = useState<BillingTypeOptions>(
    currentSubscription ? currentSubscription.billingType : "CREDIT_CARD",
  );
  const [currency, setCurrency] = useState<CurrencyOptions>(
    currentSubscription ? currentSubscription.currency : "USD",
  );
  const [period, setPeriod] = useState<PeriodOptions>(
    currentSubscription ? currentSubscription.period : "MONTHLY",
  );
  const [status, setStatus] = useState<StatusOptions>(
    currentSubscription ? currentSubscription.status : "ACTIVE",
  );

  const { mutate: subscriptionCreate } = api.subscription.create.useMutation();
  const { mutate: subscriptionUpdate } = api.subscription.update.useMutation();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubscriptionSchema>({
    resolver: zodResolver(subscriptionSchema),
  });

  const onSubmit: SubmitHandler<SubscriptionSchema> = async (data) => {
    try {
      setSubmitLoading(true);

      if (subscriptionIdParam && currentSubscription) {
        subscriptionUpdate(
          {
            id: currentSubscription.id,
            subscriptionName: data.subscriptionName,
            price: Number(parseFloat(data.price).toFixed(2)),
            billingType: billingType,
            currency: currency,
            period: period,
            status: status,
            billingDate: date.toString(),
          },
          {
            onError() {
              setSubmitLoading(false);

              toast.error("Something went wrong while update subscription", {
                position: "bottom-center",
                className: "text-center",
              });
            },
            async onSuccess() {
              setSubmitLoading(false);

              await utils.subscription.get.invalidate();

              router.refresh();
              reset();
              router.push(pathname, { scroll: false });
              toast.success("You have successfully update subscription", {
                position: "bottom-center",
                className: "text-center",
              });
            },
          },
        );
      } else {
        subscriptionCreate(
          {
            subscriptionName: data.subscriptionName,
            price: Number(parseFloat(data.price).toFixed(2)),
            billingType: billingType,
            currency: currency,
            period: period,
            status: status,
            billingDate: date.toString(),
          },
          {
            onError() {
              setSubmitLoading(false);

              toast.error("Something went wrong while creating subscription", {
                position: "bottom-center",
                className: "text-center",
              });
            },
            async onSuccess() {
              setSubmitLoading(false);

              await utils.subscription.get.invalidate();

              router.refresh();
              reset();
              router.push(pathname, { scroll: false });
              toast.success("You have successfully created subscription", {
                position: "bottom-center",
                className: "text-center",
              });
            },
          },
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error("Something went wrong with creating your account");
    }
  };

  return (
    <Modal
      isOpen={!!subscriptionParam || !!subscriptionIdParam}
      placement="center"
      onOpenChange={() => {
        router.push(pathname, { scroll: false });
      }}
      size="lg"
      className="mt-4 max-h-[90vh] overflow-auto p-0"
    >
      <ModalContent className="p-0">
        <ModalBody className="bg-content1 shadow-small">
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex w-full max-w-3xl flex-col gap-4 rounded-large bg-content1 py-10 pb-6">
              {isLoading ? (
                <>
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-5 w-full" />
                </>
              ) : (
                <form
                  className="flex flex-col gap-y-3"
                  onSubmit={handleSubmit(onSubmit)}
                  noValidate
                >
                  <Input
                    autoFocus
                    isRequired
                    label={"Subscription name"}
                    defaultValue={currentSubscription?.name}
                    type="text"
                    variant="bordered"
                    isInvalid={!!errors.subscriptionName}
                    errorMessage={
                      errors.subscriptionName?.message &&
                      errors.subscriptionName.message
                    }
                    {...register("subscriptionName", { required: true })}
                  />
                  <div className="flex gap-2">
                    <Select
                      variant="bordered"
                      className="max-w-xs"
                      defaultSelectedKeys={[currency]}
                      disallowEmptySelection
                      label="Select currency"
                      onChange={(e) =>
                        setCurrency(e.target.value as CurrencyOptions)
                      }
                    >
                      {currencyOptions.map((currency) => (
                        <SelectItem key={currency.name}>
                          {currency.name}
                        </SelectItem>
                      ))}
                    </Select>
                    <Input
                      isRequired
                      label={"Price"}
                      type="number"
                      variant="bordered"
                      defaultValue={currentSubscription?.price.toString()}
                      isInvalid={!!errors.price}
                      errorMessage={
                        errors.price?.message && errors.price.message
                      }
                      {...register("price", { required: true })}
                    />
                  </div>
                  <DatePicker
                    label={"Date"}
                    variant={"bordered"}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    defaultValue={date}
                    onChange={(date) => {
                      if (date) {
                        setDate(date);
                      }
                    }}
                  />
                  <div className="flex gap-2">
                    <Select
                      variant="bordered"
                      className="max-w-xs"
                      defaultSelectedKeys={[status]}
                      disallowEmptySelection
                      label="Select status"
                      onChange={(e) =>
                        setStatus(e.target.value as StatusOptions)
                      }
                    >
                      {statusOptions.map((status) => (
                        <SelectItem key={status.uid}>{status.name}</SelectItem>
                      ))}
                    </Select>
                    <Select
                      variant="bordered"
                      className="max-w-xs"
                      defaultSelectedKeys={[period]}
                      disallowEmptySelection
                      label="Select period"
                      onChange={(e) =>
                        setPeriod(e.target.value as PeriodOptions)
                      }
                    >
                      {periodOptions.map((period) => (
                        <SelectItem key={period.uid}>{period.name}</SelectItem>
                      ))}
                    </Select>
                  </div>
                  <Select
                    variant="bordered"
                    defaultSelectedKeys={[billingType]}
                    label="Select billing type"
                    disallowEmptySelection
                    onChange={(e) =>
                      setBillingType(e.target.value as BillingTypeOptions)
                    }
                  >
                    {billingTypeOptions.map((billingType) => (
                      <SelectItem key={billingType.uid}>
                        {billingType.name}
                      </SelectItem>
                    ))}
                  </Select>
                  <Button
                    color="primary"
                    isLoading={submitLoading}
                    type="submit"
                  >
                    {subscriptionIdParam ? "Update" : "Create"}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
