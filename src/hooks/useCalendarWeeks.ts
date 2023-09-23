import { useMemo } from 'react'
import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'

import { api } from '@/lib/axios'

interface CalendarWeek {
  week: number
  days: {
    date: dayjs.Dayjs
    disabled: boolean
  }[]
}

type CalendarWeeks = CalendarWeek[]

interface BlockedDates {
  blockedWeekDays: number[]
  blockedDates: number[]
}

export const useCalendarWeeks = (date: dayjs.Dayjs) => {
  const router = useRouter()
  const username = router.query.username as string

  const { data: blockedDates } = useQuery<BlockedDates>(
    ['blocked-dates', date.get('year'), date.get('month') + 1, username],
    async () => {
      const response = await api.get(`/users/${username}/blocked-dates`, {
        params: {
          year: date.get('year'),
          month: date.get('month') + 1,
        },
      })

      return response.data
    },
  )

  const computeCalendarWeeks = () => {
    if (!blockedDates) return []

    const daysInMonthArray = Array.from({
      length: date.daysInMonth(),
    }).map((_, i) => {
      return date.set('date', i + 1)
    })

    const firstWeekday = date.get('day')

    const previousMonthFillArray = Array.from({
      length: firstWeekday,
    })
      .map((_, i) => {
        return date.subtract(i + 1, 'day')
      })
      .reverse()

    const lastDayInCurrentMonth = date.set('date', date.daysInMonth())

    const lastWeekday = lastDayInCurrentMonth.get('day')

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekday + 1),
    }).map((_, i) => {
      return lastDayInCurrentMonth.add(i + 1, 'day')
    })

    const calendarDays = [
      ...previousMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
      ...daysInMonthArray.map((date) => {
        return {
          date,
          disabled:
            date.endOf('day').isBefore(new Date()) ||
            blockedDates?.blockedWeekDays.includes(date.get('day')) ||
            blockedDates?.blockedDates.includes(date.get('date')),
        }
      }),
      ...nextMonthFillArray.map((date) => {
        return { date, disabled: true }
      }),
    ]

    const calendarWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        const isNewWeek = i % 7 === 0

        if (isNewWeek) {
          weeks.push({
            week: i / 7 + 1,
            days: original.slice(i, i + 7),
          })
        }

        return weeks
      },
      [],
    )

    return calendarWeeks
  }

  return useMemo(computeCalendarWeeks, [blockedDates, date])
}
