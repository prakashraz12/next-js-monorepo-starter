"use client";

import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";

type PageParam = {
  hasNextPage: boolean;
  page: number;
  take: number;
};

type WithObservableProps<T> = {
  queryKey?: string[];
  queryFn: (
    pageParam: PageParam,
  ) => Promise<{ data: T[]; pagination?: { nextPage?: number | null } }>;
  renderItem: (item: T) => React.ReactNode;
  loaderComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  rootMargin?: string;
  take?: number;
  title?: string;
  containerClassName?: string;
  dependencies?: unknown[];
  skeletonCount?: number;
};

const SCROLL_CONTAINER_ID = "with-observable-scroll-container";

const WithObservable = <T,>({
  queryKey,
  queryFn,
  renderItem,
  loaderComponent,
  emptyComponent,
  take = 10,
  containerClassName,
  dependencies = [],
  skeletonCount = 8,
}: WithObservableProps<T>) => {
  const {
    data: results,
    fetchNextPage,
    hasNextPage,
    isPending,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["infinite", ...(queryKey || []), ...dependencies],
    queryFn: ({ pageParam }: { pageParam: PageParam }) => queryFn(pageParam),
    initialPageParam: {
      hasNextPage: false,
      page: 0,
      take,
    },
    getNextPageParam: (data) => {
      if (data?.pagination?.nextPage) {
        return {
          hasNextPage: true,
          page: data.pagination.nextPage,
          take,
        };
      }
      return undefined;
    },
  });

  const allItems = results?.pages?.flatMap((page) => page?.data) ?? [];

  const loadingSkeletons = (count: number, keyPrefix: string) =>
    loaderComponent
      ? Array.from({ length: count }, (_, index) => (
          <div key={`${keyPrefix}-${index}`}>{loaderComponent}</div>
        ))
      : null;

  if (isPending) {
    return (
      <div className="h-full w-full">
        <div className="no-scrollbar flex h-full w-full flex-col overflow-y-scroll">
          <div className={containerClassName}>
            {loadingSkeletons(skeletonCount, "skeleton")}
          </div>
        </div>
      </div>
    );
  }

  if (!isPending && allItems.length === 0) {
    return (
      <div className="h-full w-full">
        <div className="no-scrollbar flex h-full w-full flex-col overflow-y-scroll">
          {emptyComponent}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <div
        id={SCROLL_CONTAINER_ID}
        className="no-scrollbar flex h-full w-full flex-col overflow-y-scroll"
      >
        <InfiniteScroll
          dataLength={allItems.length}
          next={fetchNextPage}
          hasMore={!!hasNextPage}
          loader={
            isFetchingNextPage ? (
              <div className={containerClassName}>
                {loadingSkeletons(2, "loading-more")}
              </div>
            ) : null
          }
          scrollableTarget={SCROLL_CONTAINER_ID}
          style={{ overflow: "visible" }}
        >
          <div className={containerClassName}>
            {allItems.map((item, index) => (
              <React.Fragment key={index}>{renderItem(item)}</React.Fragment>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default WithObservable;
