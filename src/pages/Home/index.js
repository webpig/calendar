/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
    PanResponder, StyleSheet, Text, View,
    StatusBar, Dimensions, ImageBackground,
    TouchableOpacity, TouchableWithoutFeedback
} from 'react-native';
import { observer } from 'mobx-react';
import Utils from '../../utils';
import isIphoneX from '../../utils/isIphoneX';
import IndexStore from '../../stores/Home';

const SCREEN_WIDTH = Dimensions.get('window').width;
const DATE = new Date();
const CURR_YEAR = DATE.getFullYear();
const CURR_MONTH = DATE.getMonth() + 1;
const CURR_DATE = DATE.getDate();

const DATE_AND_DAY_CONTAINER_PD = 6; // 日期和星期容器padding
const DATE_ITEM_WIDTH = (SCREEN_WIDTH - DATE_AND_DAY_CONTAINER_PD * 2) / 7; // 日期每项的宽度
const DATE_TEXT_WRAP_WIDTH = DATE_ITEM_WIDTH - 8; // 日期文字包裹的宽度

const bgUrl = {
    uri: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547633398438&di=032cb19e7aaeb4a4415e1267f995122a&imgtype=0&src=http%3A%2F%2Fcdn.duitang.com%2Fuploads%2Fitem%2F201512%2F29%2F20151229214441_QTzNR.jpeg'
};

const dayArr = ['日', '一', '二', '三', '四', '五', '六'];

@observer
export default class Home extends Component {

    constructor (props) {
        super(props);
        this.store = new IndexStore();
    }

