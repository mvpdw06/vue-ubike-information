<template>
  <div id="app">
    <ul>
      <li>
        更新資料倒數計時：{{currentTimer}}
      </li>
      <li>
        搜尋場站名稱：<input type="text" v-model.trim="searchStep" />
      </li>
      <li>
        <input type="checkbox" v-model="onlyGraterThan50Percent" />只顯示車輛充足場站
      </li>
    </ul>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>#</th>
          <th>場站名稱</th>
          <th>場站區域</th>
          <th>目前可用車輛</th>
          <th>總停車格</th>
          <th>資料更新時間</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="step in filteredStepsByPage" :key="step.sno">
          <td>{{ step.sno }}</td>
          <td>{{ step.sna }}</td>
          <td>{{ step.sarea }}</td>
          <td>{{ step.sbi }}</td>
          <td>{{ step.tot }}</td>
          <td>{{ step.mday | timeFormat }}</td>
        </tr>
      </tbody>

    </table>

    <!--Pager -->
    <div v-if="!searchStep">
      <ul class="pagination">
        <li :class="{'disabled': (currPage === 1)}" @click.prevent="setPage(currPage-1)">
          <a href="#">&laquo; Prev</a>
        </li>

        <li v-for="n in totalPage" :class="{'active': (currPage === (n))}" @click.prevent="setPage(n)" :key="n">
          <a href="#">{{n}}</a>
        </li>

        <li :class="{'disabled': (currPage === totalPage)}" @click.prevent="setPage(currPage+1)">
          <a href="#">Next</a>
        </li>
      </ul>
      <h3 v-once>分頁：{{countOfPage}} 筆</h3>
    </div>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      ubikeStops: [],
      searchStep: '',
      onlyGraterThan50Percent: false,
      timerInstance: 0,
      currentTimer: 30,
      getDataUrl: 'https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.gz',
      countOfPage: 25,
      currPage: 1,
    }
  },
  computed: {
    totalPage() {
      return Math.ceil(this.ubikeStops.length / this.countOfPage);
    },
    pageStart() {
      return (this.currPage - 1) * this.countOfPage;
    },
    filterByGraterThan50Percent() {
      if (this.onlyGraterThan50Percent) {
        return this.ubikeStops.filter((step) => {
          return (step.sbi / step.tot) > 0.5
        })
      }

      return this.ubikeStops;
    },
    filteredStepsByName() {
      return this.filterByGraterThan50Percent.filter((step) => {
        return step.sna.indexOf(this.searchStep) > -1;
      })
    },
    filteredStepsByPage() {
      if (this.searchStep) {
        return this.filteredStepsByName;
      }
      return this.filterByGraterThan50Percent.slice(this.pageStart, this.pageStart + this.countOfPage)
    }
  },
  methods: {
    setTimer: function() {
      this.timerInstance = setInterval(() => {
        if (this.currentTimer === 0) {
          // reset timer and get data.
          this.getData(this.getDataUrl);
          this.currentTimer = 30;
        }
        else {
          // run timer
          this.currentTimer--;
        }
      }, 1000)
    },
    getData: async function(url) {
      const response = await axios.get(this.getDataUrl);
      this.ubikeStops = Object.keys(response.data.retVal).map((key) => response.data.retVal[key]);
      console.log('get data successfully!')
    },
    setPage(page) {
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
    this.getData(this.getDataUrl);
    this.setTimer();
  }
}
</script>