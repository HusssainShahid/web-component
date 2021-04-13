import NonEmptyString from "../../../../src/types/non-empty-string";
import DateComparison from "../../../../src/modules/calendar/modal/date-comparison";
import TimeComparison from "../../../../src/modules/calendar/modal/time-comparison";

export class Events {

  validate(data) {
    try {
      let date = new DateComparison(new NonEmptyString(data.startDate, 'Start date cannot be empty.'), new NonEmptyString(data.endDate, 'End date cannot be empty.'));
      if (data.startDate === data.endDate) {
        let time = new TimeComparison(data.startTime, data.endTime);
      }
      return true
    } catch (e) {
      if (e === 'Event end date cannot be earlier than start date.') {
        return {exception: e, id: 'endDate'};
      }
      if (e === 'End time can not earlier than start time.') {
        return {exception: e, id: 'endTime'};
      }
    }
  }
}
