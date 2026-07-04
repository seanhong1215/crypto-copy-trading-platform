let util={};

util.install = (Vue,options)=>{
    Vue.myGlobalMethod = function () {

    };

    Vue.filter('DateFilter', (value)=> {
        if (!value) return '';
        let result;
        Date.prototype.Format = function(fmt)
        {
            let o = {
                "M+" : this.getMonth()+1,                 //月份
                "d+" : this.getDate(),                    //日
                "h+" : this.getHours(),                   //小时
                "m+" : this.getMinutes(),                 //分
                "s+" : this.getSeconds(),                 //秒
                "q+" : Math.floor((this.getMonth()+3)/3), //季度
                "S"  : this.getMilliseconds()             //毫秒
            };
            if(/(y+)/.test(fmt))
                fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
            for(let k in o)
                if(new RegExp("("+ k +")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            return fmt;
        };

        result = new Date(value).Format('yyyy-MM-dd hh:mm:ss');
        return result;
    })
    Vue.filter('money',value=>{
        if(value==0) return "0.00"
        if (!value) return '';
        let valueNumber = Number(value);
        let beAbs = valueNumber>=0?1:(-1);
        let valueArray = (Math.abs(valueNumber)).toFixed(3).split('.');
        valueArray[1] = valueArray[1].substring(0,2)
        if(valueArray[0].length>3){
            let _result;
            let scale = parseInt((valueArray[0].length) / 3);
            let rmainder = (valueArray[0].length) % 3;
            if(scale==1){
                _result = insert_flg(valueArray[0],null,rmainder )
            }else{
                for(let i = 0;i<scale;i++){
                    _result = insert_flg(_result||valueArray[0],i,rmainder)
                }
            }  
            return `${beAbs<0?'-':''}${_result}.${valueArray[1]}`
        }else{
            return `${beAbs<0?'-':''}${valueArray[0]}.${valueArray[1]}`
        }

    })
};

function insert_flg(str,flg,sn){
    let SNF;
    if(sn == 0){
        if(flg==0){
            SNF = 0
        }else{
            SNF = flg*3 + flg-1 + sn
        }
    }else{
        if(flg==0){
            SNF = sn
        }else{
            SNF = flg*3 + sn + flg
        }
    }
 
    let newstr;
    let tmp=str.substring(0, SNF);
    let tail =  str.substring(SNF,);
    if(tmp == ''&&SNF ==0) {
        newstr=tail;
    }else{
        newstr=tmp+','+tail;
    }  
    return newstr;
}

export default util;

