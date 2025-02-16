"use client";

import { SuccessCircleSvg } from "./success-circle";
import { WarningCircleSvg } from "./warning-circle";

export const statusOptions = [
  { name: "Active", uid: "ACTIVE" },
  { name: "Paused", uid: "PAUSED" },
] as const;

export type StatusOptions = (typeof statusOptions)[number]["uid"];

export const statusColorMap: Record<StatusOptions, JSX.Element> = {
  ACTIVE: SuccessCircleSvg,
  PAUSED: WarningCircleSvg,
};

export type MemberInfo = {
  avatar: string;
  email: string;
  name: string;
};

export const currencyOptions = [
  { name: "USD", uid: "USD" },
  { name: "EUR", uid: "EUR" },
  { name: "GBP", uid: "GBP" },
] as const;

export type CurrencyOptions = (typeof currencyOptions)[number]["uid"];

export const billingTypeOptions = [
  { name: "Credit Card", uid: "CREDIT_CARD" },
  { name: "Paypal", uid: "PAYPAL" },
  { name: "Bank Transfer", uid: "BANK_TRANSFER" },
  { name: "ApplePay", uid: "APPLE_PAY" },
  { name: "Other", uid: "OTHER" },
] as const;

export type BillingTypeOptions = (typeof billingTypeOptions)[number]["uid"];

export const periodOptions = [
  { name: "Monthly", uid: "MONTHLY" },
  { name: "Yearly", uid: "YEARLY" },
] as const;

export type PeriodOptions = (typeof periodOptions)[number]["uid"];

export type Subscriptions = {
  id: number;
  subscriptionName: string;
  price: string;
  period: PeriodOptions;
  currency: CurrencyOptions;
  status: StatusOptions;
  billingDate: Date;
  billingType: BillingTypeOptions;
};

export type ColumnsKey =
  | "subscriptionName"
  | "period"
  | "status"
  | "billingDate"
  | "billingType"
  | "price"
  | "actions";

export const INITIAL_VISIBLE_COLUMNS: ColumnsKey[] = [
  "subscriptionName",
  "period",
  "status",
  "billingDate",
  "billingType",
  "price",
  "actions",
];

export const columns = [
  { name: "Name", uid: "subscriptionName", sortDirection: "ascending" },
  { name: "Period", uid: "period" },
  { name: "Status", uid: "status", info: "The subscription's current status" },
  {
    name: "Billing Date",
    uid: "billingDate",
    info: "The date the subscription's bill will come",
  },
  { name: "Billing Type", uid: "billingType" },
  { name: "Price", uid: "price" },
  { name: "Actions", uid: "actions" },
];

// const generateMockUserData = (count: number): Subscriptions[] => {
//   const mockData: Subscriptions[] = [];

//   for (let i = 0; i < count; i++) {
//     const user: Subscriptions = {
//       id: i,
//       subscriptionName: "subscriptionName",
//       period: "Monthly",
//       currency: "USD",
//       price: "3.99",
//       status:
//         Math.random() > 0.5
//           ? "Active"
//           : Math.random() > 0.5
//             ? "Paused"
//             : Math.random() > 0.5
//               ? "Vacation"
//               : "Inactive",
//       billingDate: new Date(
//         new Date().getTime() - Math.random() * (24 * 60 * 60 * 1000 * 40),
//       ),
//       billingType: "ApplePay",
//     };

//     mockData.push(user);
//   }

//   return mockData;
// };

// export const subscriptions: Subscriptions[] = generateMockUserData(100);
