/**
 * date format
 * @method dateFormat
 * @param  {[date]}     date
 * @param  {[string]}   format
 * @return {[string]}
 * usage:
 *          console.log(dateFormat(new Date(), 'YYYY-MM-DD hh:mm:ss'));        // 2016-08-19 12:22:09
 */
function dateFormat(date, format) {
    if (/(Y+)/.test(format)) {
        // console.log(format); //YYYY-MM-DD
        // console.log(RegExp.$1); //YYYY
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        // console.log(format); //2016-MM-DD
    }
    var json = {
        "M+": date.getMonth() + 1, //month
        "D+": date.getDate(), //day
        "h+": date.getHours(), //hour
        "m+": date.getMinutes(), //minute
        "s+": date.getSeconds(), //second
        "q+": Math.floor((date.getMonth() + 3) / 3), //quarter
        "S": date.getMilliseconds() //millisecond
    };
    for (var k in json) {
        if (new RegExp("(" + k + ")").test(format)) {
            // console.log(RegExp.$1); //MM DD
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? json[k] : ("00" + json[k]).substr(("" + json[k]).length));
        }
    }
    return format;
}
/*console.log(dateFormat(new Date(), 'YYYY-MM-DD hh:mm:ss'));*/
Date.prototype.format = function(format) {
    if (/(Y+)/.test(format)) {
        // console.log(format); //YYYY-MM-DD
        // console.log(RegExp.$1); //YYYY
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        // console.log(format); //2016-MM-DD
    }
    var json = {
        "M+": this.getMonth() + 1, //month
        "D+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    };
    for (var k in json) {
        if (new RegExp("(" + k + ")").test(format)) {
            // console.log(RegExp.$1); //MM DD
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? json[k] : ("00" + json[k]).substr(("" + json[k]).length));
        }
    }
    return format;
};
// console.log(new Date().format('YYYY-MM-DD hh:mm:ss'));

/**
 * Convert old .net serialized object json date to normal date
 * extend String.prototype this method
 * @param  {[type]} jsondate [/Date(1294499956278+0800)/]
 * @return {[type]}          [can be 2016/09/30]
 */
function convertJsondate(jsondate) {
    var date = new Date(parseInt(jsondate.match(/\d+/)));
    // var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    // var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    // return month + "/" + day + "/" + date.getFullYear();

    return dateFormat(date, 'MM/DD/YYYY');
}


/**
 * get current datetime 2016/08/04 13:17:53
 * @method getCurrentDatetime      [getCurrentDatetime(true) or getCurrentDatetime()]
 * @param  {[boolean]}   noZero    [default noZero is false. only when passing true, no 0. otherwise add 0]
 * @return {[string]}              [2016/08/04 13:17:53]
 */
function getCurrentDatetime(noZero) {
    var currentdate = new Date();

    var year = currentdate.getFullYear();
    var month = currentdate.getMonth() + 1;
    var day = currentdate.getDate();
    var hour = currentdate.getHours();
    var minute = currentdate.getMinutes();
    var second = currentdate.getSeconds();

    if (!noZero) {
        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }
        if (hour < 10) {
            hour = '0' + hour;
        }
        if (minute < 10) {
            minute = '0' + minute;
        }
        if (second < 10) {
            second = '0' + second;
        }
    }

    return year + '/' + month + '/' + day + ' ' + hour + ":" + minute + ":" + second;
}

/**
 * format datetime: console.log(formatDate(new Date(), true));     2016/8/4 11:18:52
 * @method formatDate
 * @param  {[date object]}  date  [date object]
 * @param  {[boolean]}   noZero   [default noZero is false. only when passing true, no 0. otherwise add 0]
 * @return {[string]}             [2016/08/04 13:17:53]
 */
function formatDate(date, noZero) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    if (!noZero) {
        if (month < 10) {
            month = '0' + month;
        }
        if (day < 10) {
            day = '0' + day;
        }
        if (hour < 10) {
            hour = '0' + hour;
        }
        if (minute < 10) {
            minute = '0' + minute;
        }
        if (second < 10) {
            second = '0' + second;
        }
    }

    return year + '/' + month + '/' + day + ' ' + [hour, minute, second].join(':');
}

// console.log(new Date()); // Thu Aug 04 2016 11:19:13 GMT-0700 (Pacific Daylight Time)
// console.log(Date.now()); // 1470334810012
/*
if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}*/


/**
 * the difference between 2 dates
 * @param  {[type]} unit       [second, hour, month, year, etc]
 * @param  {[type]} targetDate [the date you want to compare]
 * @return {[number]}            [time span]
 * usage:
        console.log(new Date().diff('s', new Date('2017-05-11')));
 */
Date.prototype.diff = function(unit, targetDate) {
    //若参数不足或 targetDate 不是日期类型則回传 undefined
    if (arguments.length < 2 || targetDate.constructor != Date) {
        return undefined;
    }
    switch (unit) {
        //计算秒差
        case 's':
            return parseInt((targetDate - this) / 1000);
            //计算分差
        case 'n':
            return parseInt((targetDate - this) / 60000);
            //计算時差
        case 'h':
            return parseInt((targetDate - this) / 3600000);
            //计算日差
        case 'd':
            return parseInt((targetDate - this) / 86400000);
            //计算周差
        case 'w':
            return parseInt((targetDate - this) / (86400000 * 7));
            //计算月差
        case 'm':
            return (targetDate.getMonth() + 1) + ((targetDate.getFullYear() - this.getFullYear()) * 12) - (this.getMonth() + 1);
            //计算年差
        case 'y':
            return targetDate.getFullYear() - this.getFullYear();
            //输入有误
        default:
            return undefined;
    }
};
