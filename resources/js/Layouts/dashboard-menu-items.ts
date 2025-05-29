import {
  Table2,
  Database,
  Blocks,
  FileJson,
  FileCode,
  Settings,
  CheckSquare,
  Users,
  LucideIcon,
  DatabaseIcon,
  BookOpen,
  Cog,
} from 'lucide-react'

export interface SvgImage {
  svg: string
}

const DATA_TABLES_PERMISSION = 'data-tables'

interface DashboardMenuItem {
  name: string
  value: string
  url?: string
  tabDescription?: string
  icon?: LucideIcon
  links: {
    title: string
    link: string
    image: SvgImage | string | LucideIcon
    permission: string
    subtype: string
  }[]
}

const dashboardMenuItems: DashboardMenuItem[] = [
  {
    name: 'Data',
    value: 'data',
    url: '/data-detail',
    tabDescription: 'Explore data tables and subsets by subject areas.',
    icon: DatabaseIcon,
    links: [
      {
        title: 'Data Tables',
        link: '/data-detail',
        image: Table2,
        permission: DATA_TABLES_PERMISSION,
        subtype: 'data-tables',
      },
      {
        title: 'Subset Groups',
        link: route('subset-groups.index'),
        image: Database,
        permission: DATA_TABLES_PERMISSION,
        subtype: 'subject-area',
      },
      {
        title: 'Subsets',
        link: route('subsets'),
        image: Database,
        permission: DATA_TABLES_PERMISSION,
        subtype: 'subsets',
      },
    ],
  },
  {
    name: 'Definitions',
    value: 'definitions',
    url: '/meta-structure?type=definitions&subtype=blocks',
    tabDescription: `It is important to ensure quality of data that is stored in this analytical repository.
     The definitions in this section will be used to validate data upon import.`,
    icon: BookOpen,
    links: [
      {
        title: 'Structural Blocks',
        link: '/meta-structure?type=definitions&subtype=blocks',
        image: Blocks,
        permission: 'metadata-structural-block',
        subtype: 'blocks',
      },
      {
        title: 'Metadata',
        link: '/meta-data?type=definitions&subtype=metadata',
        image: FileCode,
        permission: 'metadata',
        subtype: 'metadata',
      },
      {
        title: 'Groups',
        link: '/meta-data-group?type=definitions&subtype=groups',
        image: Users,
        permission: 'metadata-group',
        subtype: 'groups',
      },
      {
        title: 'Hierarchies',
        link: '/meta-hierarchy?type=definitions&subtype=hierarchies',
        image: Database,
        permission: 'metadata-hierarchy',
        subtype: 'hierarchies',
      },
    ],
  },
  {
    name: 'Loaders',
    value: 'loaders',
    url: '/loader-connections?type=loaders&subtype=data-sources',
    tabDescription: `Loaders are scheduled or conditional jobs that are
    used to automatically extract and load data into pre-defined data tables.`,
    icon: Cog,
    links: [
      {
        title: 'Jobs',
        link: '/loader-jobs?type=loaders&subtype=jobs',
        image: CheckSquare,
        permission: 'loader-jobs',
        subtype: 'jobs',
      },
      {
        title: 'Data Sources',
        link: '/loader-connections?type=loaders&subtype=data-sources',
        image: Database,
        permission: 'loader-connection',
        subtype: 'data-sources',
      },
      {
        title: 'Extraction Statements',
        link: '/loader-queries?type=loaders&subtype=queries',
        image: FileCode,
        permission: 'loader-query',
        subtype: 'queries',
      },
      {
        title: 'Json APIS',
        link: '/loader-apis',
        image: FileJson,
        permission: 'loader-query',
        subtype: 'json-apis',
      },
    ],
  },
  {
    name: 'Config',
    value: 'config',
    url: '/reference-data?type=config&subtype=reference-data',
    tabDescription: `Manage configurations and system level settings`,
    icon: Settings,
    links: [
      {
        link: '/reference-data?type=config&subtype=reference-data',
        title: 'Reference Data',
        image: Settings,
        permission: 'reference-data',
        subtype: 'reference-data',
      },
      {
        link: '/page-builder',
        title: 'Page Builder',
        image: Settings,
        permission: 'page-builder',
        subtype: 'page-builder',
      },
    ],
  },
]

export default dashboardMenuItems
