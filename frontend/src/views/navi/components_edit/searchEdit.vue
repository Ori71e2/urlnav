<template>
  <div class="container">
    <rubbish class="rubbish" />
    <searchSiteEdit class="site-transfer" />
  </div>
</template>

<script>
import searchSiteEdit from './_components/searchSiteEdit'
import rubbish from './_components/rubbish'
export default {
  components: {
    searchSiteEdit, rubbish
  },
  data() {
    return {
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  columns: row;
}
.rubbish {
  width: 226px;
  height: 100%;
  flex-shrink: 0;
}
.site-transfer {
  width: 400px;
  height: 100%;
  flex-grow: 1;
  margin-right: 10px;
}
</style>>
