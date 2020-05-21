const store = {
  baseURL:"/api",
  auth:{
    token:'',
  },
  data:{
    companyName: '',
    marketResults: '',
    marketScore: {},
  },
  state: {
    matrixResults: '',
    isLoading: false,
    isPreview:true,
    isModalOpen: false,
    error:{
      flag: false,
      title: "",
      text:"",
    },  
  },
  setcompanyName (data) {
    this.data.companyName = data;
  },
  setAuthToken (data) {
    this.auth.token = data;
  },
  setMarketResults (data) {
    this.data.marketResults = data;
  },

  setMatrixResults (data) {
    this.state.matrixResults = data;
  },
  clearMatrixResults (msg) {
    this.state.matrixResults = "";
  },
  setPreivew(flag){
    this.state.isPreview = flag;
  },
  setLoading(flag){
    this.state.isLoading = flag;
  },
  setModalOpen(flag){
    this.state.isModalOpen = flag;
  }
};
export default store