class Utils{
  static dateFormat(date){
        //isso é um metodo estático, que não tem a necessidade de ser estanciado.
        return date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear()+' '+date.getHours()+':'+date.getMinutes();
    }
}