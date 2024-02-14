const extra = {
  addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  },
  dateToStrDay(date) {
    let month = "" + (date.getMonth() + 1);
    let day = "" + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) {
      month = "0" + month;
    }

    if (day.length < 2) {
      day = "0" + day;
    }
    return [year, month, day].join("");
  },
  dateToDivStrDay(date, div) {
    let month = "" + (date.getMonth() + 1);
    let day = "" + date.getDate();
    const year = date.getFullYear();

    if (month.length < 2) {
      month = "0" + month;
    }

    if (day.length < 2) {
      day = "0" + day;
    }
    return [year, month, day].join(div);
  },
  stringHiDateToDate(yyyymmdd) {
    if (yyyymmdd == null) {
      return "";
    } else {
      const strDate = String(yyyymmdd);
      const year = strDate.substring(0, 4);
      const month = strDate.substring(5, 7);
      const day = strDate.substring(8, 10);
      const dateTime = new Date(Number(year), Number(month) - 1, Number(day));
      return dateTime;
    }
  },
  stringYyyyMmDdToDate(strDate) {
    const yyyyMMdd = String(strDate);
    const sYear = yyyyMMdd.substring(0, 4);
    const sMonth = yyyyMMdd.substring(4, 6);
    const sDate = yyyyMMdd.substring(6, 8);
    return new Date(Number(sYear), Number(sMonth) - 1, Number(sDate));
  },
  appendStringDate(nohidate) {
    if (nohidate !== null && nohidate.length === 8) {
      const strDate =
        nohidate.substring(0, 4) +
        "-" +
        nohidate.substring(4, 6) +
        "-" +
        nohidate.substring(6, 8);
      return strDate;
    } else {
      return "";
    }
  },
  getArrayDepth(arrData, depth) {
    if (Array.isArray(arrData)) {
      const subData = arrData[0];
      return this.getArrayDepth(subData, depth + 1);
    } else {
      return depth;
    }
  },
  isNullOrUndefinde(data) {
    if (typeof data === "undefined" || data === null) {
      return true;
    }
    return false;
  },
  isNullOrUndefindeOrEmpty(data) {
    if (typeof data === "undefined" || data === null || data === "") {
      return true;
    }
    return false;
  },

  dataTimeToStr(date) {
    return [
      date.getFullYear(),
      extra.padTo2Digits(date.getMonth() + 1),
      extra.padTo2Digits(date.getDate()),
      extra.padTo2Digits(date.getHours()),
      extra.padTo2Digits(date.getMinutes()),
    ].join("");
  },

  padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  },
};

export { extra };
