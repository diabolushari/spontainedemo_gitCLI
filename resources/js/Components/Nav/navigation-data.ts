import {
  Blocks,
  BookOpen,
  CheckSquare,
  Cog,
  Database,
  Download,
  FileCode,
  FileCode2,
  FileJson2,
  Layers,
  LayoutDashboard,
  LineChart,
  LucideProps,
  Menu,
  Network,
  PieChart,
  Server,
  Settings,
  ShieldCheck,
  Sparkles,
  Table2,
  Timer,
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

const iconMap: { [key: string]: React.ComponentType<LucideProps> } = {
  Database: Database,
  Table2: Table2,
  BookOpen: BookOpen,
  Blocks: Blocks,
  FileCode: FileCode,
  Users: Users,
  Cog: Cog,
  CheckSquare: CheckSquare,
  FileJson: FileJson2,
  Settings: Settings,
  ShieldCheck: ShieldCheck,
  Sparkles: Sparkles,
  LayoutDashboard: LayoutDashboard,
  LineChart: LineChart,
  PieChart: PieChart,
  Layers: Layers,
  Network: Network,
  Download: Download,
  Timer: Timer,
  Server: Server,
  FileCode2: FileCode2,
  Menu: Menu,
}

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

const manageMenuData: NavGroup[] = [
  {
    id: 10,
    group_label: 'AI Studio',
    group_url: '/chat',
    group_pos: 1,
    group_icon: 'Sparkles',
    nav_items: [
      {
        id: 1001,
        item_label: 'Intelligent insights',
        item_url: '/chat',
        item_pos: 1,
        item_icon: 'Sparkles',
      },
      {
        id: 1002,
        item_label: 'Widget builder',
        item_url: '/widget-collection',
        item_pos: 2,
        item_icon: 'PieChart',
      },
      {
        id: 1003,
        item_label: 'Dashboard builder',
        item_url: '/page-editor',
        item_pos: 3,
        item_icon: 'LayoutDashboard',
      },
    ],
  },
  {
    id: 20,
    group_label: 'Data',
    group_url: '/data-detail',
    group_pos: 2,
    group_icon: 'Database',
    nav_items: [
      {
        id: 2001,
        item_label: 'Tables',
        item_url: '/data-detail',
        item_pos: 1,
        item_icon: 'Table2',
      },
      {
        id: 2002,
        item_label: 'Subsets',
        item_url: '/subsets',
        item_pos: 2,
        item_icon: 'Layers',
      },
      {
        id: 2003,
        item_label: 'Subset groups',
        item_url: '/subset-groups',
        item_pos: 3,
        item_icon: 'Layers',
      },
    ],
  },
  {
    id: 30,
    group_label: 'Model',
    group_url: '/meta-structure?type=definitions&subtype=blocks',
    group_pos: 3,
    group_icon: 'Network',
    nav_items: [
      {
        id: 3001,
        item_label: 'Structural blocks',
        item_url: '/meta-structure?type=definitions&subtype=blocks',
        item_pos: 1,
        item_icon: 'Blocks',
      },
      {
        id: 3002,
        item_label: 'Metadata',
        item_url: '/meta-data?type=definitions&subtype=metadata',
        item_pos: 2,
        item_icon: 'FileCode',
      },
      {
        id: 3003,
        item_label: 'Meta trees',
        item_url: '/meta-hierarchy?type=definitions&subtype=hierarchies',
        item_pos: 3,
        item_icon: 'Network',
      },
    ],
  },
  {
    id: 40,
    group_label: 'Data acquisition',
    group_url: '/loader-jobs?type=loaders&subtype=jobs',
    group_pos: 4,
    group_icon: 'Download',
    nav_items: [
      {
        id: 4001,
        item_label: 'Extraction jobs',
        item_url: '/loader-jobs?type=loaders&subtype=jobs',
        item_pos: 1,
        item_icon: 'Timer',
      },
      {
        id: 4002,
        item_label: 'APIs',
        item_url: '/loader-apis',
        item_pos: 2,
        item_icon: 'Server',
      },
      {
        id: 4003,
        item_label: 'Databases',
        item_url: '/loader-connections?type=loaders&subtype=data-sources',
        item_pos: 3,
        item_icon: 'Database',
      },
      {
        id: 4004,
        item_label: 'SQLs',
        item_url: '/loader-queries?type=loaders&subtype=queries',
        item_pos: 4,
        item_icon: 'FileCode2',
      },
    ],
  },
  {
    id: 50,
    group_label: 'Settings',
    group_url: '/nav-editor',
    group_pos: 5,
    group_icon: 'Settings',
    nav_items: [
      {
        id: 5001,
        item_label: 'Menu Editor',
        item_url: '/nav-editor',
        item_pos: 1,
        item_icon: 'Menu',
      },
      {
        id: 5002,
        item_label: 'Users',
        item_url: '/manage/users',
        item_pos: 2,
        item_icon: 'Users',
      },
    ],
  },
]

export const allMenus = {
  dashboard: dashboardMenuData,
  manage: manageMenuData,
}

export { manageMenuData }

export type MenuType = keyof typeof allMenus
export { iconMap }
