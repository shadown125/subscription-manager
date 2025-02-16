"use client";

import type { Selection, SortDescriptor } from "@heroui/react";
import type { ColumnsKey, StatusOptions } from "./data";
import type { Key } from "@react-types/shared";

import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  RadioGroup,
  Radio,
  Chip,
  Pagination,
  Divider,
  Tooltip,
  useButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Skeleton,
} from "@heroui/react";
import { SearchIcon } from "@heroui/shared-icons";
import React, { useMemo, useRef, useCallback, useState } from "react";
import { Icon } from "@iconify/react";
import { cn } from "@heroui/react";

import { EditLinearIcon } from "./edit";
import { DeleteFilledIcon } from "./delete";
import { ArrowDownIcon } from "./arrow-down";
import { ArrowUpIcon } from "./arrow-up";

import { useMemoizedCallback } from "./use-memoized-callback";

import { columns, INITIAL_VISIBLE_COLUMNS } from "./data";
import { Status } from "./status";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { api } from "@/trpc/react";
import { type Subscriptions } from "@/server/db/schema";
import toast from "react-hot-toast";
import { textPrettify } from "@/utils";

export default function SubscriptionsTable() {
  const { data: subscriptions, isLoading } = api.subscription.get.useQuery();

  return (
    <>
      {isLoading ? (
        <Skeleton className="h-32 w-full rounded-md" />
      ) : (
        <SubscriptionsTableRaw subscriptions={subscriptions} />
      )}
    </>
  );
}

