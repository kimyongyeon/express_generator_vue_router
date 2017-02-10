<template>
  <div>
    <h1>상세 내용</h1>

    <div class="block">
      <span class="demonstration">Switch when indicator is hovered (default)</span>
      <el-carousel height="150px">
        <el-carousel-item v-for="item in 4">
          <h3>{{ item }}</h3>
        </el-carousel-item>
      </el-carousel>
    </div>

    <el-input placeholder="Please input" v-model="input"></el-input>

    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="date"
        label="Date"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="Name"
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="Address">
      </el-table-column>
    </el-table>

    <div class="block">
      <div class="line"></div>
      <span class="demonstration">When you have few pages</span>
      <div class="line"></div>
      <el-pagination
        layout="prev, pager, next"
        :total="50">
      </el-pagination>
    </div>

  </div>
</template>

<script>
export default {
  created: function () {
    var id = this.$route.params.id
    this.$http.get(`/api/movies/${id}`)
    .then((response) => {
      this.movie = response.data
    })
  },
  data: function () {
    return {
      movie: {},
      input: 'hello world',
      tableData: [{
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      }, {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      }, {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      }, {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles'
      }]
    }
  }
}
</script>

<style scoped>
  .el-input {
    margin-bottom: 10px;
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
</style>
