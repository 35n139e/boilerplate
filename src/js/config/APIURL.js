export function APIURL(){
  if(process.env.NODE_ENV === "development"){
    return "stgURL"
  }else{
    return "productionURL"
  }
}
