
export interface AgendaItem {
  id: string;
  time: string;
  activity: string;
  role: string;
  duration: string;
  isSectionHeader?: boolean;
}

export interface Officer {
  role: string;
  name: string;
}

export interface MeetingInfo {
  meetingNumber: string;
  theme: string;
  introduction: string;
  day: string;
  month: string;
  date: string;
  time: string;
  location: string;
  locationEn: string;
  wordOfTheDay: string;
  logoUrl: string;
}

export enum DayOfWeek {
  Monday = 'Monday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday',
  Thursday = 'Thursday',
  Friday = 'Friday',
  Saturday = 'Saturday',
  Sunday = 'Sunday'
}

export enum Month {
  January = 'January',
  February = 'February',
  March = 'March',
  April = 'April',
  May = 'May',
  June = 'June',
  July = 'July',
  August = 'August',
  September = 'September',
  October = 'October',
  November = 'November',
  December = 'December'
}
