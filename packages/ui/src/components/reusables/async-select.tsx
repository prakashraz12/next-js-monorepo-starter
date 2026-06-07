/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentProps,
} from "react";
import { isEqual } from "lodash";
import {
  ChevronDown,
  Loader2,
  PlusIcon,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "../button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../command";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { cn } from "@repo/ui/lib/utils";

// ─── useDebounce (inline so the file is self-contained) ──────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [dv, setDv] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDv(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return dv;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type TOption = {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  isDefault?: boolean;
  hideInList?: boolean;
  keywords?: string[];
  disabled?: boolean;
  /** Set true to show the per-item delete button */
  renderAPIDelete?: boolean;
};

// ─── Fetch helpers ────────────────────────────────────────────────────────────

type TFetcherResponse<Item> =
  | { data: Item[]; hasNextPage: boolean }
  | { data: Item[]; pagination?: { nextPage?: number | null } };

/** Generated list API fetcher, e.g. `fetchCustomerControllerGetCustomers` */
export type TServiceFetcherFn<Item = any> = (
  variables: {
    queryParams?: {
      page?: number;
      take?: number;
      search?: string;
      [key: string]: unknown;
    };
  },
  signal?: AbortSignal,
) => Promise<TFetcherResponse<Item>>;

type TFetcherConfig<Item = any> = {
  fn: TServiceFetcherFn<Item>;
  take?: number;
  getValueFromItem?: (item: Item) => string;
  getLabelFromItem?: (item: Item) => string;
  getIconFromItem?: (item: Item) => React.ReactNode;
  getDescriptionFromItem?: (item: Item) => string | undefined;
  getKeywordsFromItem?: (item: Item) => string[];
  /** Pass a unique key so React Query (if used externally) can cache it */
  queryKey?: string;
  /** Filter fetched results client-side when true */
  withClientSearch?: boolean;
  /** Fires after each item click */
  onItemSelect?: (item: Item, isDeselected: boolean) => void;
};

export type TFetcher<Item = any> =
  | TServiceFetcherFn<Item>
  | TFetcherConfig<Item>;

type ResolvedFetcher<Item = any> = {
  fn: (
    params: { query: string; page: number },
    signal?: AbortSignal,
  ) => Promise<{
    data: Item[];
    hasNextPage: boolean;
  }>;
  getValueFromItem: (item: Item) => string;
  getLabelFromItem: (item: Item) => string;
  getIconFromItem?: (item: Item) => React.ReactNode;
  getDescriptionFromItem?: (item: Item) => string | undefined;
  getKeywordsFromItem?: (item: Item) => string[];
  queryKey?: string;
  withClientSearch?: boolean;
  onItemSelect?: (item: Item, isDeselected: boolean) => void;
};

function normalizeFetchResponse<Item>(response: TFetcherResponse<Item>): {
  data: Item[];
  hasNextPage: boolean;
} {
  if ("hasNextPage" in response) {
    return response;
  }

  return {
    data: response.data,
    hasNextPage: response.pagination?.nextPage != null,
  };
}

function defaultGetValueFromItem(item: any): string {
  return String(item?.id ?? item?.value ?? "");
}

function defaultGetLabelFromItem(item: any): string {
  return String(
    item?.label ??
      item?.name ??
      item?.customerName ??
      item?.title ??
      item?.id ??
      "",
  );
}

function defaultGetDescriptionFromItem(item: any): string | undefined {
  return item?.description ?? item?.customerEmail ?? item?.email ?? undefined;
}

function defaultGetKeywordsFromItem(item: any): string[] {
  return [
    defaultGetLabelFromItem(item),
    defaultGetDescriptionFromItem(item),
  ].filter(Boolean) as string[];
}

function createServiceFetchWrapper<Item>(
  serviceFn: TServiceFetcherFn<Item>,
  take: number,
): ResolvedFetcher<Item>["fn"] {
  return async ({ query, page }, signal) => {
    const queryParams: { page: number; take: number; search?: string } = {
      page,
      take,
    };

    if (query.length > 0) {
      queryParams.search = query;
    }

    return normalizeFetchResponse(await serviceFn({ queryParams }, signal));
  };
}

