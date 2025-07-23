export interface Link {
  title: string;
  href: string;
  links?: Link[];
}

export interface NavigationItem {
  title: string;
  href?: string;
  links: Link[];
}
