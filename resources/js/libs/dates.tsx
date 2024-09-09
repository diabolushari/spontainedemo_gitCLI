/**
 * month start from 0
 *
 * @param month
 * @param year
 */
export const getDatesInMonth = (month: number, year: number): Date[] => {
  const date = new Date(year, month, 1)
  const dates = []
  while (date.getMonth() === month) {
    dates.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }
  return dates
}

export const splitDateTime = (date: string): string[] => {
  if (date == null) {
    return []
  }

  const splitByT = date.split('T')
  if (splitByT.length === 2) {
    return splitByT
  }

  const splitBySpace = date.split(' ')
  if (splitBySpace.length === 2) {
    return splitBySpace
  }

  return []
}

/**
 * Return Date in d, M Y format taking Y-m-d as input
 *
 * @param date
 * @returns
 */
export const getDisplayDate = (date?: string | null) => {
  if (date == null) {
    return ''
  }
  const splitTime = splitDateTime(date)
  const datePart = splitTime.length === 2 ? splitTime[0] : date
  const splitUpdDate = datePart.split('-')
  if (splitUpdDate.length !== 3) {
    return ''
  }
  const month = Number(splitUpdDate[1])
  if (isNaN(month) || month < 1 || month > 12) {
    return ''
  }
  return splitUpdDate[2] + ', ' + shortMonthNames[month - 1] + ' ' + splitUpdDate[0]
}

export const formatDate = (date: Date | null) => {
  if (date == null) {
    return ''
  }
  let month
  if (date.getMonth() + 1 < 10) {
    month = '0' + (date.getMonth() + 1)
  } else {
    month = date.getMonth() + 1
  }
  let day
  if (date.getDate() < 10) {
    day = '0' + date.getDate()
  } else {
    day = date.getDate()
  }
  return date.getFullYear() + '-' + month + '-' + day
}

export interface DayMonthYear {
  day: number
  month: number
  year: number
}

export const dateDetails = (date: string): DayMonthYear | null => {
  const splitUpdDate = date.split('-')
  if (splitUpdDate.length !== 3) {
    return null
  }
  const day = Number(splitUpdDate[2])
  const month = Number(splitUpdDate[1])
  const year = Number(splitUpdDate[0])
  if (isNaN(day) || isNaN(month) || isNaN(year)) {
    return null
  }
  return {
    day,
    month,
    year,
  }
}

export const daysOfWeek = [
  {
    id: 0,
    name: 'Sunday',
    shortName: 'Sun',
  },
  {
    id: 1,
    name: 'Monday',
    shortName: 'Mon',
  },
  {
    id: 2,
    name: 'Tuesday',
    shortName: 'Tue',
  },
  {
    id: 0,
    name: 'Wednesday',
    shortName: 'Wed',
  },
  {
    id: 0,
    name: 'Thursday',
    shortName: 'Thu',
  },
  {
    id: 0,
    name: 'Friday',
    shortName: 'Fri',
  },
  {
    id: 0,
    name: 'Saturday',
    shortName: 'Sat',
  },
]

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export const monthList = [
  {
    id: 1,
    name: 'January',
  },
  {
    id: 2,
    name: 'February',
  },
  {
    id: 3,
    name: 'March',
  },
  {
    id: 4,
    name: 'April',
  },
  {
    id: 5,
    name: 'May',
  },
  {
    id: 6,
    name: 'June',
  },
  {
    id: 7,
    name: 'July',
  },
  {
    id: 8,
    name: 'August',
  },
  {
    id: 9,
    name: 'September',
  },
  {
    id: 10,
    name: 'October',
  },
  {
    id: 11,
    name: 'November',
  },
  {
    id: 12,
    name: 'December',
  },
]

export const shortMonthNames = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'June',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec',
]