function resolveFetcher<Item>(
  fetcher: TFetcher<Item>,
  take = 10,
  overrides?: Partial<
    Pick<
      ResolvedFetcher<Item>,
      | "getValueFromItem"
      | "getLabelFromItem"
      | "getIconFromItem"
      | "getDescriptionFromItem"
      | "getKeywordsFromItem"
    >
  >,
): ResolvedFetcher<Item> {
  const base =
    typeof fetcher === "function"
      ? {
          fn: createServiceFetchWrapper(fetcher, take),
          getValueFromItem: defaultGetValueFromItem,
          getLabelFromItem: defaultGetLabelFromItem,
          getDescriptionFromItem: defaultGetDescriptionFromItem,
          getKeywordsFromItem: defaultGetKeywordsFromItem,
        }
      : {
          fn: createServiceFetchWrapper(fetcher.fn, fetcher.take ?? take),
          getValueFromItem: fetcher.getValueFromItem ?? defaultGetValueFromItem,
          getLabelFromItem: fetcher.getLabelFromItem ?? defaultGetLabelFromItem,
          getIconFromItem: fetcher.getIconFromItem,
          getDescriptionFromItem:
            fetcher.getDescriptionFromItem ?? defaultGetDescriptionFromItem,
          getKeywordsFromItem:
            fetcher.getKeywordsFromItem ?? defaultGetKeywordsFromItem,
          queryKey: fetcher.queryKey,
          withClientSearch: fetcher.withClientSearch,
          onItemSelect: fetcher.onItemSelect,
        };

  if (!overrides) return base;

  return {
    ...base,
    getValueFromItem: overrides.getValueFromItem ?? base.getValueFromItem,
    getLabelFromItem: overrides.getLabelFromItem ?? base.getLabelFromItem,
    getIconFromItem: overrides.getIconFromItem ?? base.getIconFromItem,
    getDescriptionFromItem:
      overrides.getDescriptionFromItem ?? base.getDescriptionFromItem,
    getKeywordsFromItem:
      overrides.getKeywordsFromItem ?? base.getKeywordsFromItem,
  };
}

export type AsyncSelectItemMappers<Item = any> = {
  getValueFromItem?: (item: Item) => string;
  getLabelFromItem?: (item: Item) => string;
  getIconFromItem?: (item: Item) => React.ReactNode;
  getDescriptionFromItem?: (item: Item) => string | undefined;
  getKeywordsFromItem?: (item: Item) => string[];
};

export function buildFetcherWithMappers<Item>(
  fetcher: TServiceFetcherFn<Item>,
  mappers?: AsyncSelectItemMappers<Item>,
  take?: number,
): TFetcher<Item> {
  if (
    !mappers?.getValueFromItem &&
    !mappers?.getLabelFromItem &&
    !mappers?.getIconFromItem &&
    !mappers?.getDescriptionFromItem &&
    !mappers?.getKeywordsFromItem
  ) {
    return fetcher;
  }

  return {
    fn: fetcher,
    take,
    ...mappers,
  };
}

type TCreate =
  | { type: "hard"; callback?: (value: string) => void }
  | { type: "soft"; uniqueBy: "value" | "label" }
  | { type: "form"; label: React.ReactNode; onOpen: () => void };

type TItemSlotProps = {
  props: {
    className: string;
    disabled: boolean;
    value: string;
    selected: boolean;
    onSelect: () => void;
    keywords: string[];
  };
  option: TOption;
  isSelected: boolean;
  Component: typeof CommandItem;
};

type TComponents = {
  /** Completely replaces trigger interior */
  trigger?: (props: {
    selected: TOption | TOption[];
    label: string;
  }) => React.ReactNode;
  /** Completely replaces each row interior */
  item?: (props: TItemSlotProps) => React.ReactNode;
  /** Replaces just the icon part */
  icon?: (props: {
    value?: React.ReactNode;
    isTrigger?: boolean;
  }) => React.ReactNode;
};

