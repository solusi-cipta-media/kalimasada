export interface Feature {
  id: number;
  description: string | null;
  label: string;
  icon: string | null;
  isSection: boolean;
  sequence: number;
  parentId: number | null;
  showOnSidebar: boolean;
  href?: string | null;
  children?: Feature[] | null;
}

export interface FeatureAccess extends Feature {
  hasAccess: boolean;
  children?: FeatureAccess[] | null;
}
