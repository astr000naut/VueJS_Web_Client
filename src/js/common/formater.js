import moment from "moment";
import common from "../../js/common/value.js";

const dateFormat = common.dateFormat[common.defaultDateFormat][0];
const $formatter = {
  dateFormat,
  /**
   * Hàm format từ ngày dạng số sang string dateFormat
   * @param {Number} dd ngày
   * @param {Number} mm tháng
   * @param {Number} yyyy năm
   * Author: Dũng (08/05/2023)
   */
  formatDate: (dd, mm, yyyy) => {
    let d = new Date(`${yyyy}/${mm}/${dd}`);
    return moment(d).format(dateFormat);
  },

  /**
   * Hàm format từ ngày dạng string sang dạng của Backend
   * @param {String} input ngày dạng string
   * Author: Dũng (08/05/2023)
   */
  formatDateToApiDate: (input) => {
    if (!input.length) return null;
    let d = moment(input, dateFormat).format("YYYY-MM-DD");
    // console.log(d.toISOString());
    return d;
  },
  /**
   * Kiểm tra xem string date có phải ngày hợp lệ hay không
   * @param {String} inputDate ngày
   * Author: Dũng (08/05/2023)
   */
  isValidDate: (inputDate) => {
    return moment(
      inputDate,
      common.dateFormat[common.defaultDateFormat],
      true
    ).isValid();
  },
  /**
   * Hàm format ngày sang định dạng dateFormat
   * @param {String} input ngày
   * Author: Dũng (08/05/2023)
   */
  changeFormat: (inputDate) => {
    if (!inputDate) return "";
    const date = moment(new Date(inputDate));
    return date.format("DD/MM/YYYY");
  },
  /**
   * Hàm format từ ngày dạng string sang dạng số
   * @param {String} input ngày dạng string
   * Author: Dũng (08/05/2023)
   */
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
  /**
   * Hàm format từ ngày dạng số sang string
   * @param {Number} dd ngày
   * @param {Number} mm tháng
   * @param {Number} yyyy năm
   * Author: Dũng (08/05/2023)
   */
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