export type AsyncSelectProps<Item = any> = {
  // ── Data ────────────────────────────────────────────────────────────────────
  options?: TOption[];
  fetcher?: TFetcher<Item>;
  /** Page size used when `fetcher` is a generated service fetch function */
  fetcherTake?: number;
  /** Override item mappers when using a service fetcher */
  getValueFromItem?: (item: Item) => string;
  getLabelFromItem?: (item: Item) => string;
  getIconFromItem?: (item: Item) => React.ReactNode;
  getDescriptionFromItem?: (item: Item) => string | undefined;
  getKeywordsFromItem?: (item: Item) => string[];
  /** Bumps remount/refetch when changed — use after clear */
  resetKey?: number | string;

  // ── Selection ───────────────────────────────────────────────────────────────
  type?: "single" | "multiple";
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  onOptionSelect?: (item: TOption, isDeselected: boolean) => void;
  deselectable?: boolean;
  autoSelectFirst?: boolean;
  disabledOptions?: string[];

  // ── Inline-searchable mode ───────────────────────────────────────────────────
  /**
   * When true the trigger itself becomes a search input.
   * Results drop below it — no Popover needed.
   */
  searchable?: boolean;

  // ── Create ──────────────────────────────────────────────────────────────────
  create?: TCreate;

  // ── Delete ──────────────────────────────────────────────────────────────────
  remove?: {
    title?: string;
    description?: string;
    onConfirm: (value: string) => void;
  };

  // ── Behaviour ───────────────────────────────────────────────────────────────
  withSearch?: boolean;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  debounceMs?: number;
  disabled?: boolean;
  minQueryLength?: number;
  ignoreMaxHeight?: boolean;
  forcedPopoverHeight?: number;
  itemHeight?: number;
  maxLabelCount?: number;
  prependLabel?: string;
  forceShowPrependLabel?: boolean;

  // ── Render slots ────────────────────────────────────────────────────────────
  components?: TComponents;
  renderIconWithLabel?: boolean;
  renderIconOnly?: boolean;
  dropdownDisplayVariant?: "default" | "tags";

  // ── Misc ────────────────────────────────────────────────────────────────────
  showDropIcon?: boolean;
  dropIconVariant?: "outline" | "default";
  onFilterRemove?: () => void;
  onQueryChange?: (value: string) => void;
  onKeyDown?: React.KeyboardEventHandler<
    HTMLButtonElement | HTMLDivElement | HTMLInputElement
  >;
  id?: string;

  // ── Style ───────────────────────────────────────────────────────────────────
  classNames?: {
    trigger?: string;
    item?: string;
    dropdownIcon?: string;
    filterRemoveTrigger?: string;
    searchInput?: string;
    dropdown?: string;
  };
  popover?: {
    content?: ComponentProps<typeof PopoverContent>;
    trigger?: ComponentProps<typeof PopoverTrigger>;
  };
};

function MultiSelectTags({
  selected,
  options,
  maxCount,
  onRemove,
  onClearExtra,
}: {
  selected: string[];
  options: TOption[];
  maxCount: number;
  onRemove: (value: string) => void;
  onClearExtra: () => void;
}) {
  const visible = options.slice(0, maxCount);
  const extra = options.length - maxCount;
  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((opt) => (
        <span
          key={opt.value}
          className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-0.5 text-xs font-medium"
        >
          {opt.label}
          <X
            size={10}
            className="cursor-pointer opacity-60 hover:opacity-100"
            onClick={(e) => {
              e.stopPropagation();
              onRemove(opt.value);
            }}
          />
        </span>
      ))}
      {extra > 0 && (
        <span
          className="inline-flex cursor-pointer items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium"
          onClick={(e) => {
            e.stopPropagation();
            onClearExtra();
          }}
        >
          +{extra} more
        </span>
      )}
    </div>
  );
}

