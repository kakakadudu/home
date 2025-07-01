import type { DateTimeFormatOptions } from "@/types/Date";

export const formatDateTime = (
  date: Date,
  options: DateTimeFormatOptions = {}
): string => {
  const {
    locale = "zh-CN",
    month = "long",
    day = "numeric",
    weekday = "long",
    hour = "2-digit",
    minute = "2-digit",
    second = "2-digit",
    ...rest
  } = options;

  return new Intl.DateTimeFormat(locale, {
    month,
    day,
    weekday,
    hour,
    minute,
    second,
    ...rest,
  }).format(date);
};
