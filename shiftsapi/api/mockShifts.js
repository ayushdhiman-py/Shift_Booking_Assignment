import { uuid } from "uuidv4";
import { DateTime } from "luxon";

const shiftTime = (dateObj, shiftDays = 0, hour = 0, minute = 0) =>
  DateTime.fromObject(dateObj)
    .plus({ days: shiftDays, hours: hour, minutes: minute })
    .toMillis();

const createMockShift = (values) =>
  Object.assign(
    {
      id: uuid(),
      booked: false,
    },
    values
  );

export default [
  createMockShift({
    area: "Helsinki",
    date: shiftTime({ day: 18 }),
    startTime: shiftTime({ day: 18 }, 0, 9),
    endTime: shiftTime({ day: 18 }, 0, 10),
  }),
  createMockShift({
    area: "Helsinki",
    date: shiftTime({ day: 19 }),
    startTime: shiftTime({ day: 19 }, 0, 10),
    endTime: shiftTime({ day: 19 }, 0, 11),
  }),
  createMockShift({
    area: "Tampere",
    date: shiftTime({ day: 20 }),
    startTime: shiftTime({ day: 20 }, 0, 11),
    endTime: shiftTime({ day: 20 }, 0, 12),
  }),
  createMockShift({
    area: "Turku",
    date: shiftTime({ day: 21 }),
    startTime: shiftTime({ day: 21 }, 0, 12),
    endTime: shiftTime({ day: 21 }, 0, 13),
  }),
  createMockShift({
    area: "Turku",
    date: shiftTime({ day: 22 }),
    startTime: shiftTime({ day: 19 }, 0, 13),
    endTime: shiftTime({ day: 19 }, 0, 14),
  }),
  createMockShift({
    area: "Turku",
    date: shiftTime({ day: 23 }),
    startTime: shiftTime({ day: 20 }, 0, 14),
    endTime: shiftTime({ day: 20 }, 0, 15),
  }),
];
