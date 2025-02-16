"use client";

import React, { useCallback } from "react";
import {
  Button,
  Input,
  Link,
  Divider,
  Modal,
  ModalContent,
  ModalBody,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { DiscordIcon } from "./social";
import { signIn } from "next-auth/react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";

const loginSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: z.string().min(1, {
    message: "Please enter your password",
  }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginForm() {
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
    router.push(pathname + "?" + createQueryString("credentials", "sign-up"), {
      scroll: false,
    });
  };

  const [isVisible, setIsVisible] = React.useState(false);
  const [signInLoading, setSignInLoading] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    try {
      setSignInLoading(true);

      const singInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (singInResult?.error) {
        toast.error("There was something wrong while login. Please try later", {
          position: "bottom-center",
          className: "text-center",
        });
      } else {
        router.push("/", { scroll: false });
        router.refresh();
        toast.success("You have successfully signed in", {
          position: "bottom-center",
          className: "text-center",
        });
      }

      setSignInLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error("Something went wrong while signing in");
    }
  };

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <Modal
      isOpen={credentialsParam === "login"}
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
              <p className="pb-2 text-xl font-medium">Login</p>
              <form
                className="flex flex-col gap-3"
                onSubmit={handleSubmit(onSubmit)}
                noValidate
              >
                <Input
                  label="Email Address"
                  placeholder="Enter your email"
                  type="email"
                  variant="bordered"
                  isInvalid={!!errors.email}
                  errorMessage={errors.email?.message && errors.email.message}
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
                  label="Password"
                  placeholder="Enter your password"
                  type={isVisible ? "text" : "password"}
                  variant="bordered"
                  isInvalid={!!errors.password}
                  errorMessage={
                    errors.password?.message && errors.password.message
                  }
                  {...register("password", { required: true })}
                />
                <Button
                  color="primary"
                  isLoading={signInLoading}
                  startContent={
                    <Icon
                      className="pointer-events-none text-2xl"
                      icon="solar:letter-bold"
                    />
                  }
                  type="submit"
                >
                  Continue with Email
                </Button>
              </form>
              <div className="flex items-center gap-4 py-2">
                <Divider className="flex-1" />
                <p className="shrink-0 text-tiny text-default-500">Or</p>
                <Divider className="flex-1" />
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  startContent={
                    <Icon icon="flat-color-icons:google" width={24} />
                  }
                  variant="flat"
                  onClick={async () => {
                    await signIn("google", {
                      redirect: false,
                    });
                  }}
                >
                  Continue with Google
                </Button>
                <Button
                  startContent={
                    <DiscordIcon width={24} className="text-[#5865F2]" />
                  }
                  variant="flat"
                  onClick={async () => {
                    await signIn("discord", {
                      redirect: false,
                    });
                  }}
                >
                  Continue with Discord
                </Button>
              </div>
              <p className="text-center text-small">
                Need to create an account?&nbsp;
                <Link
                  className="cursor-pointer"
                  onClick={handleClick}
                  size="sm"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
