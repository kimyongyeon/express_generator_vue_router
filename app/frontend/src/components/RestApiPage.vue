<template>

  <div>

    <el-row :gutter="10">
      <el-col span="24">
        <h1>Server Rest API</h1>
      </el-col>
    </el-row>

    <div class="btn-right">
      <el-button type="success">등록</el-button>
      <el-button type="warning">수정</el-button>
      <el-button type="danger">삭제</el-button>
    </div>

    <el-row :gutter="10">
      <el-col span="23">

        <el-table :data="tableData">
          <el-table-column
            prop="method"
            label="Method"

          >
          </el-table-column>
          <el-table-column
            prop="description"
            label="Description"

          >
          </el-table-column>
          <el-table-column
            prop="example"
            label="Example"
          >
          </el-table-column>
          <el-table-column
            prop="parameters"
            label="Parameters"
          >
          </el-table-column>
        </el-table>

        <el-row :gutter="10"></el-row>

      </el-col>
    </el-row>

    <el-row></el-row>

    <el-row :gutter="10">
      <el-col span="23">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item title="Consistency" name="1">
            <div>Consistent with real life: in line with the process and logic of real life, and comply with languages
              and habits that the users are used to;
            </div>
            <div>Consistent within interface: all elements should be consistent, such as: design style, icons and texts,
              position of elements, etc.
            </div>
          </el-collapse-item>
          <el-collapse-item title="Feedback" name="2">
            <div>Operation feedback: enable the users to clearly perceive their operations by style updates and
              interactive effects;
            </div>
            <div>Visual feedback: reflect current state by updating or rearranging elements of the page.</div>
          </el-collapse-item>
          <el-collapse-item title="Efficiency" name="3">
            <div>Simplify the process: keep operating process simple and intuitive;</div>
            <div>Definite and clear: enunciate your intentions clearly so that the users can quickly understand and make
              decisions;
            </div>
            <div>Easy to identify: the interface should be straightforward, which helps the users to identify and frees
              them from memorizing and recalling.
            </div>
          </el-collapse-item>
          <el-collapse-item title="Controllability" name="4">
            <div>Decision making: giving advices about operations is acceptable, but do not make decisions for the
              users;
            </div>
            <div>Controlled consequences: users should be granted the freedom to operate, including canceling, aborting
              or terminating current operation.
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-col>
    </el-row>

    <div class="container">
      <div class="row">
        <div class="row">
          <div class="col-xs-12 col-sm-3 col-md-3">
            <a href="#">
              <img src="http://wanderluxe.theluxenomad.com/wp-content/uploads/2014/10/http-www.urchinbali.comgallery.jpg" class="img-responsive img-box img-thumbnail">
            </a>
          </div>
          <div class="col-xs-12 col-sm-9 col-md-9">
            <div class="list-group">
              <div class="list-group-item">
                <div class="row-picture">
                  <a href="#" title="sintret">
                    <img class="circle img-thumbnail img-box" src="http://sintret.com/img/andy.jpg" alt="sintret">
                  </a>
                </div>
                <div class="row-content">
                  <div class="list-group-item-heading">
                    <a href="#" title="sintret">
                      <small>sintret</small>
                    </a>
                  </div>
                  <small>
                    <i class="glyphicon glyphicon-time"></i> 3 days ago via <span class="twitter"> <i class="fa fa-twitter"></i> <a target="_blank" href="https://twitter.com/sintret" alt="sintret" title="sintret">@sintret</a></span>
                    <br>
                    <span class="explore"><i class="glyphicon glyphicon-th"></i> <a href="#">Explore 2 places </a></span>
                  </small>
                </div>
              </div>
            </div>
            <h4><a href="#">5 of Bali’s Spanking New Haunts - WanderLuxe Magazine</a></h4>
            <p>Naturally, we know where Bali's newest restaurants are and what to order, so give that private chef a rest and check out these spanking new haunts.</p>
          </div>
        </div>
        <hr>

        <div class="row">
          <div class="col-xs-12 col-sm-3 col-md-3">
            <a href="#">
              <img src="http://wanderluxe.theluxenomad.com/wp-content/uploads/2014/09/http-barbacoabali.com_.jpg" class="img-responsive img-box img-thumbnail">
            </a>
          </div>
          <div class="col-xs-12 col-sm-9 col-md-9">
            <div class="list-group">
              <div class="list-group-item">
                <div class="row-picture">
                  <a href="#" title="sintret">
                    <img class="circle img-thumbnail img-box" src="http://sintret.com/img/andy.jpg" alt="sintret">
                  </a>
                </div>
                <div class="row-content">
                  <div class="list-group-item-heading">
                    <a href="#" title="sintret">
                      <small>sintret</small>
                    </a>
                  </div>
                  <small>
                    <i class="glyphicon glyphicon-time"></i> 1 month ago via <span class="twitter"> <i class="fa fa-twitter"></i> <a target="_blank" href="https://twitter.com/sintret" alt="sintret" title="sintret">@sintret</a></span>
                    <br>
                    <span class="explore"><i class="glyphicon glyphicon-th"></i> <a href="#">Explore 9 places </a></span>
                  </small>
                </div>
              </div>
            </div>
            <h4><a href="#">Top 8 Best Bali Restaurants - WanderLuxe Magazine</a></h4>
            <p>We know that there’s tons to noms in Bali, but what’s the best and where are they? Here are our top 8 Seminyak Bali restaurants to visit.</p>
          </div>
        </div>
        <hr>


        <div class="row">
          <div class="col-xs-12 col-sm-3 col-md-3">
            <a href="#">
              <img src="http://i.huffpost.com/gen/2038950/thumbs/s-BANGKOK-NOODLES-large.jpg" class="img-responsive img-box img-thumbnail">
            </a>
          </div>
          <div class="col-xs-12 col-sm-9 col-md-9">
            <div class="list-group">
              <div class="list-group-item">
                <div class="row-picture">
                  <a href="#" title="sintret">
                    <img class="circle img-thumbnail img-box" src="http://sintret.com/img/andy.jpg" alt="sintret">
                  </a>
                </div>
                <div class="row-content">
                  <div class="list-group-item-heading">
                    <a href="#" title="sintret">
                      <small>sintret</small>
                    </a>
                  </div>
                  <small>
                    <i class="glyphicon glyphicon-time"></i> 1 month ago via <span class="twitter"> <i class="fa fa-twitter"></i> <a target="_blank" href="https://twitter.com/sintret" alt="sintret" title="sintret">@sintret</a></span>
                    <br>
                    <span class="explore"><i class="glyphicon glyphicon-th"></i> <a href="#">Explore 9 places </a></span>
                  </small>
                </div>
              </div>
            </div>
            <h4><a href="#">These Are The Best Noodle Spots In Bangkok</a></h4>
            <p>BANGKOK (AP) — With its fluorescent bulbs and cafeteria-style tables, the Bangkok restaurant Raan Jay Fai wouldn't win any awards for interior decorating.              But that hasn't deterred Martha Stewart, one of the restaurant's many fans...</p>
          </div>
        </div>
        <hr>
      </div>
    </div>


  </div>

</template>

<script>

  //  var fnTimeValue
  export default {
    htmlText: 'get: url 호출방식 </br> 누구나',
    data () {
      return {
        value1: true,
        tableData: [
          {
            method: 'fnGameReg',
            example: '/game_reg?current_time=1&character=2',
            description: '/game_reg',
            parameters: '시간, 케릭터개수'
          },
          {
            method: 'fnGameEdit',
            example: '/game_edit?game_code=1&current_time=1&character=2',
            description: '/game_edit',
            parameters: '게임코드, 시간, 케릭터개수 '
          },
          {
            method: 'fnGameDelete',
            example: '/game_delete?game_code=1',
            description: '/game_delete',
            parameters: '게임코드, 사유'
          }
        ]
      }
    },
    methods: {}
  }
</script>

<style>
  .btn-right {
    float: right;
    margin-right: 50px;
    padding: 10px;
  }

  .el-row {
    margin-bottom: 5px;
  }

  .el-col {
    border-radius: 4px;
    margin-right: 50px;
    margin-left: 15px;
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


</style>
