
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
  { id: '1', time: '', activity: 'Reception', role: 'Reception Team', duration: '15m' },
  { id: '2', time: '', activity: 'Meeting Preparation', role: 'Meeting Manager', duration: '15m' },
  { id: '3', time: '', activity: 'Opening Remark', role: 'President', duration: '3m' },
  { id: '4', time: '', activity: 'Timer Introduction', role: '', duration: '2m' },
  { id: '5', time: '', activity: 'Grammarian Introduction', role: '', duration: '2m' },
  { id: '6', time: '', activity: 'General Evaluator Introduction', role: '', duration: '2m' },
  { id: '7', time: '', activity: 'Guest Introduction & Icebreak', role: '', duration: '15m' },
  { id: '8', time: '', activity: 'PREPARED SPEECH', role: '', duration: '', isSectionHeader: true },
  { id: '9', time: '', activity: 'Project Speech #1', role: 'Speaker 1', duration: '7m' },
  { id: '10', time: '', activity: 'Project Speech #2', role: 'Speaker 2', duration: '7m' },
  { id: '11', time: '', activity: 'Evaluation Speech', role: '', duration: '3m' },
  { id: '12', time: '', activity: 'Evaluation Speech', role: '', duration: '3m' },
  { id: '13', time: '', activity: 'Group Photo', role: '', duration: '10m' },
  { id: '14', time: '', activity: 'BREAK TIME 10 MIN', role: '', duration: '10m', isSectionHeader: true },
  { id: '15', time: '', activity: 'Table Topic Speeches', role: 'TT Master', duration: '30m' },
  { id: '16', time: '', activity: 'Table Topic Evaluation', role: '', duration: '6m' },
  { id: '17', time: '', activity: 'Timer Report', role: '', duration: '3m' },
  { id: '18', time: '', activity: 'Grammarian Report', role: '', duration: '3m' },
  { id: '19', time: '', activity: 'General Evaluator Report', role: '', duration: '10m' },
  { id: '20', time: '', activity: 'CONCLUSION', role: '', duration: '', isSectionHeader: true },
  { id: '21', time: '', activity: 'Voting for Best Facilitator', role: '', duration: '1.5m' },
  { id: '22', time: '', activity: 'Moment of Truth', role: '', duration: '5m' },
  { id: '23', time: '', activity: 'Awards', role: '', duration: '2m' },
  { id: '24', time: '', activity: 'Closing Remark', role: 'President', duration: '2m' },
];

export const DEFAULT_OFFICERS: Officer[] = [
  { role: 'President', name: 'Christina Chen' },
  { role: 'VP Education', name: 'Ellie Ding' },
  { role: 'VP Membership', name: 'Namen Zhou' },
  { role: 'VP Public Relations', name: 'Alexandra Huang' },
  { role: 'Secretary', name: 'Melody Mei' },
  { role: 'Treasurer', name: 'Harriet Zeng' },
  { role: 'Sergeant at Arms', name: 'Jason Chen' },
];
