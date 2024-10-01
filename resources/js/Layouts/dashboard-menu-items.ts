interface DashboardMenuItem {
  name: string
  value: string
  url?: string
  links: {
    title: string
    link: string
    image: string
    permission: string
    subtype: string
  }[]
}

const dashboardMenuItems: DashboardMenuItem[] = [
  {
    name: 'Data',
    value: 'data',
    url: '/data-detail?type=data&subtype=data-tables',
    links: [
      {
        title: 'DATA TABLES',
        link: '/data-detail?type=data&subtype=data-tables',
        image: '/data-tables.png',
        permission: 'data-tables',
        subtype: 'data-tables',
      },
      {
        title: 'SUBJECT AREAS',
        link: '/subject-area?type=data&subtype=subject-area',
        image: '/subject-area.png',
        permission: 'ubject-area',
        subtype: 'ubject-area',
      },
    ],
  },
  {
    name: 'Definitions',
    value: 'definitions',
    url: '/meta-data?type=definitions&subtype=metadata',
    links: [
      {
        title: 'METADATA',
        link: '/meta-data?type=definitions&subtype=metadata',
        image: '/metadata.png',
        permission: 'metadata',
        subtype: 'metadata',
      },
      {
        title: 'GROUPS',
        link: '/meta-data-group?type=definitions&subtype=groups',
        image: '/groups.png',
        permission: 'metadata-group',
        subtype: 'groups',
      },
      {
        title: 'HIERARCHIES',
        link: '/meta-hierarchy?type=definitions&subtype=hierarchies',
        image: '/hierarchies.png',
        permission: 'metadata-hierarchy',
        subtype: 'hierarchies',
      },
      {
        title: 'STRUCTURAL BLOCKS',
        link: '/meta-structure?type=definitions&subtype=blocks',
        image: '/structblock.png',
        permission: 'metadata-structural-block',
        subtype: 'blocks',
      },
    ],
  },
  {
    name: 'Loaders',
    value: 'loaders',
    url: '/loader-jobs?type=loaders&subtype=jobs',
    links: [
      {
        link: '/loader-connections?type=loaders&subtype=data-sources',
        title: 'DATA SOURCES',
        image: '/data-sources.png',
        permission: 'loader-connection',
        subtype: 'data-sources',
      },
      {
        title: 'JOBS',
        link: '/loader-jobs?type=loaders&subtype=jobs',
        image: '/jobs.png',
        permission: 'loader-job',
        subtype: 'jobs',
      },
      {
        title: 'EXTRACTION STATEMENTS',
        link: '/loader-queries?type=loaders&subtype=queries',
        image: '/extraction.png',
        subtype: 'queries',
        permission: 'loader-query',
      },
    ],
  },
  {
    name: 'Config',
    value: 'config',
    url: '/reference-data?type=config&subtype=reference-data',
    links: [
      {
        link: '/reference-data?type=config&subtype=reference-data',
        title: 'REFERENCE DATA',
        image: '/reference-data.png',
        subtype: 'reference-data',
        permission: 'reference-data',
      },
    ],
  },
]

export default dashboardMenuItems
