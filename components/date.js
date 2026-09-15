import { parseISO, format } from "date-fns";

// Show the calendar date the post was written on (the YYYY-MM-DD part), so the
// build server and every visitor's timezone render the same text
export default function Date({ dateString }) {
  const date = parseISO(dateString.slice(0, 10));
  return <time dateTime={dateString}>{format(date, "d LLLL yyyy")}</time>;
}
