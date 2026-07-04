export default {
    //不显示后戳的列表
    notShow:['熊大','凯平','元坤金融','山城老刁民'],
    //显示后戳为B
    showB:['卧龙'],
    postStamp(item){
        let result = '';
        

        // if(this.notShow.some(_item=>{
        //     return item.user.userProfiles.name == _item;
        // })){
        //     let idx = item.symbol.indexOf('.')
        //     if(idx>0){
        //         result = item.symbol.substr(0,idx)
        //     }
        // }else if(this.showB.some(_item=>{
        //     return item.user.userProfiles.name == _item;
        // })){
        //     let idx = item.symbol.indexOf('.')
        //     if(idx>0){
        //         result = item.symbol.substr(0,idx) + 'b'
        //     }
        // }else {
        //     result = item.symbol
        // }
        let idx = item.symbol.indexOf('.')
        if(idx>0){
            result = item.symbol.substr(0,idx)
        }else{
            result = item.symbol
        }

        return result;
    },
    _postStamp(name,pro){
        let result;
        let idx = pro.indexOf('.')

        // let _notShow = this.notShow.some(_item=>{
        //     return name == _item;
        // })
        // let _showB = this.showB.some(_item=>{
        //     return name == _item;
        // })

        // if(_notShow){
        //     //不显示后戳
        //     if(idx>0){
        //         result = pro.substr(0,idx)
        //     }
        // }else if(_showB){
        //     //显示后戳为b
        //     if(idx>0){
        //         result =  pro.substr(0,idx) + 'b'
        //     }
        // }else {
        //     result =  pro;
        // }

        //不显示后戳
        if(idx>0){
            result = pro.substr(0,idx)
        }else{
            result =  pro;
        }
        return result;       
    },
}