function AsyncSelectInner<Item = any>(
  {
    type = "single",
    options: _options = [],
    fetcher,
    fetcherTake = 10,
    getValueFromItem,
    getLabelFromItem,
    getIconFromItem,
    getDescriptionFromItem,
    getKeywordsFromItem,
    resetKey,
    value,
    onChange,
    onOptionSelect,
    deselectable,
    autoSelectFirst,
    disabledOptions = [],
    searchable = false,
    create,
    remove,
    withSearch = true,
    placeholder = "Select an option…",
    searchPlaceholder = "Search…",
    emptyMessage = "No results found.",
    debounceMs = 300,
    disabled = false,
    minQueryLength = 0,
    ignoreMaxHeight = false,
    forcedPopoverHeight,
    itemHeight = 44,
    maxLabelCount,
    prependLabel,
    forceShowPrependLabel,
    components,
    renderIconWithLabel,
    renderIconOnly,
    dropdownDisplayVariant = "default",
    showDropIcon = true,
    dropIconVariant = "default",
    onFilterRemove,
    onQueryChange,
    onKeyDown,
    id,
    classNames,
    popover,
  }: AsyncSelectProps<Item>,
  ref: React.Ref<HTMLButtonElement & HTMLInputElement>,
) {
  // ── Internal state ──────────────────────────────────────────────────────────
  type InternalSelected = TOption | TOption[];
  const emptyState: InternalSelected =
    type === "single" ? { value: "", label: "" } : [];

  const [state, _setState] = useState<InternalSelected>(emptyState);
  const [options, setOptions] = useState<TOption[]>(_options);
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [fetchedItems, setFetchedItems] = useState<Item[]>([]);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isFetchingNext, setIsFetchingNext] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const mapperOverridesRef = useRef({
    getValueFromItem,
    getLabelFromItem,
    getIconFromItem,
    getDescriptionFromItem,
    getKeywordsFromItem,
  });
  const prevResetKeyRef = useRef<number | string | undefined>(resetKey);

  mapperOverridesRef.current = {
    getValueFromItem,
    getLabelFromItem,
    getIconFromItem,
    getDescriptionFromItem,
    getKeywordsFromItem,
  };

  const debouncedQuery = useDebounce(input, debounceMs);
  const resolvedFetcher = useMemo(() => {
    if (!fetcher) return undefined;

    const resolved = resolveFetcher(
      fetcher,
      fetcherTake,
      mapperOverridesRef.current,
    );

    return {
      ...resolved,
      getValueFromItem: (item: Item) =>
        (
          mapperOverridesRef.current.getValueFromItem ??
          resolved.getValueFromItem
        )(item),
      getLabelFromItem: (item: Item) =>
        (
          mapperOverridesRef.current.getLabelFromItem ??
          resolved.getLabelFromItem
        )(item),
      getIconFromItem: (item: Item) =>
        mapperOverridesRef.current.getIconFromItem?.(item) ??
        resolved.getIconFromItem?.(item),
      getDescriptionFromItem: (item: Item) =>
        mapperOverridesRef.current.getDescriptionFromItem?.(item) ??
        resolved.getDescriptionFromItem?.(item),
      getKeywordsFromItem: (item: Item) =>
        mapperOverridesRef.current.getKeywordsFromItem?.(item) ??
        resolved.getKeywordsFromItem?.(item) ??
        [],
    };
  }, [fetcher, fetcherTake]);

  useEffect(() => {
    if (!isEqual(options, _options)) setOptions(_options);
  }, [_options]);

  useEffect(() => {
    if (typeof value === "string" && !Array.isArray(state)) {
      if (value === "") {
        _setState({ value: "", label: "" });
      } else {
        const found = options.find((o) => o.value === value);
        if (found && found.value !== (state as TOption).value) _setState(found);
      }
    } else if (
      value === undefined &&
      type === "single" &&
      !Array.isArray(state)
    ) {
      _setState({ value: "", label: "" });
    } else if (Array.isArray(value) && Array.isArray(state)) {
      if (value.length === 0 && state.length !== 0) {
        _setState([]);
      } else {
        const selected = value
          .map((v) => options.find((o) => o.value === v))
          .filter((o): o is TOption => Boolean(o));
        if (
          !isEqual(
            selected.map((s) => s.value),
            state.map((s: TOption) => s.value),
          )
        ) {
          _setState(selected);
        }
      }
    }
  }, [value, options]);

  // ── Notify parent on change ─────────────────────────────────────────────────
  const setState = useCallback(
    (next: InternalSelected, notify = true) => {
      _setState(next);
      if (!notify || !onChange) return;
      if (type === "single" && !Array.isArray(next)) onChange(next.value ?? "");
      if (type === "multiple" && Array.isArray(next))
        onChange(next.map((o) => o.value).filter(Boolean));
    },
    [onChange, type],
  );

  const doFetch = useCallback(
    async (q: string, pg: number, append = false) => {
      if (!resolvedFetcher) return;
      if (q.length < minQueryLength && !open) return;

      abortRef.current?.abort();
      abortRef.current = new AbortController();

      if (pg === 0) {
        setFetchLoading(true);
      } else {
        setIsFetchingNext(true);
      }
      setFetchError(null);

      try {
        const res = await resolvedFetcher.fn(
          { query: q, page: pg },
          abortRef.current?.signal,
        );
        setFetchedItems((prev) => (append ? [...prev, ...res.data] : res.data));
        setHasNextPage(res.hasNextPage);
        setPage(pg);
      } catch (err: any) {
        const isAborted =
          err?.name === "AbortError" || abortRef.current?.signal.aborted;
        if (!isAborted) setFetchError("Failed to load options.");
      } finally {
        setFetchLoading(false);
        setIsFetchingNext(false);
      }
    },
    [resolvedFetcher, minQueryLength, open],
  );

  useEffect(() => {
    if (resetKey === undefined) return;
    if (prevResetKeyRef.current === resetKey) return;
    prevResetKeyRef.current = resetKey;

    setFetchedItems([]);
    setPage(0);
    setHasNextPage(false);
    setInput("");
    setFetchError(null);
    if (open || searchable) {
      doFetch("", 0);
    }
  }, [resetKey, open, searchable, doFetch]);

  useEffect(() => {
    if (open || searchable) doFetch(debouncedQuery, 0);
  }, [debouncedQuery, open, searchable]);

  // reset on close (non-searchable mode)
  useEffect(() => {
    if (!open && !searchable) {
      setInput("");
      setFetchedItems([]);
    }
  }, [open, searchable]);

  useEffect(() => {
    if (listRef.current && (open || searchable)) listRef.current.scrollTop = 0;
  }, [input, open, searchable]);

  // ── Auto-select first ───────────────────────────────────────────────────────
  useEffect(() => {
    const isEmpty =
      type === "single"
        ? !(state as TOption).value
        : (state as TOption[]).length === 0;
    if (!autoSelectFirst || !isEmpty) return;

    const first = resolvedFetcher ? fetchedItems[0] : options[0];
    if (!first) return;

    if (resolvedFetcher) {
      const v = resolvedFetcher.getValueFromItem(first as Item);
      const l = resolvedFetcher.getLabelFromItem(first as Item);
      const ico = resolvedFetcher.getIconFromItem?.(first as Item);
      if (v)
        setState(
          type === "single"
            ? { value: v, label: l, icon: ico }
            : [{ value: v, label: l, icon: ico }],
        );
    } else {
      setState(type === "single" ? (first as TOption) : [first as TOption]);
    }
  }, [autoSelectFirst, fetchedItems, options]);

  // ── Scroll-to-load-more ─────────────────────────────────────────────────────
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      if (
        el.scrollHeight - el.scrollTop <= el.clientHeight + 10 &&
        hasNextPage &&
        !isFetchingNext
      ) {
        doFetch(debouncedQuery, page + 1, true);
      }
    },
    [hasNextPage, isFetchingNext, page, debouncedQuery, doFetch],
  );

  // ── Click-outside for searchable mode ──────────────────────────────────────
  useEffect(() => {
    if (!searchable) return;
    const handler = (e: MouseEvent) => {
      if (
        !searchInputRef.current?.contains(e.target as Node) &&
        !dropdownRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [searchable]);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const getIsSelected = useCallback(
    (v: string) => {
      if (type === "multiple" && Array.isArray(state))
        return state.some((s) => s.value === v);
      if (type === "single" && !Array.isArray(state))
        return (state as TOption).value === v;
      return false;
    },
    [state, type],
  );

  const handleSelect = useCallback(
    (
      optionLike: TOption,
      item?: Item,
      kind: "options" | "fetcher" = "options",
    ) => {
      setInput("");
      const isSel = getIsSelected(optionLike.value);
      const shouldDeselect =
        type === "multiple" ? isSel : deselectable && isSel;

      if (shouldDeselect) {
        setState(
          type === "multiple"
            ? (state as TOption[]).filter((s) => s.value !== optionLike.value)
            : { value: "", label: "" },
        );
        resolvedFetcher?.onItemSelect?.(item as Item, true);
        onOptionSelect?.(optionLike, true);
        if (type === "single") setOpen(false);
        return;
      }

      setState(
        type === "single"
          ? optionLike
          : [...(Array.isArray(state) ? state : []), optionLike],
      );
      resolvedFetcher?.onItemSelect?.(item as Item, false);
      onOptionSelect?.(optionLike, false);
      if (type === "single") {
        setOpen(false);
        if (searchable) searchInputRef.current?.blur();
      }
    },
    [
      state,
      type,
      deselectable,
      getIsSelected,
      resolvedFetcher,
      onOptionSelect,
      setState,
      searchable,
    ],
  );

  const handleCreate = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent) => {
      if (!create || create.type === "form") return;
      const isEnter = "key" in e && e.key === "Enter";
      const isClick = e.type === "click";
      if (!isEnter && !isClick) return;
      const matches = options.filter((o) =>
        create.type === "soft" && create.uniqueBy === "value"
          ? o.value.toLowerCase().includes(input.toLowerCase())
          : o.label.toLowerCase().includes(input.toLowerCase()),
      );
      if (input.trim() && matches.length === 0) {
        const newOpt: TOption = { value: input, label: input };
        setOptions((prev) => [...prev, newOpt]);
        if (create.type === "hard") create.callback?.(input);
        setInput("");
      }
    },
    [create, options, input],
  );

  // ── Derived label for trigger ───────────────────────────────────────────────
  const triggerLabel = useMemo(() => {
    if (type === "single" && !Array.isArray(state)) {
      return (state as TOption).label || placeholder || "Select…";
    }
    if (type === "multiple" && Array.isArray(state) && state.length) {
      const labels = state.map((s) => s.label);
      if (maxLabelCount) {
        const extra = labels.length - maxLabelCount;
        return (
          labels.slice(0, maxLabelCount).join(", ") +
          (extra > 0 ? ` +${extra} more` : "")
        );
      }
      return labels.join(", ");
    }
    return placeholder || "Select…";
  }, [state, type, placeholder, maxLabelCount]);

  const isActive =
    (!Array.isArray(state) && (state as TOption).value) ||
    (Array.isArray(state) && state.length > 0);

  // ── Merge fetched + static (de-dup) ────────────────────────────────────────
  const fetcherOptions: TOption[] = useMemo(() => {
    if (!resolvedFetcher) return [];
    return fetchedItems
      ?.map((item) => ({
        value: resolvedFetcher.getValueFromItem(item),
        label: resolvedFetcher.getLabelFromItem(item),
        icon: resolvedFetcher.getIconFromItem?.(item),
        description: resolvedFetcher.getDescriptionFromItem?.(item),
        keywords: resolvedFetcher.getKeywordsFromItem?.(item),
      }))
      .filter((o) => !options.find((s) => s.value === o.value));
  }, [fetchedItems, resolvedFetcher, options]);

  const filteredStatic = useMemo(
    () =>
      !input
        ? options
        : options.filter(
            (o) =>
              o.label.toLowerCase().includes(input.toLowerCase()) ||
              o.description?.toLowerCase().includes(input.toLowerCase()) ||
              o.keywords?.some((k) =>
                k.toLowerCase().includes(input.toLowerCase()),
              ),
          ),
    [options, input],
  );

  const maxHeight = useMemo(() => {
    if (forcedPopoverHeight) return forcedPopoverHeight;
    const count = filteredStatic.length + fetcherOptions.length;
    if (count === 0) return 180;
    const h = count * itemHeight;
    if (ignoreMaxHeight) return h;
    return Math.min(h, 280);
  }, [
    filteredStatic,
    fetcherOptions,
    itemHeight,
    ignoreMaxHeight,
    forcedPopoverHeight,
  ]);

  // ── Slot shortcuts ──────────────────────────────────────────────────────────
  const TriggerSlot = components?.trigger;
  const ItemSlot = components?.item;
  const IconSlot = components?.icon;

  // ── Render an option row ────────────────────────────────────────────────────
  const renderRow = (
    option: TOption,
    item?: Item,
    kind: "options" | "fetcher" = "options",
  ) => {
    const isSel = getIsSelected(option.value);
    const isDisabled =
      disabledOptions.includes(option.value) || !!option.disabled;
    const rowCn = cn(
      "relative flex cursor-pointer items-center gap-2 px-3 py-2",
      isSel && "!bg-accent/10 text-primary",
      isDisabled && "cursor-not-allowed opacity-50",
      classNames?.item,
    );

    const content = ItemSlot ? (
      <ItemSlot
        props={{
          className: rowCn,
          disabled: isDisabled,
          value: option.value,
          selected: isSel,
          onSelect: () => handleSelect(option, item, kind),
          keywords: option.keywords || [option.label],
        }}
        option={option}
        isSelected={isSel}
        Component={CommandItem}
      />
    ) : (
      <CommandItem
        className={rowCn}
        key={option.value}
        value={option.value}
        keywords={option.keywords || [option.label]}
        disabled={isDisabled}
        onSelect={() => handleSelect(option, item, kind)}
      >
        {/* Delete button */}
        {remove && (option.renderAPIDelete || kind === "fetcher") && (
          <button
            className="shrink-0 text-destructive opacity-0 group-data-[selected=true]:opacity-100 hover:text-destructive/80"
            onClick={(e) => {
              e.stopPropagation();
              remove.onConfirm(option.value);
              if (type === "multiple" && Array.isArray(state))
                setState(state.filter((s) => s.value !== option.value));
              if (type === "single") setState({ value: "", label: "" });
              setOpen(false);
            }}
          >
            <Trash2 size={14} />
          </button>
        )}

        {/* Icon */}
        {IconSlot ? (
          <IconSlot value={option.icon} isTrigger={false} />
        ) : (
          option.icon && (
            <span className="flex shrink-0 items-center">{option.icon}</span>
          )
        )}

        {/* Label */}
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="flex items-center gap-1 truncate">
            {option.label}
            {option.isDefault && (
              <Star size={12} className="shrink-0 text-yellow-400" />
            )}
          </span>
          {option.description && (
            <span className="truncate text-xs text-muted-foreground">
              {option.description}
            </span>
          )}
        </span>

        {/* Selected indicator */}
        {isSel && (
          <span className="ml-auto shrink-0 text-primary">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7L5.5 10.5L12 3.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        )}
      </CommandItem>
    );

    return content;
  };

  // ── Dropdown content (shared between Popover and searchable modes) ──────────
  const dropdownContent = (
    <Command
      filter={
        resolvedFetcher && !resolvedFetcher.withClientSearch
          ? () => 1
          : undefined
      }
      className="w-full p-0"
      shouldFilter={!(resolvedFetcher && !resolvedFetcher.withClientSearch)}
    >
      {withSearch && !searchable && (
        <CommandInput
          placeholder={searchPlaceholder}
          value={input}
          onValueChange={(v) => {
            setInput(v);
            onQueryChange?.(v);
          }}
          onKeyDown={(e) => handleCreate(e)}
        />
      )}

      <CommandList
        className={cn(withSearch && !searchable && "mt-1")}
        style={{ maxHeight }}
        onScroll={handleScroll}
        ref={listRef}
      >
        {/* Loading */}
        {fetchLoading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        )}

        {!fetchLoading && fetchError && (
          <div className="py-6 text-center text-xs text-destructive">
            {fetchError}
          </div>
        )}

        {!fetchLoading &&
          !fetchError &&
          filteredStatic.length === 0 &&
          fetcherOptions.length === 0 && (
            <CommandEmpty>
              {create && create.type !== "form" ? (
                <div
                  className="flex cursor-pointer items-center gap-1 rounded-sm px-3 py-2 text-xs hover:bg-accent/20"
                  onClick={handleCreate}
                >
                  <PlusIcon size={12} />
                  Create <q>{input}</q>
                </div>
              ) : (
                <span className="block py-6 text-center text-xs text-muted-foreground">
                  {emptyMessage}
                </span>
              )}
            </CommandEmpty>
          )}

        {filteredStatic.length > 0 && (
          <CommandGroup>
            {filteredStatic
              .filter((o) => !o.hideInList)
              .map((option) => (
                <React.Fragment key={option.value}>
                  {renderRow(option, undefined, "options")}
                </React.Fragment>
              ))}
          </CommandGroup>
        )}

        {fetcherOptions.length > 0 && (
          <CommandGroup
            heading={filteredStatic.length > 0 ? "More results" : undefined}
          >
            {fetcherOptions.map((option) => {
              const raw = fetchedItems.find(
                (i) => resolvedFetcher!.getValueFromItem(i) === option.value,
              );
              return (
                <React.Fragment key={option.value}>
                  {renderRow(option, raw, "fetcher")}
                </React.Fragment>
              );
            })}
          </CommandGroup>
        )}

        {/* Pagination skeleton */}
        {isFetchingNext &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="mx-2 my-1 h-10 animate-pulse rounded-md bg-muted"
            />
          ))}
      </CommandList>

      {create?.type === "form" && (
        <div className="mt-1 border-t pt-1">
          <button
            className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-xs transition-colors hover:bg-accent/20"
            onClick={() => {
              create.onOpen();
              setOpen(false);
            }}
          >
            <PlusIcon size={12} />
            {create.label}
          </button>
        </div>
      )}
    </Command>
  );

  if (searchable) {
    const selectedSingle = !Array.isArray(state) ? (state as TOption) : null;

    return (
      <div className={cn("relative w-full", classNames?.filterRemoveTrigger)}>
        <div
          className={cn(
            "flex h-10 w-full items-center gap-2 rounded-md border border-input bg-background px-3 text-sm",
            open && "ring-2 ring-ring ring-offset-0",
            disabled && "pointer-events-none opacity-50",
            classNames?.trigger,
          )}
        >
          <Search size={14} className="shrink-0 text-muted-foreground" />

          {selectedSingle?.value && !open ? (
            <span className="flex flex-1 items-center gap-1 truncate">
              {selectedSingle.icon && (
                <span className="shrink-0">{selectedSingle.icon}</span>
              )}
              <span className="truncate">{selectedSingle.label}</span>
            </span>
          ) : type === "multiple" &&
            Array.isArray(state) &&
            state.length > 0 &&
            !open ? (
            <span className="flex-1 truncate text-xs">
              {state.map((s) => s.label).join(", ")}
            </span>
          ) : (
            <input
              ref={searchInputRef as React.Ref<HTMLInputElement>}
              className={cn(
                "flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground",
                classNames?.searchInput,
              )}
              placeholder={
                type === "multiple" && Array.isArray(state) && state.length > 0
                  ? `${state.length} selected…`
                  : placeholder
              }
              value={input}
              disabled={disabled}
              onChange={(e) => {
                setInput(e.target.value);
                setOpen(true);
                onQueryChange?.(e.target.value);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={(e) => {
                handleCreate(e);
                onKeyDown?.(e);
              }}
              id={id}
            />
          )}

          {isActive ? (
            <X
              size={14}
              className="shrink-0 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                setState(type === "single" ? { value: "", label: "" } : []);
                setInput("");
                onFilterRemove?.();
                setOpen(false);
              }}
            />
          ) : (
            <ChevronDown
              size={14}
              className={cn(
                "shrink-0 text-muted-foreground transition-transform",
                open && "rotate-180",
              )}
            />
          )}
        </div>

        {open && (
          <div
            ref={dropdownRef}
            className={cn(
              "absolute top-[calc(100%+4px)] left-0 z-50 w-full rounded-md border bg-popover shadow-md",
              classNames?.dropdown,
            )}
          >
            {dropdownContent}
          </div>
        )}
      </div>
    );
  }

  const triggerButton = (
    <Button
      ref={ref as React.Ref<HTMLButtonElement>}
      variant="outline"
      role="combobox"
      aria-expanded={open}
      aria-haspopup="listbox"
      disabled={disabled}
      id={id}
      onKeyDown={onKeyDown as React.KeyboardEventHandler<HTMLButtonElement>}
      className={cn(
        "h-10 w-full justify-between gap-2 border-border px-3 text-sm font-normal shadow-none",
        type === "single" && !Array.isArray(state) && (state as TOption).value
          ? "text-foreground"
          : "text-muted-foreground",
        type === "multiple" &&
          Array.isArray(state) &&
          state.length &&
          "text-foreground",
        classNames?.trigger,
      )}
      {...(popover?.trigger ?? {})}
    >
      {/* Prepend label */}
      {prependLabel && (isActive || forceShowPrependLabel) && (
        <span className="shrink-0 text-muted-foreground">{prependLabel}</span>
      )}

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1 overflow-hidden">
        {dropdownDisplayVariant === "tags" &&
        type === "multiple" &&
        Array.isArray(state) &&
        state.length > 0 ? (
          <MultiSelectTags
            selected={state.map((s) => s.value)}
            options={state}
            maxCount={maxLabelCount ?? state.length}
            onRemove={(v) => {
              const opt = state.find((s) => s.value === v);
              if (opt) handleSelect(opt, undefined, "options");
            }}
            onClearExtra={() => {
              if (maxLabelCount) setState(state.slice(0, maxLabelCount));
            }}
          />
        ) : (
          <>
            {(renderIconWithLabel || renderIconOnly) &&
              type === "single" &&
              !Array.isArray(state) &&
              (state as TOption).icon &&
              (IconSlot ? (
                <IconSlot value={(state as TOption).icon} isTrigger />
              ) : (
                <span className="shrink-0">{(state as TOption).icon}</span>
              ))}
            {!renderIconOnly && (
              <span className="truncate text-sm font-normal">
                {triggerLabel}
              </span>
            )}
          </>
        )}
      </div>

      {isActive && onFilterRemove ? (
        <X
          size={14}
          className="shrink-0 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            onFilterRemove();
            setState(type === "single" ? { value: "", label: "" } : []);
            setOpen(false);
          }}
        />
      ) : showDropIcon && !isActive ? (
        dropIconVariant === "outline" || classNames?.dropdownIcon ? (
          <div
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-md border border-border/50 bg-muted/30",
              classNames?.dropdownIcon,
            )}
          >
            <ChevronDown size={14} className="shrink-0" />
          </div>
        ) : (
          <ChevronDown size={14} className="shrink-0 opacity-60" />
        )
      ) : null}
    </Button>
  );

  return (
    <Popover
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setInput("");
      }}
    >
      {TriggerSlot ? (
        <PopoverTrigger asChild disabled={disabled}>
          <TriggerSlot selected={state} label={triggerLabel} />
        </PopoverTrigger>
      ) : (
        <PopoverTrigger asChild disabled={disabled}>
          {triggerButton}
        </PopoverTrigger>
      )}

      <PopoverContent
        className={cn(
          "w-[var(--radix-popover-trigger-width)] p-2",
          popover?.content?.className,
        )}
        align={popover?.content?.align ?? "start"}
        {...(popover?.content ?? {})}
      >
        {dropdownContent}
      </PopoverContent>
    </Popover>
  );
}

