<template>
  <div class="hello">

    <el-row :gutter="10">
      <el-col span="16">
        <h1>Web Socket</h1>
      </el-col>
    </el-row>

    <el-row :gutter="10">
      <el-col span="16">
        <el-table
          :data="tableData"
          style="width: 100%">
          <el-table-column
            prop="method"
            label="Method"
            width="180">
          </el-table-column>
          <el-table-column
            prop="description"
            label="Description">
          </el-table-column>
          <el-table-column
            prop="parameters"
            label="Parameters">
          </el-table-column>
        </el-table>

        <el-row :gutter="10"></el-row>

      </el-col>
    </el-row>

  </div>

</template>

<script>
export default {
  name: 'hello',
  data () {
    return {
      msg: 'Client Game Api List'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
