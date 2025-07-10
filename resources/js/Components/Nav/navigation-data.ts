import {
  Blocks,
  BookOpen,
  CheckSquare,
  Cog,
  Database,
  FileCode,
  FileJson2,
  LucideProps,
  Settings,
  ShieldCheck,
  Table2,
  Users,
} from 'lucide-react'

// The types remain the same, they are our target structure.
export interface NavItem {
  id: number
  item_label: string
  item_url: string
  item_pos: number
  item_icon: string
}

export interface NavGroup {
  id: number
  group_label: string
  group_url: string
  group_pos: number
  group_icon: string
  nav_items: NavItem[]
}

// === CHANGE 2: Add all the new icon string keys to the map ===
const iconMap: { [key: string]: React.ComponentType<LucideProps> } = {
  // Icons for the 'manage' menu (converted from your old data)
  Database: Database,
  Table2: Table2,
  BookOpen: BookOpen,
  Blocks: Blocks,
  FileCode: FileCode,
  Users: Users,
  Cog: Cog,
  CheckSquare: CheckSquare,
  FileJson: FileJson2, // Map the string 'FileJson' to the FileJson2 component
  Settings: Settings,
  // Icons for the 'dashboard' menu
  ShieldCheck: ShieldCheck,
}

// This can be your simple "dashboard" menu
const dashboardMenuData: NavGroup[] = [
  {
    id: 1,
    group_label: 'User Management',
    group_url: '/users',
    group_pos: 1,
    group_icon: 'Users',
    nav_items: [
      {
        id: 101,
        item_label: 'All Users',
        item_url: '/manage/users',
        item_pos: 1,
        item_icon: 'Users',
      },
      {
        id: 102,
        item_label: 'Roles & Permissions',
        item_url: '/manage/roles',
        item_pos: 2,
        item_icon: 'ShieldCheck',
      },
    ],
  },
]

// === CHANGE 3: This is the complete conversion of your provided data ===
// Note: `permission` and `subtype` fields are not part of the new structure and have been omitted.
const manageMenuData: NavGroup[] = [
  {
    id: 10,
    group_label: 'Data', // from `name`
    group_url: '/data-detail', // from `url`
    group_pos: 1,
    group_icon: 'Database', // from `icon`, mapped to string key
    nav_items: [
      {
        id: 1001,
        item_label: 'Data Tables', // from `title`
        item_url: '/data-detail', // from `link`
        item_pos: 1,
        item_icon: 'Table2', // from `image`, mapped to string key
      },
      {
        id: 1002,
        item_label: 'Subset Groups',
        item_url: '/subset-groups', // from `route('subset-groups.index')`
        item_pos: 2,
        item_icon: 'Database',
      },
      {
        id: 1003,
        item_label: 'Subsets',
        item_url: '/subsets', // from `route('subsets')`
        item_pos: 3,
        item_icon: 'Database',
      },
    ],
  },
  {
    id: 20,
    group_label: 'Definitions',
    group_url: '/meta-structure?type=definitions&subtype=blocks',
    group_pos: 2,
    group_icon: 'BookOpen',
    nav_items: [
      {
        id: 2001,
        item_label: 'Structural Blocks',
        item_url: '/meta-structure?type=definitions&subtype=blocks',
        item_pos: 1,
        item_icon: 'Blocks',
      },
      {
        id: 2002,
        item_label: 'Metadata',
        item_url: '/meta-data?type=definitions&subtype=metadata',
        item_pos: 2,
        item_icon: 'FileCode',
      },
      {
        id: 2003,
        item_label: 'Groups',
        item_url: '/meta-data-group?type=definitions&subtype=groups',
        item_pos: 3,
        item_icon: 'Users',
      },
      {
        id: 2004,
        item_label: 'Hierarchies',
        item_url: '/meta-hierarchy?type=definitions&subtype=hierarchies',
        item_pos: 4,
        item_icon: 'Database',
      },
    ],
  },
  {
    id: 30,
    group_label: 'Loaders',
    group_url: '/loader-connections?type=loaders&subtype=data-sources',
    group_pos: 3,
    group_icon: 'Cog',
    nav_items: [
      {
        id: 3001,
        item_label: 'Jobs',
        item_url: '/loader-jobs?type=loaders&subtype=jobs',
        item_pos: 1,
        item_icon: 'CheckSquare',
      },
      {
        id: 3002,
        item_label: 'Data Sources',
        item_url: '/loader-connections?type=loaders&subtype=data-sources',
        item_pos: 2,
        item_icon: 'Database',
      },
      {
        id: 3003,
        item_label: 'Extraction Statements',
        item_url: '/loader-queries?type=loaders&subtype=queries',
        item_pos: 3,
        item_icon: 'FileCode',
      },
      {
        id: 3004,
        item_label: 'Json APIS',
        item_url: '/loader-apis',
        item_pos: 4,
        item_icon: 'FileJson',
      },
    ],
  },
  {
    id: 40,
    group_label: 'Config',
    group_url: '/reference-data?type=config&subtype=reference-data',
    group_pos: 4,
    group_icon: 'Settings',
    nav_items: [
      {
        id: 4001,
        item_label: 'Reference Data',
        item_url: '/reference-data?type=config&subtype=reference-data',
        item_pos: 1,
        item_icon: 'Settings',
      },
      {
        id: 4002,
        item_label: 'Nav Editor',
        item_url: '/nav-editor',
        item_pos: 1,
        item_icon: 'Settings',
      },
    ],
  },
]

// The final export wires up the two different menus
export const allMenus = {
  dashboard: dashboardMenuData,
  manage: manageMenuData,
}

// These exports remain the same
export type MenuType = keyof typeof allMenus
export { iconMap }
