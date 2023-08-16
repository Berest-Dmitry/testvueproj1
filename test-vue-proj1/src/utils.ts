import moment from 'moment'

export default{
    convertToDate: function(value: any){
        if(value){
            return moment(String(value)).format('YYYY.MM.DD')
        }
    },
    convertToDateAndTime: function(value: any){
        if(value){
            return moment(String(value)).format('YYYY.MM.DD hh:mm')
        }
    }
}