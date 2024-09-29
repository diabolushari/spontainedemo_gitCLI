interface DashboardMenuItem {
  name: string
  value: string
  links: {
    title: string
    link: string
    image: string
    permission: string
    subtype: string
  }[]
}

const dashboardMenuItems: DashboardMenuItem[] = [
  { name: 'Data Tables', value: 'data', links: [] },
  {
    name: 'Definitions',
    value: 'definitions',
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
  { name: 'Config', value: 'config', links: [] },
]

export default dashboardMenuItems
