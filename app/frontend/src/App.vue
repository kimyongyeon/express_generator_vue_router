<template>

  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <el-menu theme="dark" default-active="1" class="el-menu-demo" mode="horizontal">
      <router-link v-bind:to="'/login'"><el-menu-item index="1">login</el-menu-item></router-link>
      <router-link v-bind:to="'/main'"><el-menu-item index="1">main</el-menu-item></router-link>
      <router-link v-bind:to="'/webSocket'"><el-menu-item index="1">websocket-server</el-menu-item></router-link>
      <router-link v-bind:to="'/ajaxServer'"><el-menu-item index="1">ajax-server</el-menu-item></router-link>
      <router-link v-bind:to="'/gameApi'"><el-menu-item index="1">game-api</el-menu-item></router-link>
      <router-link v-bind:to="'/restApi'"><el-menu-item index="1">rest-api</el-menu-item></router-link>
      <router-link v-bind:to="'/memberAuth'"><el-menu-item index="1">member-auth</el-menu-item></router-link>
    </el-menu>
    <router-view></router-view>
    <div class="container" style="margin-top: 25px;">
      <div class="row">
        <legend></legend>
        <p>© Copyright 2017 - 2100. Goldsuninternational. All Rights Reserved. <span class="pull-right"><a href="#">Privacy Policy</a> | <a href="#">Feedback</a> | <a href="#">Report Bugs</a></span></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

