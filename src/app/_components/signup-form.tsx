"use client";

import React, { useCallback, useState } from "react";
import {
  Button,
  Input,
  Link,
  Divider,
  Modal,
  ModalContent,
  ModalBody,
  Checkbox,
} from "@heroui/react";
import { AnimatePresence, m, LazyMotion, domAnimation } from "framer-motion";
import { Icon } from "@iconify/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { hashPassword } from "@/utils";
import toast from "react-hot-toast";
import { api } from "@/trpc/react";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(1, {
        message: "enter-name",
      })
      .max(60, {
        message: "name-too-long",
      }),
    email: z.string().email({
      message: "valid-email",
    }),
    password: z
      .string()
      .min(1, {
        message: "enter-password",
      })
      .max(60, {
        message: "password-too-long",
      }),
    repeatPassword: z.string().min(1, {
      message: "valid-repeat-password",
    }),
  })
  .refine(
    (data) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      return data.password === data.repeatPassword;
    },
    {
      message: "passwords-dont-match",
      path: ["repeatPassword"],
    },
  );

export type RegisterSchema = z.infer<typeof registerSchema>;

export default function SignupForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const credentialsParam = searchParams.get("credentials");

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

  const [isVisible, setIsVisible] = React.useState(false);
  const [isFormVisible, setIsFormVisible] = React.useState(false);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [checkbox, setCheckbox] = useState(true);

  const variants = {
    visible: { opacity: 1, y: 0 },
    hidden: { opacity: 0, y: 10 },
  };

  const { mutate: user } = api.user.create.useMutation();

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      repeatPassword: "",
    },
  });

  const onSubmit: SubmitHandler<RegisterSchema> = async (data) => {
    if (!checkbox) return;

    try {
      setSignUpLoading(true);

      const { email, password, name } = data;
      const hashedPassword = await hashPassword(password);

      user(
        {
          email,
          password: hashedPassword,
          name,
        },
        {
          onError() {
            setSignUpLoading(false);

            toast.error("Something went wrong while creating account", {
              position: "bottom-center",
              className: "text-center",
            });
          },
          async onSuccess() {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            await signIn("credentials", {
              callbackUrl: "/dashboard",
              email: email,
              password: password,
            });

            setSignUpLoading(false);
            router.refresh();
            reset();
            router.push(pathname, { scroll: false });
            toast.error("You have successfully sign up", {
              position: "bottom-center",
              className: "text-center",
            });
          },
        },
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error("Something went wrong with creating your account");
    }
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  const orDivider = (
    <div className="flex items-center gap-4 py-2">
      <Divider className="flex-1" />
      <p className="shrink-0 text-tiny text-default-500">OR</p>
      <Divider className="flex-1" />
    </div>
  );

  return (
    <Modal
      isOpen={credentialsParam === "sign-up"}
      placement="center"
      onOpenChange={() => {
        router.push(pathname, { scroll: false });
      }}
      className="mt-4 max-h-[90vh] overflow-auto p-0"
    >
      <ModalContent className="p-0">
        <ModalBody className="bg-content1 shadow-small">
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex w-full max-w-sm flex-col gap-4 rounded-large bg-content1 pb-10 pt-6">
              <LazyMotion features={domAnimation}>
                <h1 className="mb-4 text-center text-xl font-medium">
                  Sign Up
                </h1>
                <p className="text-center text-default-500">
                  Unlock more features and recipes with free account
                </p>
                <AnimatePresence initial={false} mode="popLayout">
                  {isFormVisible ? (
                    <m.form
                      animate="visible"
                      className="flex flex-col gap-y-3"
                      exit="hidden"
                      initial="hidden"
                      variants={variants}
                      id="signup-form"
                      onSubmit={handleSubmit(onSubmit)}
                      noValidate
                    >
                      <Input
                        autoFocus
                        isRequired
                        label={"Name"}
                        type="text"
                        variant="bordered"
                        isInvalid={!!errors.name}
                        errorMessage={
                          errors.name?.message && errors.name.message
                        }
                        {...register("name", { required: true })}
                      />
                      <Input
                        isRequired
                        label={"Email Address"}
                        type="email"
                        variant="bordered"
                        isInvalid={!!errors.email}
                        errorMessage={
                          errors.email?.message && errors.email.message
                        }
                        {...register("email", { required: true })}
                      />
                      <Input
                        endContent={
                          <button type="button" onClick={toggleVisibility}>
                            {isVisible ? (
                              <Icon
                                className="pointer-events-none text-2xl text-default-400"
                                icon="solar:eye-closed-linear"
                              />
                            ) : (
                              <Icon
                                className="pointer-events-none text-2xl text-default-400"
                                icon="solar:eye-bold"
                              />
                            )}
                          </button>
                        }
                        isRequired
                        label={"Password"}
                        type={isVisible ? "text" : "password"}
                        variant="bordered"
                        isInvalid={!!errors.password}
                        errorMessage={
                          errors.password?.message && errors.password.message
                        }
                        {...register("password", { required: true })}
                      />
                      <Input
                        isRequired
                        label={"Confirm Password"}
                        isInvalid={!!errors.repeatPassword}
                        errorMessage={
                          errors.repeatPassword?.message &&
                          errors.repeatPassword.message
                        }
                        type={isVisible ? "text" : "password"}
                        variant="bordered"
                        {...register("repeatPassword", { required: true })}
                      />
                      <Checkbox
                        isRequired
                        defaultSelected
                        isInvalid={!checkbox}
                        onChange={(e) => setCheckbox(e.target.checked)}
                        className="py-4"
                        size="sm"
                      >
                        I read and agree with the&nbsp;
                        <Link href="/terms-of-service" size="sm">
                          Terms
                        </Link>
                        &nbsp; and&nbsp;
                        <Link href="/privacy-policy" size="sm">
                          Privacy Policy
                        </Link>
                      </Checkbox>
                      <Button
                        color="primary"
                        isLoading={signUpLoading}
                        type="submit"
                      >
                        Sign Up
                      </Button>
                      {orDivider}
                      <Button
                        fullWidth
                        startContent={
                          <Icon
                            className="text-default-500"
                            icon="solar:arrow-left-linear"
                            width={18}
                          />
                        }
                        variant="flat"
                        onPress={() => setIsFormVisible(false)}
                      >
                        Other Sign Up options
                      </Button>
                    </m.form>
                  ) : (
                    <div>
                      <Button
                        fullWidth
                        color="primary"
                        startContent={
                          <Icon
                            className="pointer-events-none text-2xl"
                            icon="solar:letter-bold"
                          />
                        }
                        type="button"
                        onPress={() => setIsFormVisible(true)}
                      >
                        Continue with Email
                      </Button>
                      {orDivider}
                      <m.div
                        animate="visible"
                        className="flex flex-col gap-y-2"
                        exit="hidden"
                        initial="hidden"
                        variants={variants}
                      >
                        <Button
                          fullWidth
                          startContent={
                            <Icon icon="flat-color-icons:google" width={24} />
                          }
                          variant="flat"
                          onPress={async () => {
                            await signIn("google", {
                              redirectTo: "/dashboard",
                            });
                          }}
                        >
                          Continue with Google
                        </Button>
                        <Button
                          fullWidth
                          startContent={
                            <Icon
                              className="text-default-500"
                              icon="fe:github"
                              width={24}
                            />
                          }
                          variant="flat"
                          onPress={async () => {
                            await signIn("discord", {
                              callbackUrl: "/dashboard",
                            });
                          }}
                        >
                          Continue with Discord
                        </Button>
                        <p className="mt-3 text-center text-small">
                          Already have an account?&nbsp;
                          <Link
                            className="cursor-pointer"
                            onPress={handleClick}
                            size="sm"
                          >
                            Log In
                          </Link>
                        </p>
                      </m.div>
                    </div>
                  )}
                </AnimatePresence>
              </LazyMotion>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