    componentWillMount () {
        this._panResponder = PanResponder.create({
            // 要求成为响应者：
            onStartShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dx) >= 15,
            onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dx) >= 15,
      
            onPanResponderGrant: (evt, gestureState) => {
                // 开始手势操作。给用户一些视觉反馈，让他们知道发生了什么事情！
        
                // gestureState.{x,y} 现在会被设置为0
            },
            onPanResponderMove: (evt, gestureState) => {
                // 最近一次的移动距离为gestureState.move{X,Y}

                // 从成为响应者开始时的累计手势移动距离为gestureState.d{x,y}
                if (gestureState.dx > 80 && !this.store.isLoading) {
                    this.store.isLoading = true;
                    this.viewLastMonth();
                }
                if (gestureState.dx < -80 && !this.store.isLoading) {
                    this.store.isLoading = true;
                    this.viewNextMonth();
                }
            },
            onPanResponderTerminationRequest: (evt, gestureState) => true,
            onPanResponderRelease: (evt, gestureState) => {
                // 用户放开了所有的触摸点，且此时视图已经成为了响应者。
                // 一般来说这意味着一个手势操作已经成功完成。
                this.store.isLoading = false;
            },
            onPanResponderTerminate: (evt, gestureState) => {
                // 另一个组件已经成为了新的响应者，所以当前手势将被取消。
            },
            onShouldBlockNativeResponder: (evt, gestureState) => {
                // 返回一个布尔值，决定当前组件是否应该阻止原生组件成为JS响应者
                // 默认返回true。目前暂时只支持android。
                return true;
            },
        });
    }

    render() {
        const {
            lunarYear, lunarMonth, lunarDay
        } = this.solarToLunar(this.store.currClickdDate);
        return (
            <View style={styles.container}>
                <ImageBackground
                    source={bgUrl}
                    style={styles.background}>
                    <View style={styles.yearContainer}>
                        <TouchableOpacity style={styles.arrowBtn} onPress={this.viewLastMonth}>
                            <View style={styles.leftArrow}></View>
                            <Text style={styles.monthText}>
                                {this.store.lastMonth}月
                            </Text>
                        </TouchableOpacity>
                        <Text style={styles.yearText}>
                            {this.store.currDisplayYear}年{this.store.currDisplayMonth}月
                        </Text>
                        {/* <Text style={styles.lunarYearText}>
                            {this.store.currLunarYear}年{this.store.currLunarMonth}月
                        </Text> */}
                        <TouchableOpacity style={styles.arrowBtn} onPress={this.viewNextMonth}>
                            <Text style={styles.monthText}>
                                {this.store.nextMonth}月
                            </Text>
                            <View style={styles.rightArrow}></View>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.dayContainer}>{this.renderDayContainer()}</View>
                    <View style={styles.dateContainer} {...this._panResponder.panHandlers}>{this.renderDateContainer()}</View>
                    <View style={styles.dateDetailContainer}>
                        <Text>{this.store.currDisplayYear}年{this.store.currDisplayMonth}月{this.store.currClickdDate}日</Text>
                        <Text>周{dayArr[this.store.getDayInADate()]}</Text>
                        <Text>{lunarYear}年{lunarMonth}月{lunarDay}</Text>
                    </View>
                </ImageBackground>
            </View>
        );
    }

    // 渲染星期容器
    renderDayContainer () {
        return dayArr.map((item, index) => {
            return (
                <View style={styles.dateItem} key={index}>
                    <Text
                        style={
                            Utils.isWeekend(item) ?
                                [styles.dayText, styles.weekend]
                                :
                                styles.dayText
                        }>
                        {item}
                    </Text>
                </View>
            );
        });
    }

    // 渲染日期容器
    renderDateContainer () {
        return this.store.currDateArr.map((item, index) => {
            return (
                <TouchableWithoutFeedback onPress={() => item && this.clikDateItem(item)} key={index}>
                    <View style={styles.dateItem}>
                        <View style={this.getDateItemStyle(item)}>
                            <Text style={this.getDateTextStyle(item)}>{item}</Text>
                            <Text style={this.getDateTextStyle(item, true)}>
                                {item && this.solarToLunar(item).lunarDay}
                            </Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            );
        });
    }

    // 查看上个月
    viewLastMonth = () => this.store.viewLastMonth();

    // 查看下个月
    viewNextMonth = () => this.store.viewNextMonth();

    // 是否是当前日期
    isCurrDate = (date) => this.store.isCurrDate(date);

    isCurrClickedDate = (date) => this.store.isCurrClickedDate(date);

    // 将公历转为农历
    solarToLunar = (date) => this.store.solarToLunar(date);

    // 点击日期项
    clikDateItem = (date) => this.store.changeCurrClickedDate(date);

    // 获取日历项样式
    getDateItemStyle (date) {
        if (this.isCurrClickedDate(date)) {
            return this.isCurrDate(date) ? [styles.currClickedDateTextWrap, styles.currDate] : styles.currClickedDateTextWrap;
        }
    }

    // 获取日期文本样式
    getDateTextStyle (date, isLunar) {
        // 基础日期文本样式，区分农历公历
        const basicDateTextStyle = isLunar ? styles.lunarDateText : styles.dateText;

        if (this.isCurrDate(date)) {
            return [basicDateTextStyle, this.isCurrClickedDate(date) ? styles.currDateFocus : styles.currDateBlur];
        } else {
            return this.isCurrClickedDate(date) ? [basicDateTextStyle, styles.currDateFocus] : basicDateTextStyle;
        }
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // iphonex适配
        marginTop: isIphoneX() ? 44 : 20,
        // backgroundColor: '#F5FCFF',
    },
    background: {
        flex: 1
    },
    yearContainer: {
        height: 48,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    yearText: {
        fontSize: 20,
        color: 'red',
        // fontWeight: 'bold'
    },
    arrowBtn: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    leftArrow: {
        width: 12,
        height: 12,
        borderWidth: 2,
        borderColor: 'transparent',
        borderBottomColor: 'red',
        borderLeftColor: 'red',
        transform: [{rotate: '45deg'}]
    },
    rightArrow: {
        width: 12,
        height: 12,
        borderWidth: 2,
        borderColor: 'transparent',
        borderRightColor: 'red',
        borderTopColor: 'red',
        transform: [{rotate: '45deg'}]
    },
    monthText: {
        color: 'red',
        fontSize: 14,
        // fontWeight: 'bold'
    },
    dayContainer: {
        height: 48,
        paddingHorizontal: DATE_AND_DAY_CONTAINER_PD,
        flexDirection: 'row'
    },
    dayItem: {
        // flex: 1,
        width: DATE_ITEM_WIDTH,
        alignItems: 'center',
        justifyContent: 'center'
    },
    dayText: {
        fontSize: 14,
        color: '#000'
    },
    weekend: {
        color: '#999'
    },
    dateContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: DATE_AND_DAY_CONTAINER_PD
    },
    dateItem: {
        width: DATE_ITEM_WIDTH,
        height: DATE_ITEM_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
    },
    currDateTextWrap: {
        width: DATE_TEXT_WRAP_WIDTH,
        height: DATE_TEXT_WRAP_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        borderRadius: DATE_TEXT_WRAP_WIDTH,
    },
    currClickedDateTextWrap: {
        width: DATE_TEXT_WRAP_WIDTH,
        height: DATE_TEXT_WRAP_WIDTH,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black',
        borderRadius: DATE_TEXT_WRAP_WIDTH,
    },
    currDate: {
        backgroundColor: 'red',
    },
    dateText: {
        fontSize: 18,
        color: '#000',
        textAlign: 'center'
    },
    lunarDateText: {
        fontSize: 10,
        color: '#000',
        textAlign: 'center'
    },
    currDateFocus: {
        color: 'white',
        fontWeight: 'bold',
    },
    currDateBlur: {
        color: 'red',
    }
});
