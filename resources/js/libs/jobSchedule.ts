import dayjs from 'dayjs'
import {
  DAILY_CRON,
  HOURLY_CRON,
  MONTHLY_CRON,
  SUB_HOUR_CRON,
  WEEKLY_CRON,
  YEARLY_CRON,
} from '@/interfaces/data_interfaces'

export const calculateNextRunTime = (formData: any) => {
  if (!formData || !formData.cron_type || !formData.start_date) return null

  const {
    cron_type,
    schedule_time,
    day_of_week,
    day_of_month,
    month_of_year,
    start_date,
    end_date,
    schedule_start_time,
    sub_hour_interval,
  } = formData

  const now = dayjs()
  let referenceTime = now

  if (start_date) {
    const start = dayjs(start_date).startOf('day')
    if (start.isValid() && start.isAfter(now)) {
      referenceTime = start
    }
  }

  let nextRun = referenceTime

  try {
    if (cron_type === SUB_HOUR_CRON) {
      if (!schedule_start_time || !sub_hour_interval) return null
      const [h, m] = schedule_start_time.split(':').map(Number)
      const interval = Number(sub_hour_interval)
      if (isNaN(h) || isNaN(m) || isNaN(interval) || interval <= 0) return null
      
      let candidate = referenceTime.hour(h).minute(m).second(0).millisecond(0)
      
      while (candidate.isBefore(referenceTime) && candidate.isSame(referenceTime, 'day')) {
        candidate = candidate.add(interval, 'minute')
      }

      if (candidate.isBefore(referenceTime)) {
        nextRun = candidate.add(1, 'day').hour(h).minute(m)
      } else if (!candidate.isSame(referenceTime, 'day')) {
        nextRun = candidate.hour(h).minute(m)
      } else {
        nextRun = candidate
      }
    } else if (cron_type === HOURLY_CRON) {
      // Backend: if ($this->now->minute == 0) { runHourlyQueries(); }
      nextRun = referenceTime.startOf('hour')
      if (nextRun.isBefore(referenceTime) || nextRun.isSame(referenceTime)) {
        nextRun = nextRun.add(1, 'hour')
      }
    } else if (cron_type === DAILY_CRON) {
      if (!schedule_time) return null
      const [h, m, s] = schedule_time.split(':').map(Number)
      if (isNaN(h) || isNaN(m)) return null
      
      let candidate = referenceTime.hour(h).minute(m).second(s ?? 0).millisecond(0)
      if (candidate.isBefore(referenceTime)) {
        candidate = candidate.add(1, 'day')
      }
      nextRun = candidate
    } else if (cron_type === WEEKLY_CRON) {
      if (!schedule_time || !day_of_week) return null
      const [h, m, s] = schedule_time.split(':').map(Number)
      if (isNaN(h) || isNaN(m)) return null
      
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const dayIndex = days.indexOf(day_of_week)
      if (dayIndex === -1) return null
      
      let candidate = referenceTime.day(dayIndex).hour(h).minute(m).second(s ?? 0).millisecond(0)
      if (candidate.isBefore(referenceTime)) {
        candidate = candidate.add(1, 'week')
      }
      nextRun = candidate
    } else if (cron_type === MONTHLY_CRON) {
      if (!schedule_time || !day_of_month) return null
      const [h, m, s] = schedule_time.split(':').map(Number)
      const dom = parseInt(day_of_month.toString())
      if (isNaN(h) || isNaN(m) || isNaN(dom)) return null
      
      let candidate = referenceTime.date(dom).hour(h).minute(m).second(s ?? 0).millisecond(0)
      if (candidate.isBefore(referenceTime)) {
        candidate = candidate.add(1, 'month')
      }
      nextRun = candidate
    } else if (cron_type === YEARLY_CRON) {
      if (!schedule_time || !day_of_month || !month_of_year) return null
      const [h, m, s] = schedule_time.split(':').map(Number)
      const dom = parseInt(day_of_month.toString())
      const moy = parseInt(month_of_year.toString()) - 1
      if (isNaN(h) || isNaN(m) || isNaN(dom) || isNaN(moy)) return null
      
      let candidate = referenceTime.month(moy).date(dom).hour(h).minute(m).second(s ?? 0).millisecond(0)
      if (candidate.isBefore(referenceTime)) {
        candidate = candidate.add(1, 'year')
      }
      nextRun = candidate
    } else {
      return null
    }
  } catch (e) {
    return null
  }

  if (end_date) {
    const end = dayjs(end_date).endOf('day')
    if (end.isValid() && nextRun.isAfter(end)) {
      return 'Next run: Schedule ended'
    }
  }

  return `Next run: ${nextRun.format('dddd, MMMM D, YYYY h:mm A')}`
}
