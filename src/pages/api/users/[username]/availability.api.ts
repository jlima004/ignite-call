import { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') return res.status(405).end()

  const username = req.query.username as string
  const { date, userTimeZone } = req.query

  if (!date) return res.status(400).json({ message: 'Missing query: date.' })

  if (!userTimeZone)
    return res.status(400).json({ message: 'Missing query: userTimeZone.' })

  if (!username)
    return res.status(400).json({ message: 'Missing query: username.' })

  const user = await prisma.user.findUnique({
    where: {
      username,
    },
  })

  if (!user) return res.status(404).json({ message: 'User does not exist.' })

  const referenceDate = dayjs(date as string)
  const isPastDate = referenceDate.endOf('day').isBefore(new Date())

  if (isPastDate)
    return res.status(200).json({ possibleTimes: [], availableTimes: [] })

  const userAvailability = await prisma.userTimeInterval.findFirst({
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  })

  if (!userAvailability)
    return res.status(200).json({ possibleTimes: [], availableTimes: [] })

  const {
    time_start_in_minutes: timeStartInMinutes,
    time_end_in_minutes: timeEndInMinutes,
  } = userAvailability

  const startHour = timeStartInMinutes / 60
  const endHour = timeEndInMinutes / 60

  const possibleTimes = Array.from({ length: endHour - startHour }).map(
    (_, i) => {
      return startHour + i
    },
  )

  const blockedTimes = await prisma.scheduling.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set('hour', startHour).toDate(),
        lte: referenceDate.set('hour', endHour).toDate(),
      },
    },
  })

  const timeZone =
    process.env.NODE_ENV === 'production' ? Number(userTimeZone) : 0

  const availableTimes = possibleTimes.filter((time) => {
    const isTimeBlocked = !blockedTimes.some(
      (blockedTime) => blockedTime.date.getHours() + timeZone === time,
    )

    const isTimeInPast = referenceDate
      .set('hour', time + -timeZone)
      .isBefore(new Date())

    return isTimeBlocked && !isTimeInPast
  })

  res.status(200).json({ possibleTimes, availableTimes })
}
