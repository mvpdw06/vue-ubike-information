<template>
  <div id="app">
    <ul>
      <li>
        更新資料倒數計時：{{ currentTimer }}
      </li>
      <li>
        資料排序：{{ sortBy | filterColumnNameFormat }}
      </li>
      <li>
        指定區域：
        <select class="form-select" v-model="selectArea">
          <option>全部</option>
          <option v-for="area in groupStepByArea" :key="area">{{area}}</option>
        </select>
      </li>
      <li>
        輸入搜尋：<input type="text" v-model.trim="searchStep" size="30" placeholder="可用空格來模糊搜尋 ex: '101 信義'" />
      </li>
      <li>
        <input type="checkbox" v-model="onlyGraterThan50Percent" />只顯示車輛充足場站 (車輛比例大於 50%)
      </li>
      <li class="red">
        車輛比例不足 20% 以紅色顯示
      </li>
      <li class="red">
        點擊欄位可以欄位排序
      </li>
      <li class="red">
        點擊開啟 Goolge Map 頁面顯示詳細位置
      </li>
    </ul>
    <table class="table table-striped">
      <thead>
        <tr>
          <th @click="sortByColumn('sno')" >#</th>
          <th @click="sortByColumn('sna')" >場站名稱</th>
          <th @click="sortByColumn('sarea')" >場站區域</th>
          <th @click="sortByColumn('sbi')" >目前可用車輛</th>
          <th @click="sortByColumn('tot')" >總停車格</th>
          <th @click="sortByColumn('mday')" >資料更新時間</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="step in filterResultByPage" 
            :key="step.sno" 
            :class="{ 'red': (step.sbi / step.tot) < 0.2 }"
            @click.prevent="openGoogleMapPage(getGoogleMapUrl(step.lat, step.lng, step.ar))"
            >
          <td>{{ step.sno }}</td>
          <td>{{ step.sna }}</td>
          <td>{{ step.sarea }}</td>
          <td>{{ step.sbi }}</td>
          <td>{{ step.tot }}</td>
          <td>{{ step.mday | timeFormat }}</td>
        </tr>
        <tr v-if="filterResultByPage.length === 0">
          <td style="text-align:center; color: red" colspan="6">查無資料</td>
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
      
      <h3>每頁：{{countOfPage}} 筆，共：{{connectFiltersResult.length}} 筆</h3>
    </div>

  </div>
</template>

<script src="./app.js"></script>