import moment from "moment";
import common from "../../js/common/value.js";

const dateFormat = common.dateFormat[common.defaultDateFormat][0];
const $formatter = {
  dateFormat,
  formatDate: (dd, mm, yyyy) => {
    let d = new Date(`${yyyy}/${mm}/${dd}`);
    return moment(d).format(dateFormat);
  },
  formatDateToApiDate: (input) => {
    let d = moment(input, dateFormat).toDate();
    d.setTime(d.getTime() + 7 * 60 * 60 * 1000);
    // console.log(d.toISOString());
    return d;
  },
  isValidDate: (inputDate) => {
    return moment(
      inputDate,
      common.dateFormat[common.defaultDateFormat],
      true
    ).isValid();
  },
  changeFormat: (input) => {
    return moment(input).format(dateFormat);
  },
  stringToDmy: (input) => {
    const dateParsed = input.split("/");
    switch (common.defaultDateFormat) {
      case "dmy":
        return {
          day: parseInt(dateParsed[0]),
          month: parseInt(dateParsed[1]),
          year: parseInt(dateParsed[2]),
        };
      case "mdy":
        return {
          day: parseInt(dateParsed[1]),
          month: parseInt(dateParsed[0]),
          year: parseInt(dateParsed[2]),
        };
      case "ymd":
        return {
          day: parseInt(dateParsed[2]),
          month: parseInt(dateParsed[1]),
          year: parseInt(dateParsed[0]),
        };
    }
  },
  dateToString: (dd, mm, yyyy) => {
    switch (common.defaultDateFormat) {
      case "dmy":
        return `${dd}/${mm}/${yyyy}`;
      case "mdy":
        return `${mm}/${dd}/${yyyy}`;
      case "ymd":
        return `${yyyy}/${mm}/${dd}`;
    }
  },
};
export default $formatter;
