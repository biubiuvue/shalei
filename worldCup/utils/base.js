/**
 * 工具类
 * @return {[type]} [description]
 */
var util = {
  version: "2.0.0"
};

/**
 * 判断参数是否为空
 * @param  {[String]}  value 待验证的参数
 * @return {Boolean}   ture-空，false-不为空
 */
util.isEmpty = function (value) {
  if (typeof (value) == "undefined" || value == null || value === "") {
    return true;
  } else {
    return false;
  }
};

/**
 * 判断手机号码格式
 * @param  {[String]}  value 待验证的参数
 * @return {Boolean}   ture-正确，false-不正确
 */
util.isMobile = function (value) {
  var reg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
  if (reg.test(value)) {
    return true;
  } else {
    return false;
  }
};

/**
 * 判断身份证格式
 * @param  {[String]}  value 待验证的参数
 * @return {Boolean}   ture-符合规范，false-不符合规范
 */
util.isIdentityCard = function (value) {
  var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (reg.test(value)) {
    return true;
  } else {
    return false;
  }
};

/**
 * 判断邮箱格式
 * @param  {[String]}  value 待验证的参数
 * @return {Boolean}   ture-符合规范，false-不符合规范
 */
util.isEmail = function (value) {
  var reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
  if (reg.test(value)) {
    return true;
  } else {
    return false;
  }
};

/**
 * 根据文件名获取文件后缀。例：'xxxxx.jpg.EXE' 返回 'exe'
 * @param  {String} fileName 文件名
 * @return {String}          小写形式的后缀名
 */
util.getFileSuffix = function (fileName) {
  var suffix = '';
  index = fileName.lastIndexOf('.');
  if (index > -1) {
    suffix = fileName.substring(index + 1).toLowerCase();
  }
  return suffix;
};

/**
 * 时间格式化
 * @param  {[Date]} date   要格式化的时间对象
 * @param  {[String]} format 格式，例如"yyyy-MM-dd HH:mm:ss"
 * @return {[String]}        格式化后的时间字符串
 */
util.dateFormat = function (date, format) {
  var zeroPadding = function (i) {
    return (i < 10 ? "0" : "") + i;
  };
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function (item) {
    switch (item) {
      case "yyyy":
        return zeroPadding(date.getFullYear());
      case "MM":
        return zeroPadding(date.getMonth() + 1);
      case "dd":
        return zeroPadding(date.getDate());
      case "HH":
        return zeroPadding(date.getHours());
      case "mm":
        return zeroPadding(date.getMinutes());
      case "ss":
        return zeroPadding(date.getSeconds());
    }
  });
};

/**
 * 获取两个日期之间的间隔天数。两个日期的格式为：yyyy-MM-dd
 * @param  {[String]} beginDate 开始日期。例：2016-01-01
 * @param  {[String]} endDate   结束日期。例：2016-07-23
 * @return {[int]}           间隔天数
 */
util.getIntervalDays = function (beginDate, endDate) {
  var beginArr = beginDate.split("-");
  var endArr = endDate.split("-");
  var begin = new Date(beginArr[0], beginArr[1] - 1, beginArr[2]);
  var end = new Date(endArr[0], endArr[1] - 1, endArr[2]);
  var temp = (end - begin) / (1000 * 60 * 60 * 24);
  if (temp < 0) {
    return temp -= 1;
  } else {
    return temp += 1;
  }
};

/**
 * 获取URL中参数的的值
 * @param  {[String]} key 参数名称
 * @return {[String]}     参数值
 */
util.getParameter = function (key) {
  var url = location.href;
  var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");
  var paraObj = {};
  for (var i = 0, len = paraString.length; i < len; i++) {
    var j = paraString[i];
    paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);
  }
  var returnValue = paraObj[key.toLowerCase()];
  if (typeof (returnValue) == "undefined") {
    return "";
  } else {
    return returnValue;
  }
};

/**
 * 设置cookie值
 * @param  {[String]} key 参数名称
 * @param  {[String]} value 参数值
 * @param  {[int]} sec 是小时间。单位：秒
 * @return {[String]}     
 */
util.setCookie = function (key, value, sec) {
  var cookieStr = key + '=' + escape(value);
  if (!util.isEmpty(sec)) {
    var exp = new Date();
    exp.setTime(exp.getTime() + sec * 1000);
    cookieStr += ';expires=' + exp.toGMTString();
  }
  cookieStr += ';path=/';
  document.cookie = cookieStr;
};

/**
 * 获取cookie中参数的的值
 * @param  {[String]} key 参数名称
 * @return {[String]}     参数值
 */
