import { observable, action } from 'mobx';
import Utils from '../../utils';
import solarToLunar from '../../utils/solarToLunar';

const DATE = new Date();
const CURR_YEAR = DATE.getFullYear();
const CURR_MONTH = DATE.getMonth() + 1;
const CURR_DATE = DATE.getDate();

export default class Index {


    @observable currDisplayYear = CURR_YEAR; // 当前显示的年份
    @observable currDisplayMonth = CURR_MONTH; // 当前显示的月份
    @observable currDate = CURR_DATE; // 当前日期（日）-今天
    @observable currClickdDate = CURR_DATE; // 当前点击的日期
    @observable currDateArr = Utils.getDateArrInAMonth(CURR_YEAR, CURR_MONTH); // 当前日期数组（日）
    @observable isLoading = false; // 是否正在刷新界面中

    // 上个月份和下个月份
    @observable lastMonth = Utils.getYearAndMonthInLastMonth(CURR_YEAR, CURR_MONTH).month;
    @observable nextMonth = Utils.getYearAndMonthInNextMonth(CURR_YEAR, CURR_MONTH).month;

    // 对应的农历年份和月份
    @observable currLunarYear = this.solarToLunar(CURR_DATE).lunarYear;
    @observable currLunarMonth = this.solarToLunar(CURR_DATE).lunarMonth;
    @observable currLunarDay = this.solarToLunar(CURR_DATE).lunarDay;

    // 查看上个月
    @action viewLastMonth () {
        const obj = Utils.getYearAndMonthInLastMonth(this.currDisplayYear, this.currDisplayMonth);
        this.currDisplayYear = obj.year;
        this.currDisplayMonth = obj.month;
        this.currDateArr = Utils.getDateArrInAMonth(obj.year, obj.month);
        this.getLastMonthAndNextMonth();
    }

    // 查看下个月
    @action viewNextMonth () {
        const obj = Utils.getYearAndMonthInNextMonth(this.currDisplayYear, this.currDisplayMonth);
        this.currDisplayYear = obj.year;
        this.currDisplayMonth = obj.month;
        this.currDateArr = Utils.getDateArrInAMonth(obj.year, obj.month);
        this.getLastMonthAndNextMonth();
    }

    @action getLastMonthAndNextMonth () {
        this.lastMonth = Utils.getYearAndMonthInLastMonth(this.currDisplayYear, this.currDisplayMonth, 1).month;
        this.nextMonth =  Utils.getYearAndMonthInNextMonth(this.currDisplayYear, this.currDisplayMonth, 1).month;
    }

    @action changeCurrClickedDate (date) {
        this.currClickdDate = date;
    }

    // 是否是当前日期
    isCurrDate (date) {
        return Utils.isCurrDate(this.currDisplayYear, this.currDisplayMonth, date);
    }

    // 是否是当前点击的日期
    isCurrClickedDate (date) {
        return this.currClickdDate === date;
    }

    // 根据年月日获取星期几
    getDayInADate () {
        return Utils.getDayInADate(this.currDisplayYear, this.currDisplayMonth, this.currClickdDate);
    }

    // 将公历转为农历
    solarToLunar (date) {
        return solarToLunar(this.currDisplayYear, this.currDisplayMonth, date);
    }
}