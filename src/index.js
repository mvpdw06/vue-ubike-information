import Vue from 'vue'
import axios from 'axios'

import styles from './index.css';

var vm = new Vue({
  el: '#app',
  data: {
    ubikeStops: [],
    searchStep: '',
    countOfPage: 25,  // 每一頁有幾筆
    currPage: 1,      // 目前所在頁數
  },
  computed: {
    totalPage () {
      // 計算總頁數，無條件進位
      return Math.ceil(this.ubikeStops.length / this.countOfPage);
    },
    pageStart () {
      // 計算目前頁數的起始索引
      return (this.currPage - 1) * this.countOfPage;
    },
    filteredStepsByName () {
      return this.ubikeStops.filter((step) => {
        return step.sna.indexOf(this.searchStep) > -1; 
      })
    },
    filteredStepsByPage () {
      if (this.searchStep) {
        return this.filteredStepsByName;
      }
      return this.ubikeStops.slice(this.pageStart, this.pageStart + this.countOfPage)
    }
  },
  methods: {
    getData: async function(url) {
      const response = await axios.get('https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.gz');
      this.ubikeStops = Object.keys(response.data.retVal).map((key) => response.data.retVal[key]);
    },
    setPage (page) {
      // 指定目前頁數
      if (page <= 0 || page > this.totalPage) { return; }
      this.currPage = page;
    }
  },
  filters: {
    timeFormat(t) {
      var date = [],
        time = []

      date.push(t.substr(0, 4))
      date.push(t.substr(4, 2))
      date.push(t.substr(6, 2))
      time.push(t.substr(8, 2))
      time.push(t.substr(10, 2))
      time.push(t.substr(12, 2))

      return date.join('/') + ' ' + time.join(':')
    }
  },
  created() {
    // 欄位說明請參照:
    // http://data.taipei/opendata/datalist/datasetMeta?oid=8ef1626a-892a-4218-8344-f7ac46e1aa48

    // sno：站點代號、 sna：場站名稱(中文)、 tot：場站總停車格、
    // sbi：場站目前車輛數量、 sarea：場站區域(中文)、 mday：資料更新時間、
    // lat：緯度、 lng：經度、 ar：地(中文)、 sareaen：場站區域(英文)、
    // snaen：場站名稱(英文)、 aren：地址(英文)、 bemp：空位數量、 act：全站禁用狀態
    this.getData('https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.gz')
  }
})
