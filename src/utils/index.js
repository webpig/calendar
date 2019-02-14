const DATE = new Date();
const CURR_YEAR = DATE.getFullYear();
const CURR_MONTH = DATE.getMonth() + 1;
const CURR_DATE = DATE.getDate();

const Utils = {
    // 获取某月天数
    getTheNumOfDaysInAMonth (year, month){
        return new Date(year, month, 0).getDate();
    },
    // 将某个月的日期组合成数组
    getDateArr (year, month) {
        let arr = [];
        for (let i = 1; i <= this.getTheNumOfDaysInAMonth(year, month); i++) {
            arr.push(i);
        }
        return arr;
    },
    // 判断是否为周末
    isWeekend (item) {
        return item === '六' || item === '日';
    },
    // 获取该日期是星期几
    getDayInADate (year, month, date) {
        return new Date(`${year}/${month}/${date}`).getDay();
    },
    // 获取上个月的年份和月份
    getYearAndMonthInLastMonth (year, month) {
        month = month - 1;
        if (month < 1) {
            month = 12;
            year = year - 1;
        }
        return {
            year,
            month
        }
    },
    // 获取下个月的年份和月份
    getYearAndMonthInNextMonth (year, month) {
        month = month + 1;
        if (month > 12) {
            month = 1;
            year = year + 1;
        }
        return {
            year,
            month
        }
    },
    // 获取某月的日期组成的数组（注：该数组会和星期对应，星期几会在前面补对应个数空字符串）
    getDateArrInAMonth (year, month, date = 1) {
        let dateArr = this.getDateArr(year, month);
        for (let i = 0; i < this.getDayInADate(year, month, date); i++) {
            dateArr.unshift('');
        }
        return dateArr;
    },
    // 是否是当前日期
    isCurrDate (year, month, date) {
        return (year === CURR_YEAR && month === CURR_MONTH && date === CURR_DATE);
    }
}

export default Utils;