function SubscriptionsTableRaw({
  subscriptions,
}: {
  subscriptions: Subscriptions[] | undefined;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const utils = api.useUtils();

  const { mutate: deleteSubscription } = api.subscription.delete.useMutation();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const handleClick = () => {
    router.push(pathname + "?" + createQueryString("subscription", "open"), {
      scroll: false,
    });
  };

  const onEdit = (id: number) => {
    router.push(
      pathname +
        "?" +
        createQueryString("subscription", "open") +
        "&" +
        createQueryString("subscription-id", String(id)),
      {
        scroll: false,
      },
    );
  };

  const onDelete = (id: number) => {
    try {
      if (!id) {
        throw new Error("Task not found");
      }

      deleteSubscription(
        {
          id: id,
        },
        {
          onError() {
            toast.error("Something went wrong while deleting subscription", {
              position: "bottom-center",
              className: "text-center",
            });
          },
          async onSuccess() {
            await utils.subscription.get.invalidate();
          },
        },
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new Error("Something went wrong while deleting the task");
    }
  };

  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState<Selection>(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [rowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "subscriptionName",
    direction: "ascending",
  });

  const [statusFilter, setStatusFilter] = React.useState("all");
  const [billingDateFilter, setBillingDateFilter] = React.useState("all");

  const headerColumns = useMemo(() => {
    if (visibleColumns === "all") return columns;

    return columns
      .map((item) => {
        if (item.uid === sortDescriptor.column) {
          return {
            ...item,
            sortDirection: sortDescriptor.direction,
          };
        }

        return item;
      })
      .filter((column) => Array.from(visibleColumns).includes(column.uid));
  }, [visibleColumns, sortDescriptor]);

  const itemFilter = useCallback(
    (col: Subscriptions) => {
      const allStatus = statusFilter === "all";
      const allbillingDate = billingDateFilter === "all";

      return (
        (allStatus || statusFilter === col.status.toLowerCase()) &&
        (allbillingDate ||
          new Date(
            new Date().getTime() -
              +(/(\d+)(?=Days)/.exec(billingDateFilter)?.[0] ?? 0) *
                24 *
                60 *
                60 *
                1000,
          ) <= new Date(col.billingDate))
      );
    },
    [billingDateFilter, statusFilter],
  );

  const filteredItems = useMemo(() => {
    let filteredUsers = [...(subscriptions ?? [])];

    if (filterValue) {
      filteredUsers = filteredUsers.filter((user) =>
        user.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    filteredUsers = filteredUsers.filter(itemFilter);

    return filteredUsers;
  }, [filterValue, itemFilter, subscriptions]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a: Subscriptions, b: Subscriptions) => {
      const col = sortDescriptor.column as keyof Subscriptions;

      let first = a[col];
      let second = b[col];

      if (col === "name") {
        first = a[col];
        second = b[col];
      }

      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const filterSelectedKeys = useMemo(() => {
    if (selectedKeys === "all") return selectedKeys;
    let resultKeys = new Set<Key>();

    if (filterValue) {
      filteredItems.forEach((item) => {
        const stringId = String(item.id);

        if ((selectedKeys as Set<string>).has(stringId)) {
          resultKeys.add(stringId);
        }
      });
    } else {
      resultKeys = selectedKeys;
    }

    return resultKeys;
  }, [selectedKeys, filteredItems, filterValue]);

  const editRef = useRef<HTMLButtonElement | null>(null);
  const deleteRef = useRef<HTMLButtonElement | null>(null);
  const { getButtonProps: getEditProps } = useButton({ ref: editRef });
  const { getButtonProps: getDeleteProps } = useButton({ ref: deleteRef });
  const getMemberInfoProps = useMemoizedCallback(() => ({
    onClick: handleMemberClick,
  }));

  const renderCell = useMemoizedCallback(
    (user: Subscriptions, columnKey: React.Key) => {
      const userKey = columnKey as ColumnsKey;

      const cellValue = user[
        userKey as unknown as keyof Subscriptions
      ] as string;

      switch (userKey) {
        case "subscriptionName":
          return <p>{user.name}</p>;
        case "billingDate":
          return (
            <div className="flex items-center gap-1">
              <Icon
                className="h-[16px] w-[16px] text-default-300"
                icon="solar:calendar-minimalistic-linear"
              />
              <p className="text-nowrap text-small capitalize text-default-foreground">
                {new Intl.DateTimeFormat("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date(cellValue) as unknown as Date)}
              </p>
            </div>
          );
        case "price":
          return (
            <div className="flex items-center gap-1">
              <p className="text-nowrap text-small capitalize text-default-foreground">
                {user.currency === "USD"
                  ? "$"
                  : user.currency === "EUR"
                    ? "€"
                    : "£"}
                {cellValue}
              </p>
            </div>
          );
        case "status":
          return <Status status={textPrettify(cellValue) as StatusOptions} />;
        case "actions":
          return (
            <div className="flex items-center justify-end gap-2">
              <Tooltip content="Edit subscription">
                <span className="cursor-pointer text-lg text-default-400 active:opacity-50">
                  <EditLinearIcon
                    {...getEditProps()}
                    onClick={() => onEdit(user.id)}
                    className="cursor-pointer text-default-400"
                    height={18}
                    width={18}
                  />
                </span>
              </Tooltip>
              <Tooltip color="danger" content="Delete subscription">
                <span className="cursor-pointer text-lg text-danger active:opacity-50">
                  <DeleteFilledIcon
                    {...getDeleteProps()}
                    onClick={() => onDelete(user.id)}
                    className="cursor-pointer"
                    height={18}
                    width={18}
                  />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return textPrettify(cellValue);
      }
    },
  );

  const onNextPage = useMemoizedCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  });

  const onPreviousPage = useMemoizedCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  });

  const onSearchChange = useMemoizedCallback((value?: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  });

  const onSelectionChange = useMemoizedCallback((keys: Selection) => {
    if (keys === "all") {
      if (filterValue) {
        const resultKeys = new Set(
          filteredItems.map((item) => String(item.id)),
        );

        setSelectedKeys(resultKeys);
      } else {
        setSelectedKeys(keys);
      }
    } else if (keys.size === 0) {
      setSelectedKeys(new Set());
    } else {
      const resultKeys = new Set<Key>();

      keys.forEach((v) => {
        resultKeys.add(v);
      });
      const selectedValue =
        selectedKeys === "all"
          ? new Set(filteredItems.map((item) => String(item.id)))
          : selectedKeys;

      selectedValue.forEach((v) => {
        if (items.some((item) => String(item.id) === v)) {
          return;
        }
        resultKeys.add(v);
      });
      setSelectedKeys(new Set(resultKeys));
    }
  });

  const topContent = useMemo(() => {
    return (
      <div className="flex items-center gap-4 overflow-auto px-[6px] py-[4px]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-4">
            <Input
              className="min-w-[200px]"
              endContent={
                <SearchIcon className="text-default-400" width={16} />
              }
              placeholder="Search"
              size="sm"
              value={filterValue}
              onValueChange={onSearchChange}
            />
            <div>
              <Popover placement="bottom">
                <PopoverTrigger>
                  <Button
                    className="bg-default-100 text-default-800"
                    size="sm"
                    startContent={
                      <Icon
                        className="text-default-400"
                        icon="solar:tuning-2-linear"
                        width={16}
                      />
                    }
                  >
                    Filter
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="flex w-full flex-col gap-6 px-2 py-4">
                    <RadioGroup
                      label="Status"
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      <Radio value="all">All</Radio>
                      <Radio value="active">Active</Radio>
                      <Radio value="inactive">Inactive</Radio>
                    </RadioGroup>

                    <RadioGroup
                      label="Start Date"
                      value={billingDateFilter}
                      onValueChange={setBillingDateFilter}
                    >
                      <Radio value="all">All</Radio>
                      <Radio value="last7Days">Last 7 days</Radio>
                      <Radio value="last30Days">Last 30 days</Radio>
                      <Radio value="last60Days">Last 60 days</Radio>
                    </RadioGroup>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    className="bg-default-100 text-default-800"
                    size="sm"
                    startContent={
                      <Icon
                        className="text-default-400"
                        icon="solar:sort-linear"
                        width={16}
                      />
                    }
                  >
                    Sort
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Sort"
                  items={headerColumns.filter(
                    (c) => !["actions", "teams"].includes(c.uid),
                  )}
                >
                  {(item) => (
                    <DropdownItem
                      key={item.uid}
                      onPress={() => {
                        setSortDescriptor({
                          column: item.uid,
                          direction:
                            sortDescriptor.direction === "ascending"
                              ? "descending"
                              : "ascending",
                        });
                      }}
                    >
                      {item.name}
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
            <div>
              <Dropdown closeOnSelect={false}>
                <DropdownTrigger>
                  <Button
                    className="bg-default-100 text-default-800"
                    size="sm"
                    startContent={
                      <Icon
                        className="text-default-400"
                        icon="solar:sort-horizontal-linear"
                        width={16}
                      />
                    }
                  >
                    Columns
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Columns"
                  items={columns.filter((c) => !["actions"].includes(c.uid))}
                  selectedKeys={visibleColumns}
                  selectionMode="multiple"
                  onSelectionChange={setVisibleColumns}
                >
                  {(item) => (
                    <DropdownItem key={item.uid}>{item.name}</DropdownItem>
                  )}
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>

          <Divider className="h-5" orientation="vertical" />

          <div className="whitespace-nowrap text-sm text-default-800">
            {filterSelectedKeys === "all"
              ? "All items selected"
              : `${filterSelectedKeys.size} Selected`}
          </div>

          {(filterSelectedKeys === "all" || filterSelectedKeys.size > 0) && (
            <Dropdown>
              <DropdownTrigger>
                <Button
                  className="bg-default-100 text-default-800"
                  endContent={
                    <Icon
                      className="text-default-400"
                      icon="solar:alt-arrow-down-linear"
                    />
                  }
                  size="sm"
                  variant="flat"
                >
                  Selected Actions
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Selected Actions">
                <DropdownItem color="danger" key="delete">
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
      </div>
    );
  }, [
    filterValue,
    visibleColumns,
    filterSelectedKeys,
    headerColumns,
    sortDescriptor,
    statusFilter,
    billingDateFilter,
    setStatusFilter,
    setBillingDateFilter,
    onSearchChange,
    setVisibleColumns,
  ]);

  const topBar = useMemo(() => {
    return (
      <div className="mb-[18px] flex items-center justify-between">
        <div className="flex w-[226px] items-center gap-2">
          <h1 className="text-2xl font-[700] leading-[32px]">Subscriptions</h1>
          <Chip
            className="hidden items-center text-default-500 sm:flex"
            size="sm"
            variant="flat"
          >
            {subscriptions?.length ?? 0}
          </Chip>
        </div>
        <Button
          color="primary"
          onPress={handleClick}
          endContent={<Icon icon="solar:add-circle-bold" width={20} />}
        >
          Add Subscription
        </Button>
      </div>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex flex-col items-center justify-between gap-2 px-2 py-2 sm:flex-row">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="flex items-center justify-end gap-6">
          <span className="text-small text-default-400">
            {filterSelectedKeys === "all"
              ? "All items selected"
              : `${filterSelectedKeys.size} of ${filteredItems.length} selected`}
          </span>
          <div className="flex items-center gap-3">
            <Button
              isDisabled={page === 1}
              size="sm"
              variant="flat"
              onPress={onPreviousPage}
            >
              Previous
            </Button>
            <Button
              isDisabled={page === pages}
              size="sm"
              variant="flat"
              onPress={onNextPage}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  }, [
    filterSelectedKeys,
    page,
    pages,
    filteredItems.length,
    onPreviousPage,
    onNextPage,
  ]);

  const handleMemberClick = useMemoizedCallback(() => {
    setSortDescriptor({
      column: "subscriptionName",
      direction:
        sortDescriptor.direction === "ascending" ? "descending" : "ascending",
    });
  });

  return (
    <div className="h-full w-full p-6">
      {topBar}
      <Table
        isHeaderSticky
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={{
          td: "before:bg-transparent",
        }}
        selectedKeys={filterSelectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={onSelectionChange}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "end" : "start"}
              className={cn([
                column.uid === "actions"
                  ? "flex items-center justify-end px-[20px]"
                  : "",
              ])}
            >
              {column.uid === "memberInfo" ? (
                <div
                  {...getMemberInfoProps()}
                  className="flex w-full cursor-pointer items-center justify-between"
                >
                  {column.name}
                  {column.sortDirection === "ascending" ? (
                    <ArrowUpIcon className="text-default-400" />
                  ) : (
                    <ArrowDownIcon className="text-default-400" />
                  )}
                </div>
              ) : column.info ? (
                <div className="flex min-w-[108px] items-center gap-2">
                  {column.name}
                  <Tooltip content={column.info}>
                    <Icon
                      className="text-default-300"
                      height={16}
                      icon="solar:info-circle-linear"
                      width={16}
                    />
                  </Tooltip>
                </div>
              ) : (
                column.name
              )}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody emptyContent={"No subscriptions found"} items={sortedItems}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
