
import { AgendaItem, Officer, DayOfWeek, Month } from './types';

export const DAYS: DayOfWeek[] = [
  DayOfWeek.Monday, DayOfWeek.Tuesday, DayOfWeek.Wednesday,
  DayOfWeek.Thursday, DayOfWeek.Friday, DayOfWeek.Saturday, DayOfWeek.Sunday
];

export const MONTHS: Month[] = [
  Month.January, Month.February, Month.March, Month.April,
  Month.May, Month.June, Month.July, Month.August,
  Month.September, Month.October, Month.November, Month.December
];

export const DATES: string[] = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

export const DEFAULT_AGENDA: AgendaItem[] = [
  { id: '1', time: '19:30', activity: 'Reception', role: 'Reception Team', duration: '15m' },
  { id: '2', time: '19:45', activity: 'Meeting Preparation', role: 'Meeting Manager', duration: '5m' },
  { id: '3', time: '19:50', activity: 'Opening Remark', role: 'President', duration: '3m' },
  { id: '4', time: 'PREPARED SPEECH', activity: 'PREPARED SPEECH', role: '', duration: '', isSectionHeader: true },
  { id: '5', time: '19:53', activity: 'Project Speech #1', role: 'Speaker 1', duration: '7m' },
  { id: '6', time: '20:00', activity: 'Project Speech #2', role: 'Speaker 2', duration: '7m' },
  { id: '7', time: 'BREAK TIME', activity: 'INTERMISSION', role: '', duration: '10m', isSectionHeader: true },
  { id: '8', time: '20:17', activity: 'Table Topic Session', role: 'TT Master', duration: '20m' },
  { id: '9', time: '20:37', activity: 'Evaluation Session', role: 'General Evaluator', duration: '30m', isSectionHeader: true },
  { id: '10', time: '21:07', activity: 'Closing Remark', role: 'President', duration: '3m' },
];

export const DEFAULT_OFFICERS: Officer[] = [
  { role: 'President', name: 'Alexandra' },
  { role: 'VP Education', name: 'Russell' },
  { role: 'VP Membership', name: 'Zoe' },
  { role: 'VP Public Relations', name: 'Lucky' },
  { role: 'Secretary', name: 'Karren' },
  { role: 'Treasurer', name: 'Melody' },
  { role: 'Sergeant at Arms', name: 'Harriet' },
];
