import type { Component } from "vue";

export type TabType = {
  title: string;
  icon: Component;
  id: number;
  component?: Component;
};

export type MenuType = {
  title: string;
  icon: Component;
  component?: Component;
  path?: string;
  background?: string;
};
