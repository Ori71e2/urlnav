<template>
  <div id="app">
    <keep-alive>
      <router-view />
    </keep-alive>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
#app {
  min-width: 400px!important;
  height: 100%;
  overflow-x: auto;
}
@import 'styles/index';
</style>
