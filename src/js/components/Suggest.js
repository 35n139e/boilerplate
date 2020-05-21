import Vue from 'vue'
import store from '../store.js'
import {APIURL} from '../config/APIURL.js'

import axios from 'axios'
import _ from 'lodash'


export default Vue.component('suggest', {
  template: `

  <div class="js-suggest page-matrix-index--controller__search__body" v-cloak>
    <input type="text" @focus="focusInputSearchText" v-model="inputSearchText" class="js-suggest--input page-matrix-index--controller__search__input" name="" placeholder="入力" />
    <div class="js-suggest--loader" v-if="loadingList">
      <div class="js-suggest--loader__message">検索中…</div>
    </div>
    <transition name="js-suggest--lists" @before-enter="beforeEnter" @enter="enter" @before-leave="beforeLeave" @leave="leave">
      <ul v-if="openlist" class="js-suggest--lists">
        <li v-for="(item, index) in items" :key="index" :data-index="index">
          <button type="button" class="js-suggest--button" @click="setSearchText(item)">
            <span>{{item}}</span>
          </button>
        </li>
        <li v-if="noData"><div class="js-suggest--lists__nodata">該当する入力が見つかりませんでした</div></li>
      </ul>
    </transition>
    <button type="button" class="js-suggest--submit" @click="postSartGetMatrix(inputSearchText)" :disabled="!setSearchTextFlag">実行</button>
    <div class="js-suggest--bg" @click="openlist = false" v-if="openlist"></div>
  </div>
  `,
  data() {
    return {
      val:"",
      items: [],
      inputSearchText:"",
      cancelSource: null,
      url:{
        getToken: "",
        getMatrix: "",
        startGetMatrix: "",
        getSuggestList: "",
      },
      loadingList:false,
      openlist: false,
      setSearchTextFlag: false,
      noData:false,
      jobID:"",
      store:store,
    }
  },

  created() {
    // this.postSartGetMatrix(store.data.companyName)
  },

  methods:{
    beforeEnter: function(el) {
      el.style.height = '0';
      console.log(el)
    },
    enter: function(el) {
      el.style.height = el.scrollHeight + 'px';
    },
    beforeLeave: function(el) {
      el.style.height = el.scrollHeight + 'px';
    },
    leave: function(el) {
      el.style.height = '0';
    },


    focusInputSearchText:function() {
      if(this.items.length > 0 && this.inputSearchText != ""){
        this.openlist = true;
      }
    },
    cancelSearch: function(){
      console.log("cancelSearch")
      if(this.cancelSource){
        this.cancelSource.cancel("start new search, stop active search");
      }
    },


    setSearchUrl: function(){
      axios.get(this.url.getToken, {
        withCredentials: true
      })
      .then(response => {
        store.setAuthToken(response.data.token);
        this.getSuggest();
      }).catch(error => {
        console.log(error)
        this.loadingList = false;
        this.responseError(error.response.status);
      });
    },

    getSuggest: function() {
      if(this.minRequiredText){
        this.cancelSearch();
        this.cancelSource = axios.CancelToken.source();
        console.log("getSuggest function")
        this.loadingList = true;
        axios.get(this.url.getSuggestList + this.inputSearchText,{
          cancelToken: this.cancelSource.token,
          headers:{
            'Authorization': "bearer " + this.store.auth.token
          }
        })
        .then(response => {
          this.loadingList = false;
          this.openlist = true;
          this.noData = false;
          console.log("length ----" + response.data.suggest.length)
          if(response.data.suggest.length > 0){
            for (var i = 0; i < response.data.suggest.length; i++) {
              this.items = response.data.suggest;
              console.log(this.items)
            }
          }else{
            this.items = [];
            this.noData = true;
          }
        }).catch(error => {
          console.log("catch error in getSuggest --" + error)
          if(axios.isCancel(error)){
            console.log("setSearchUrl canceled")
          }
          // if(error.response.status === 401){
          //   console.log("Auth 期限切れ")
          //   this.setSearchUrl();
          // }
          console.log("error -- setSearchUrl");
          this.openlist = false;
        });
      }else{
        this.openlist = false;
      }
    },




    postSartGetMatrix: function(val){
      console.log("postSartGetMarket ;;" + val)
      this.inputSearchText = "";
      this.setSearchTextFlag = false;
      axios.get(this.url.getToken, {
        withCredentials: true
      })
      .then(response => {
        store.setAuthToken(response.data.token);
        console.log("GET Token postSartGetMatrix --- > " + this.store.auth.token)
        this.getJobId(val);
      }).catch(error => {
        console.log("postSartGetMatrix ERROR --->" + error)
        // this.responseError(error.response.status);
      });
    },


    getJobId: function(val){
      axios.post(this.url.startGetMatrix, {
        companyName : val
        },{
          headers: {
            'Authorization': "bearer " + this.store.auth.token,
            'Content-Type': 'application/json'
          }
        })
      .then(response => {
        this.jobID = response.data.jobId;
        this.getMatrix();
        store.setcompanyName(val);
        console.log("postSartGetMarket --" + this.jobID)
        console.log("jobID-->" + response.data.jobId);
      }).catch(error => {
        console.log("error");
        this.responseError(error.response.status);
      });
    },

    getMatrix: function(){
      axios.get(this.url.getMatrix +  this.jobID ,{
        headers : {
          'Authorization': "bearer " + this.store.auth.token
        }
      })
      .then(response => {
        console.log("ステータスコード" + response.status)
        store.setPreivew(false);
        store.setLoading(true);
        if(response.status === 202){
          setTimeout(() => {
            console.log("timeout")
            return this.getMatrix();
          }, 1000);
        }else{
          console.log("ELSEステータスコード" + response.status);
          store.setLoading(false);
          if(response.data.data.length === 0){
            store.state.error = {
              flag:true,
              title:store.data.companyName,
              text:"作成できませんでした。"
            }
          }else{
            
            this.$emit('send-data', response.data);
          }
        }
      }).catch(error => {
        console.log(error.response.status)
        console.log(error +  " ---- error -- getMarket");
        this.responseError(error.response.status);
      });
    },
    setSearchText: function(string){
      this.setSearchTextFlag = true;
      this.buttonSearchText = string;
      if(string === this.inputSearchText){
        this.openlist = false; 
      }else{
        this.inputSearchText = string;
        console.log("setSearchText -- else")
      }
      this.openlist = false;
    },
    responseError: function(error, func){
      if(error === 401){
        location.reload();
      }else if(error === 500){
        location.reload();
      }else if(error === 502){
        store.state.error = {
          flag:true,
          title:"エラー",
          text:"現在障害が発生しております。<br>申し訳ありませんが、復旧までしばらくお待ちください。"
        }
      }
    }
  },
  computed:{
    minRequiredText: function(){
      console.log("minRequiredText")
      console.log(this.inputSearchText.length)
      if(this.inputSearchText.length > 1){
        return true;
      }
      else{
        return false;
      }
    }
  },
  watch:{
    inputSearchText: _.debounce(function (e) {
      console.log("input text ---> " + e)
      if(this.buttonSearchText != this.inputSearchText){
        this.items= [];
        this.setSearchTextFlag = false;
        this.openlist = false;
      }else if(this.buttonSearchText === this.inputSearchText){
        this.setSearchTextFlag = true;
      }
      if(this.minRequiredText){
        if(this.buttonSearchText != this.inputSearchText){
          this.setSearchTextFlag = false;
          console.log("入力とボタン出力テキストが違う場合")
          if(this.loadingList){
            console.log("入力とボタン出力テキストが違う場合 + 今検索してるのをやめる")
            this.loadingList = false;
            // source.cancel();
          }else{
            console.log("今は何も検索してないので検索する")
            this.setSearchUrl();
          }
        }else{
          this.openlist = false;
        }
      }else{
        console.log("今検索してるのをやめる")
        this.loadingList = false;
        // source.cancel();
      }
    }, 500),
  }
})