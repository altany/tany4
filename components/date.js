import { parseISO, format as formatDate } from "date-fns";

// Show the calendar date the post was written on (the YYYY-MM-DD part), so the
// build server and every visitor's timezone render the same text
export default function Date({ dateString, format = "d LLLL yyyy" }) {
  const date = parseISO(dateString.slice(0, 10));
  return <time dateTime={dateString}>{formatDate(date, format)}</time>;
}
