export interface Province {
  name: string;
  code: string;
  fullCode: string;
  fullName: string;
  actived?: boolean;
  checked?: boolean;
  indeterminate?: boolean;
  children?: City[];
}

export interface City extends Province {
  parentCode: string;
}
