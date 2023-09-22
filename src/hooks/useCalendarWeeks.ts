import { useMemo } from 'react'
import dayjs from 'dayjs'

interface CalendarWeek {
  week: number
  days: {
    date: dayjs.Dayjs
    disabled: boolean
  }[]
}

type CalendarWeeks = CalendarWeek[]

export const useCalendarWeeks = (date: dayjs.Dayjs) => {
  const computeCalendarWeeks = () => {
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
        return { date, disabled: date.endOf('day').isBefore(new Date()) }
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

  return useMemo(computeCalendarWeeks, [date])
}