const AsyncSelect = React.forwardRef(AsyncSelectInner) as <Item = any>(
  props: AsyncSelectProps<Item> & {
    ref?: React.Ref<HTMLButtonElement & HTMLInputElement>;
  },
) => React.ReactElement;

export default AsyncSelect;

// ─── Usage examples ───────────────────────────────────────────────────────────
//
// 1) Static + single
// <AsyncSelect options={[{ value:"1", label:"Apple" }]} value={v} onChange={setV} />
//
// 2) Async (infinite scroll) — pass a generated service fetcher directly
// <AsyncSelect fetcher={fetchCustomerControllerGetCustomers} value={v} onChange={setV} />
//
// 3) Multi-select with tags
// <AsyncSelect type="multiple" dropdownDisplayVariant="tags" options={opts} value={arr} onChange={setArr} />
//
// 4) Searchable (trigger = input, results below)
// <AsyncSelect searchable options={opts} value={v} onChange={setV} placeholder="Search users…" />
//
// 5) Create inline
// <AsyncSelect create={{ type: "soft", uniqueBy: "label" }} options={opts} ... />
//
// 6) Custom item slot
// <AsyncSelect
//   components={{ item: ({ props, option, isSelected, Component }) => (
//     <Component {...props}><Avatar />{option.label}</Component>
//   )}}
//   ...
// />
