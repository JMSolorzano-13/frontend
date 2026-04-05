import _ from "lodash";
import moment from "moment";
import { SingleLogDayType } from "@api/sat";

export function transformFillEmptyDays(
  days: SingleLogDayType[],
  daysDifference: number
): SingleLogDayType[] {
  const byMoth = _.groupBy(days, (item) => {
    return moment(item.date).format("MM/YYYY");
  });

  const groupedKeys = Object.keys(byMoth);

  const filledDays = groupedKeys.map((monthAndYear) => {
    const divided = monthAndYear.split("/");
    const year = divided[1];
    const month = divided[0];
    const actualDate = moment(new Date());
    const daysOfTheMonth = moment(`${month}/01/${year}`).daysInMonth();
    let newArray = Array.from(Array(daysOfTheMonth).keys());

    if (
      actualDate.month() + 1 === parseInt(month, 10) &&
      actualDate.year() === parseInt(year, 10)
    ) {
      newArray = Array.from(Array(parseInt(actualDate.format("DD"), 10)).keys());
    }
    const perDay = newArray.map((currentDay) => {
      const findIfDayExist = byMoth[monthAndYear].find((d) => {
        const day = moment(d.date).format("DD");
        return parseFloat(day) === currentDay + 1;
      });

      if (findIfDayExist) {
        if(findIfDayExist.status === "MAY_HAVE_MISSING"){
          return {...findIfDayExist, status: "INCOMPLETE"}
        }
        return findIfDayExist;
      }
      const date = `${month}/${currentDay + 1}/${year}`;
      return {
        date: moment(date).toISOString(),
        status: "EMPTY",
        issued: {
          total: 0,
          processed: 0,
        },

        received: {
          total: 0,
          processed: 0,
        },
      };
    });
    return perDay;
  });

  const flattenDays = _.flatten(filledDays);
  const finalDays = flattenDays.map((day) => {
    if (!moment(day.date).isAfter(moment())) {
      return day;
    }
  });
  const finalData = finalDays.filter((value) => value !== undefined);
  const deletedDay = daysDifference === 0 ? finalData : finalData.pop(); // eslint-disable-line @typescript-eslint/no-unused-vars

  return finalData as SingleLogDayType[];
}