util.getCookie = function (key) {
  var arr = document.cookie.match(new RegExp("(^| )" + key + "=([^;]*)(;|$)"));
  if (arr == null || arr == "") {
    return "";
  } else {
    return unescape(arr[2]);
  }
};

/**
 * 清除cookie中的值
 * @param  {[String]} key 参数名称
 * @return 
 */
util.clearCookie = function (key) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var value = util.getCookie(key);
  if (!util.isEmpty(value)) {
    document.cookie = key + "=" + value + ";expires=" + exp.toGMTString();
  }
};

/**
 * 秒格式化。转换成：时分秒。例：4230秒 转换成 1小时10分30秒
 * @param   int seconds 
 * @return  String
 */
util.secondFormat = function (seconds) {
  var theTime = parseInt(seconds); // 秒
  var theTime1 = 0; // 分
  var theTime2 = 0; // 小时
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
    if (theTime1 > 60) {
      theTime2 = parseInt(theTime1 / 60);
      theTime1 = parseInt(theTime1 % 60);
    }
  }
  var result = "" + parseInt(theTime) + "秒";
  if (theTime1 > 0) {
    result = "" + parseInt(theTime1) + "分" + result;
  }
  if (theTime2 > 0) {
    result = "" + parseInt(theTime2) + "小时" + result;
  }
  return result;
};


/**
 * base 64位加密解密
 */
util.base64 = function (dir, input) {
  console.log(11111111)
  var publ = {},
    self = this,
    b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

  // http://phpjs.org/functions/base64_encode/
  publ.encode = function (data) {
    data = !(self instanceof $) ? data : self.is(':input') ? self.val() : self.text();
    data = unescape(encodeURIComponent(data));

    if (data === '') return;
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
      ac = 0,
      enc = "",
      tmp_arr = [];

    if (!data) return data;

    do { // pack three octets into four hexets
      o1 = data.charCodeAt(i++);
      o2 = data.charCodeAt(i++);
      o3 = data.charCodeAt(i++);

      bits = o1 << 16 | o2 << 8 | o3;

      h1 = bits >> 18 & 0x3f;
      h2 = bits >> 12 & 0x3f;
      h3 = bits >> 6 & 0x3f;
      h4 = bits & 0x3f;

      // use hexets to index into b64, and append result to encoded string
      tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    var r = data.length % 3;

    return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
  };

  // http://phpjs.org/functions/base64_decode/
  publ.decode = function (data) {
    data = !(self instanceof $) ? data : self.is(':input') ? self.val() : self.text();

    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
      ac = 0,
      dec = "",
      tmp_arr = [];

    if (!data) return data;

    data += '';

    do { // unpack four hexets into three octets using index points in b64
      h1 = b64.indexOf(data.charAt(i++));
      h2 = b64.indexOf(data.charAt(i++));
      h3 = b64.indexOf(data.charAt(i++));
      h4 = b64.indexOf(data.charAt(i++));

      bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;

      o1 = bits >> 16 & 0xff;
      o2 = bits >> 8 & 0xff;
      o3 = bits & 0xff;

      if (h3 == 64) {
        tmp_arr[ac++] = String.fromCharCode(o1);
      } else if (h4 == 64) {
        tmp_arr[ac++] = String.fromCharCode(o1, o2);
      } else {
        tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
      }
    } while (i < data.length);

    dec = tmp_arr.join('');

    return decodeURIComponent(escape(dec));
  };

  return input ? publ[dir](input) : dir ? null : publ;
};

/**
 * 对内容加密
 * @param {[String]} mingwen 加密明文
 * @param {[int]} times 加密次数
 */
util.encodeBase64 = function (mingwen, times) {
  var code = "";
  var num = 1;
  if (typeof times == 'undefined' || times == null || times == "") {
    num = 1;
  } else {
    var vt = times + "";
    num = parseInt(vt);
  }

  if (typeof mingwen == 'undefined' || mingwen == null || mingwen == "") {

  } else {
    util.base64.utf8encode = true;
    code = mingwen;
    for (var i = 0; i < num; i++) {
      code = $.base64('encode', code);
    }
  }
  return code;
};

/**
 * 对加密内容进行解密
 * @param {[String]} mi 要解密内容
 * @param {[int]} times 解密次数
 */
util.decodeBase64 = function (mi, times) {
  var mingwen = "";
  var num = 1;
  if (typeof times == 'undefined' || times == null || times == "") {
    num = 1;
  } else {
    var vt = times + "";
    num = parseInt(vt);
  }

  if (typeof mi == 'undefined' || mi == null || mi == "") {

  } else {
    util.base64.utf8encode = true;
    mingwen = mi;
    for (var i = 0; i < num; i++) {
      mingwen = util.base64().decode(mingwen);
    }
  }
  return mingwen;
};

export {
  util
}