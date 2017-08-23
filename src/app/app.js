import axios from 'axios'

export default {
  data() {
    return {
      ubikeStops: [],
      searchStep: '',
      selectArea: '全部',
      sortBy: 'sno',
      onlyGraterThan50Percent: false,
      timerInstance: 0,
      currentTimer: 30,
      getDataUrl:
        'https://tcgbusfs.blob.core.windows.net/blobyoubike/YouBikeTP.gz',
      countOfPage: 25,
      currPage: 1
    }
  },
  computed: {
    totalPage() {
      return Math.ceil(this.connectFiltersResult.length / this.countOfPage)
    },
    pageStart() {
      return (this.currPage - 1) * this.countOfPage
    },
    groupStepByArea() {
      let result = []
      this.ubikeStops.map(step => {
        if (result.indexOf(step.sarea) === -1) {
          result.push(step.sarea)
        }
      })

      return result
    },
    connectFiltersResult() {
      const filters = [
        this.filterByArea,
        this.filterByGraterThan50Percent,
        this.filteredStepsByName
      ]

      return this.compose(...filters)(this.ubikeStops)
    },
    filterResultByPage() {
      return this.filteredStepsByPage(this.connectFiltersResult)
    }
  },
  methods: {
    setTimer: function() {
      this.timerInstance = setInterval(() => {
        if (this.currentTimer === 0) {
          // reset timer and get data.
          this.getData(this.getDataUrl)
          this.currentTimer = 30
        } else {
          // run timer
          this.currentTimer--
        }
      }, 1000)
    },
    getData: async function(url) {
      const response = await axios.get(this.getDataUrl)
      this.ubikeStops = Object.keys(response.data.retVal).map(
        key => response.data.retVal[key]
      )
    },
    setPage: function(page) {
      if (page <= 0 || page > this.totalPage) {
        return
      }
      this.currPage = page
    },
    filterByArea: function(data) {
      if (this.selectArea !== '全部') {
        return data.filter(step => {
          return step.sarea === this.selectArea
        })
      }
      return data
    },
    filterByGraterThan50Percent: function(data) {
      if (this.onlyGraterThan50Percent) {
        return data.filter(step => {
          return step.sbi / step.tot > 0.5
        })
      }
      return data
    },
    filteredStepsByName: function(data) {
      if (this.searchStep) {
        const multiCondition = this.searchStep.split(' ')

        return data.filter(step => {
          let result =
            multiCondition.findIndex((condition, index) => {
              return index === 0
                ? step.sna.indexOf(condition) > -1
                : step.sna.indexOf(condition) > -1 &&
                  step.sarea.indexOf(condition) > -1
            }) > -1
          return result
        })
      }
      return data
    },
    filteredStepsByPage: function(data) {
      if (this.searchStep) {
        return data
      }
      return data.slice(this.pageStart, this.pageStart + this.countOfPage)
    },
    compose: function(...funcs) {
      if (funcs.length === 0) {
        return arg => arg
      }

      if (funcs.length === 1) {
        return funcs[0]
      }

      return funcs.reduce((a, b) => (...args) => a(b(...args)))
    },
    openGoogleMapPage: function(url) {
      window.open(url)
    },
    getGoogleMapUrl: function(lat, lng, ar) {
      return `https://maps.google.com/maps?q=${lat},${lng}(${ar})&z=1&hl=zh-TW`
    },
    sortByColumn: function(column) {
      if (this.sortBy === column) {
        this.ubikeStops.reverse()
      } else {
        this.sortBy = column
        this.ubikeStops = this.ubikeStops.sort((prevItem, nextItem) => {
          return prevItem[column] > nextItem[column] ? 1 : -1
        })
      }
    }
  },
  filters: {
    timeFormat(t) {
      let date = [],
        time = []

      date.push(t.substr(0, 4))
      date.push(t.substr(4, 2))
      date.push(t.substr(6, 2))
      time.push(t.substr(8, 2))
      time.push(t.substr(10, 2))
      time.push(t.substr(12, 2))

      return `${date.join('/')} ${time.join(':')}`
    },
    filterColumnNameFormat(column) {
      switch (column) {
        case 'sno':
          return '編號'
        case 'sna':
          return '場站名稱'
        case 'sarea':
          return '場站區域'
        case 'sbi':
          return '目前可用車輛'
        case 'tot':
          return '總停車格'
        case 'mday':
          return '資料更新時間'
        default:
          return ''
      }
    }
  },
  created() {
    // 欄位說明請參照:
    // http://data.taipei/opendata/datalist/datasetMeta?oid=8ef1626a-892a-4218-8344-f7ac46e1aa48

    // sno：站點代號、 sna：場站名稱(中文)、 tot：場站總停車格、
    // sbi：場站目前車輛數量、 sarea：場站區域(中文)、 mday：資料更新時間、
    // lat：緯度、 lng：經度、 ar：地(中文)、 sareaen：場站區域(英文)、
    // snaen：場站名稱(英文)、 aren：地址(英文)、 bemp：空位數量、 act：全站禁用狀態
    this.getData(this.getDataUrl)
    this.setTimer()
  }
}
