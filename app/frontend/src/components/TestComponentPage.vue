<template>

  <div>

    <h1>Rest API</h1>

    <el-row>
      <el-col :span="24">
        <i class="el-icon-edit"></i>
        <i class="el-icon-share"></i>
        <i class="el-icon-delete"></i>
        <el-button type="primary" icon="search">Search</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-upload
          action="//jsonplaceholder.typicode.com/posts/"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :default-file-list="fileList">
          <el-button size="small" type="primary">Click to upload</el-button>
          <div class="el-upload__tip" slot="tip">jpg/png files with a size less than 500kb</div>
        </el-upload>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-select v-model="value" placeholder="Select">
          <el-option
            v-for="item in options"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <span class="demonstration">Default</span>
        <el-rate v-model="starValue1"></el-rate>
        <span class="demonstration">Color for different levels</span>
        <el-rate
          v-model="starValue2"
          :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
        </el-rate>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-switch
          v-model="value1"
          on-text=""
          off-text="">
        </el-switch>
        <el-switch
          v-model="value2"
          on-color="#13ce66"
          off-color="#ff4949">
        </el-switch>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-button type="text" @click="open">Click to open the Message Box</el-button>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">
        <el-badge :value="12" class="item">
          <el-button size="small">comments</el-button>
        </el-badge>
        <el-badge :value="3" class="item">
          <el-button size="small">replies</el-button>
        </el-badge>

      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24">

        <el-progress type="circle" :percentage="perCent"></el-progress>
        <el-button type="text" @click="fnTimerStart">start </el-button>
        <el-button type="text" @click="fnTimerStop">stop </el-button>
        <el-progress type="circle" :percentage="25"></el-progress>
        <el-progress type="circle" :percentage="100" status="success"></el-progress>
        <el-progress type="circle" :percentage="50" status="exception"></el-progress>

      </el-col>
    </el-row>

    <el-row>
      <el-col :span="8" v-for="(o, index) in 2" :offset="index > 0 ? 2 : 0">
        <el-card :body-style="{ padding: '0px' }">
          <img src="http://placehold.it/350x150" class="image">
          <div style="padding: 14px;">
            <span>Yummy hamburger</span>
            <div class="bottom clearfix">
              <time class="time">{{ currentDate }}</time>
              <el-button type="text" class="button">Operating button</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="8" v-for="(o, index) in 2" :offset="index > 0 ? 2 : 0">
        <el-card :body-style="{ padding: '0px' }">
          <img src="http://placehold.it/350x150" class="image">
          <div style="padding: 14px;">
            <span>Yummy hamburger</span>
            <div class="bottom clearfix">
              <time class="time">{{ currentDate }}</time>
              <el-button type="text" class="button">Operating button</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>


  </div>

</template>

<script>

//  var fnTimeValue
  export default {
    fnTimeValue: null,
    data () {
      return {
        value1: true,
        value2: true,
        options: [{
          value: 'Option1',
          label: 'Option1'
        }, {
          value: 'Option2',
          label: 'Option2'
        }, {
          value: 'Option3',
          label: 'Option3'
        }, {
          value: 'Option4',
          label: 'Option4'
        }, {
          value: 'Option5',
          label: 'Option5'
        }],
        value: '',
        starValue1: null,
        starValue2: null,
        fileList: this.fileList,
        perCent: 0,
        currentDate: new Date()
      }
    },
    methods: {
      myValueButton: function () {
        (this.perCent < 100) ? this.perCent += 10 : this.perCent = 0
      },
      fnTimerStop: function () {
        clearInterval(this.fnTimeValue)
      },
      fnTimerStart: function () {
        this.fnTimeValue = setInterval(this.myValueButton, 500)
      },
      handleRemove: function (file, fileList) {
        console.log(file, fileList)
      },
      handlePreview: function (file) {
        console.log(file)
      },
      open: function () {
        this.$alert('This is a message', 'Title', {
          confirmButtonText: 'OK',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${action}`
            })
          }
        })
      }
    }
  }
</script>

<style>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .item {
    margin-top: 10px;
    margin-right: 40px;
  }

  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
