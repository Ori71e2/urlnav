<template>
  <div class="footerBox">
    <a href="https://nnecho.com/" title="nnecho" target="_blank" class="links">© 2021 nnecho</a>
    <span> 丨 </span>
    <a href="https://beian.miit.gov.cn" title="工业和信息化部域名信息备案管理系统" target="_blank" class="links">苏ICP备2020068888号-1</a>
    <span> 丨 </span>
    <!-- <a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=" title="全国互联网安全管理服务平台" target="_blank" class="links"></a>
    <span> 丨 </span> -->
    <a title="关于「nnecho」" class="links">关于</a>
  </div>
</template>

<script>
export default {
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
.footerBox {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 6px;
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(10px);
}
.links {
  text-decoration: none;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  transition: .25s;
}
</style>>
