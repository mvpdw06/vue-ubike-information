<template>
  <div id="app">
    <ul>
      <li>
        更新資料倒數計時：{{ currentTimer }}
      </li>
      <li>
        區域過濾：
        <select class="form-select" v-model="selectArea">
          <option>全部</option>
          <option v-for="area in groupStepByArea" :key="area">{{area}}</option>
        </select>
      </li>
      <li>
        搜尋場站名稱：<input type="text" v-model.trim="searchStep" />
      </li>
      <li>
        <input type="checkbox" v-model="onlyGraterThan50Percent" />只顯示車輛充足場站 (車輛比例大於 50%)
      </li>
      <li class="red">
        車輛比例不足 20% 以紅色顯示
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
        <tr v-for="step in filterResultByPage" :key="step.sno" :class="{ 'red': (step.sbi / step.tot) < 0.2 }">
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

<script src="./app.js"></script>