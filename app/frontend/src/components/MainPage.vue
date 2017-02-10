<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="hello">

    <div class="container" id="tourpackages-carousel">

      <p></p>

      <div class="jumbotron">
        <h1>골드썬인터네셔널 연구소</h1>
        <p>삼각지역에서 출발한 한국 글로벌 게임 연구소 게임 목록 입니다. 상용중인 게임과 비상용중인 게임이 함께 링크되어 있습니다.</p>
        <p><a class="btn btn-primary btn-lg" href="#" role="button">더보기</a></p>
      </div>

      <p></p>

      <div class="row">
        <div class="col-lg-12">
          <h1>게임 목록
            <a class="btn icon-btn btn-primary pull-right" v-on:click="fnGameAdd">
              <span class="glyphicon btn-glyphicon glyphicon-plus img-circle"></span> Add New Game</a>
          </h1>
        </div>

        <div class="col-lg-12" id="gameAdd" v-show="gameAddFlag">
          <form class="form-horizontal">
            <div class="form-group">
              <label for="inputEmail" class="control-label col-xs-2">game title</label>
              <div class="col-xs-5">
                <input type="text" class="form-control" id="gameTitle" placeholder="원숭이 레이싱">
              </div>
            </div>
            <div class="form-group">
              <label for="inputPassword" class="control-label col-xs-2">game code</label>
              <div class="col-xs-5">
                <input type="text" class="form-control" id="inputGameCode" placeholder="1234-1234-1234-1234">
              </div>
            </div>
            <div class="form-group">
              <label for="inputEmail" class="control-label col-xs-2">public date</label>
              <div class="col-xs-5">
                <input type="date" class="form-control" id="inputDate" placeholder="2017-03-01">
              </div>
            </div>
            <div class="form-group">
              <div class="col-xs-offset-2 col-xs-10">
                <button type="submit" class="btn btn-primary" v-on:click="fnSave">Save</button>
                <button type="submit" class="btn btn-primary" v-on:click="fnCancel">Cacel</button>
              </div>
            </div>
          </form>
        </div>

        <div class="col-xs-12 col-sm-4 col-md-4 col-lg-4" v-for="item in items" v-if="items.length">
          <div class="thumbnail">
            <div class="caption">
              <div class='col-lg-12'>
                <span class="glyphicon glyphicon-credit-card"></span>
                <span v-on:click="fnGameRemove(item)" class="glyphicon glyphicon-trash pull-right text-primary"></span>
              </div>
              <div class='col-lg-12 well well-add-card'>
                <h4>{{item.title}}</h4>
              </div>
              <div class='col-lg-12'>
                <p>code : {{item.code}}</p>
                <p class="text-muted">Exp: {{item.exp}}</p>
              </div>
              <button type="button" class="btn btn-primary btn-xs btn-update btn-add-card">Launch</button>
              <!--<span class='glyphicon glyphicon-exclamation-sign text-danger pull-right icon-style'></span>-->
            </div>
          </div>
        </div>
        <p v-else>No items found.</p>

        <div class="col-lg-12" id="view-delete-cards"><a href="#">View Deleted Cards</a></div>

      </div><!-- End row -->
    </div><!-- End container -->

    <br>

    <!--<div id="div-test"-->
      <!--v-touch:tap="test($event)"-->
      <!--v-touch:pan="test"-->
      <!--v-touch-options:pan="{ direction: 'up', threshold: 100 }"-->
      <!--v-touch:press="test"-->
      <!--v-touch:swipe="test"-->
      <!--v-touch-options:swipe="{ direction: 'horizontal' }"-->
      <!--v-touch:pinch="test"-->
      <!--v-touch:rotate="test"-->
      <!--v-touch:doubletap="test"-->
      <!--v-text="event">-->
    <!--</div>-->

  </div>

</template>

<script>

  export default {
    name: 'hello',
    data () {
      return {
        msg: 'Client Game Api List',
        event: '',
        items: [
          {
            seq: 1,
            title: '원숭이 레이싱',
            code: this.fnGuid(),
            exp: '2017-02-28'
          },
          {
            seq: 2,
            title: '사무라이 레이싱',
            code: this.fnGuid(),
            exp: '2017-06-30'
          }
        ],
        gameAddFlag: false
      }
    },
    methods: {
      test: function (e) {
        this.event = e.type
      },
      fnSave: function () {
        console.log(JSON.stringify(this.items))
        var item = {}
        item.seq = this.items.length + 1
        item.title = '새로운 게임 > ' + item.seq
        item.code = this.fnGuid()
        item.exp = new Date()
        this.items.push(item)
      },
      fnCancel: function () {
        this.gameAddFlag = false
      },
      fnGameAdd: function () {
        this.gameAddFlag = true
      },
      fnGameRemove: function (seq) {
        var index = this.items.indexOf(seq)
        this.items.splice(index, 1)
      },
      fnGuid: function () {
        return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
          this.s4() + '-' + this.s4() + this.s4() + this.s4()
      },
      s4: function () {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #view-delete-cards {
    z-index: -1;
  }
  .navbar-static-top {
    margin-bottom:20px;
  }

  i {
    font-size:18px;
  }

  footer {
    margin-top:20px;
    padding-top:20px;
    padding-bottom:20px;
    background-color:#efefef;
  }

  .nav>li .count {
    position: absolute;
    top: 10%;
    right: 25%;
    font-size: 10px;
    font-weight: normal;
    background: rgba(41,200,41,0.75);
    color: rgb(255,255,255);
    line-height: 1em;
    padding: 2px 4px;
    -webkit-border-radius: 10px;
    -moz-border-radius: 10px;
    -ms-border-radius: 10px;
    -o-border-radius: 10px;
    border-radius: 10px;
  }

  body{margin:40px;}

  .stepwizard-step p {
    margin-top: 10px;
  }

  .process-row {
    display: table-row;
  }

  .process {
    display: table;
    width: 100%;
    position: relative;
  }

  .process-step button[disabled] {
    opacity: 1 !important;
    filter: alpha(opacity=100) !important;
  }

  .process-row:before {
    top: 50px;
    bottom: 0;
    position: absolute;
    content: " ";
    width: 100%;
    height: 1px;
    background-color: #ccc;
    z-order: 0;

  }

  .process-step {
    display: table-cell;
    text-align: center;
    position: relative;
  }

  .process-step p {
    margin-top:10px;

  }

  .btn-circle {
    width: 100px;
    height: 100px;
    text-align: center;
    padding: 6px 0;
    font-size: 12px;
    line-height: 1.428571429;
    border-radius: 15px;
  }

</style>
