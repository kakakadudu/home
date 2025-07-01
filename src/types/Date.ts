export type MonthFormat = "numeric" | "2-digit" | "long" | "short" | "narrow";
export type WeekdayFormat = "long" | "short" | "narrow";
export type HourCycle = "h11" | "h12" | "h23" | "h24";

export interface DateTimeFormatOptions {
  locale?: string;
  month?: MonthFormat;
  day?: "numeric" | "2-digit";
  weekday?: WeekdayFormat;
  hour?: "numeric" | "2-digit";
  minute?: "numeric" | "2-digit";
  second?: "numeric" | "2-digit";
  hour12?: boolean;
  hourCycle?: HourCycle;
  timeZone?: string;
}
