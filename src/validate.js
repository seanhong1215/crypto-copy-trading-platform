import phoneCodes from '@/assets/js/phoneRule.js';
import idCardCodes from '@/assets/js/userIdCardRule.js';
import i18n from '@/i18n/i18n'

let phoneReg =phoneCodes["+86"]
let UserIdCardReg =idCardCodes["中国"]


export default {
    checkNull: (rule, value, callback) => {
        if (value.toString().trim() == '') {
            callback(new Error(i18n.tc('rules.not_null')));
        } else {
            callback();
        }
    },
    checkEmail: (rule, value, cb) => {
        if (!phoneCodes.email.test(value)){
            cb(new Error(i18n.tc('rules.entry_email_wrong')))
        }else {
            cb()
        }
    },
    checkTszf: (rule, value, callback) => {
        let regEn = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\] ]/im,
            regCn = /[·！#￥（）：；“”‘、，|《。》？、【】[\] ]/im;
        if (regEn.test(value)) {
            callback(new Error(i18n.tc('rules.cannot_include_special_characters')));
        } else if (regCn.test(value)) {
            callback(new Error(i18n.tc('rules.cannot_include_special_characters')));
        } else {
            callback();
        }
    },
    setPhoneReg: (gm) => {
        phoneReg = phoneCodes[gm]
    },
    setUserIdCardReg: (gm) => {
        UserIdCardReg = idCardCodes[gm]
    },
    checkCellPhone: (rule, value, callback) => {
        let reg = phoneReg;
        let _val = value.trim();
        if (!reg.test(_val)) {
            callback(new Error(i18n.tc('rules.entry_moile_wrong')));
        } else {
            callback();
        }
    },
    checkChinese: (rule, value, callback) => {
        let reg = /[\u4e00-\u9fa5]/
        if (reg.test(value)) {
            callback(new Error(i18n.tc('rules.cannot_include_chinese')));
        } else {
            callback();
        }
    },
    checkPaymentPassword: (rule, value, cb) => {
        let reg = /^[0-9]*$/
        if (value.length != 6 || !reg.test(value)) {
            cb(new Error(i18n.tc('rules.only_six_chars')));
        } else {
            cb();
        }
    },
    checkNumber: (rule, value, callback) => {
        let reg = /^[0-9]*$/
        if (!reg.test(value)) {
            callback(new Error(i18n.tc('rules.only_number')));
        } else {
            callback();
        }
    },
    //检查实名认证的名字
    checkRealName: (rule, value, callback) => {
        let reg = /[\u4e00-\u9fa5A-Za-z]{2,20}/;
        if (!reg.test(value)) {
            callback(new Error(i18n.tc('rules.entry_name_wrong')));
        } else {
            callback();
        }
    },
    //检查身份证号码
    checkCardId: (rule, value, callback) => {
        let city = {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江 ",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北 ",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏 ",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外 "
        };
        let reg = /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/; //大陆地区身份证验证规则
        value = value.trim();
        if (value.length === 18 && UserIdCardReg === "CN") {
            let code = value.split('');
            let factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            let parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            let sum = 0;
            let ai = 0;
            let wi = 0;
            for (let i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            if (parity[sum % 11] != code[17].toUpperCase()) {
                callback(new Error(i18n.tc('rules.wrong_id_card_number')));
            } else if (!reg.test(value)) {
                callback(new Error(i18n.tc('rules.wrong_id_card_number')));
            } else if (!city[value.substr(0, 2)]) {
                callback(new Error(i18n.tc('rules.wrong_id_card_number')));
            } else {
                callback();
            }
        } else if (value.length === 10 && UserIdCardReg === "TW") {
            //台湾地区身份验证
            let _reg_tw = /^[a-zA-Z][0-9]{9}$/; //台湾地区身份证验证规则
            let card = value.toUpperCase();
            if (!_reg_tw.test(card)) {
                callback(new Error(i18n.tc('rules.wrong_id_card_number')));
            } else {
                callback();
            }
        } else if (value.length === 8 && UserIdCardReg === "HK") {
            //香港地区身份验证
            let _reg_hk = /[A-Z][0-9]{6}([0-9A-Z])/; //香港地区身份证验证规则
            let card = value.toUpperCase();
            if (!_reg_hk.test(card)) {
                callback(new Error(i18n.tc('rules.wrong_id_card_number')));
            } else {
                callback();
            }
        } else if (value.length === 14 && UserIdCardReg === "MY") {
            let _value = value.trim();
            //大马地区身份验证
            let _regMalay = /[0-9]{2}[0-1]{1}[0-9]{1}[0-3]{1}[0-9]{1}\-[0-9]{2}-[0-9]{4}/; //大马地区身份证验证规则 ;//大马地区身份证验证规则
            if (_value.charAt(2) == 1) {
                // 月份为10+
                if (_value.charAt(4) == 0 || _value.charAt(4) == 1 || _value.charAt(4) == 2) {
                    // 日为30-
                    _regMalay = /[0-9]{2}[1]{1}[0-2]{1}[0-2]{1}[1-9]{1}\-[0-9]{2}\-[0-9]{4}/; //大马地区身份证验证规则
                }
                if (_value.charAt(4) == 3) {
                    // 日为30+
                    _regMalay = /[0-9]{2}[1]{1}[0-2]{1}[3]{1}[0-1]{1}\-[0-9]{2}-[0-9]{4}/; //大马地区身份证验证规则
                }
            }
            if (_value.charAt(2) == 0) {
                // 月份为10-
                if (_value.charAt(4) == 0 || _value[4] == 1 || _value[4] == 2) {
                    // 日为30-
                    _regMalay = /[0-9]{2}[0]{1}[1-9]{1}[0-2]{1}[1-9]{1}\-[0-9]{2}\-[0-9]{4}/; //大马地区身份证验证规则
                }
                if (_value.charAt(4) == 3) {
                    // 日为30+
                    _regMalay = /[0-9]{2}[0]{1}[1-9]{1}[3]{1}[0-1]{1}\-[0-9]{2}\-[0-9]{4}/; //大马地区身份证验证规则
                }
            }

            if (!_regMalay.test(_value)) {
                callback(new Error(i18n.tc('rules.wrong_id_card_number')));
            } else {
                callback();
            }
        } else if (UserIdCardReg === "OTS") {
            callback();
        }else {
            callback(new Error(i18n.tc('rules.wrong_id_card_number')));
        }
    },
}
