<template>
  <div class="container" @mouseover.capture="mouseover" @mouseout.capture="mouseout">
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div v-show="show" class="hm"><span>{{ hmStr }}</span></div>
    </transition>
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
      <div v-show="!show" class="calendar"><span>{{ calendarStr }}</span></div>
    </transition>
  </div>
</template>

<script>
import { calendar } from '@/vendor/Calendar'
export default {
  data() {
    return {
      time: 0,
      show: true
    }
  },
  computed: {
    hmStr() {
      const date = new Date(this.time)
      const h = date.getHours()
      const m = date.getMinutes()
      const hpre = h < 10 ? '0' : ''
      const mpre = m < 10 ? '0' : ''
      return hpre + h + ' : ' + mpre + m
    },
    calendarStr() {
      const c = calendar.solar2lunar(new Date(this.time))
      // const mpre = c.cMonth < 10 ? '0' : ''
      // const dpre = c.cDay < 10 ? '0' : ''
      // const str = c.cYear + '年' + mpre + c.cMonth + '月' + dpre + c.cDay + '日 ' + c.IMonthCn + ' ' + c.IDayCn + ' ' + c.ncWeek
      // const str = c.cYear + '年' + c.cMonth + '月' + c.cDay + '日 ' + c.IMonthCn + ' ' + c.IDayCn + ' ' + c.ncWeek
      const str = c.cMonth + '月' + c.cDay + '日  ' + c.IMonthCn + '' + c.IDayCn + ' ' + c.ncWeek
      // {
      //   Animal: "兔",
      //   IDayCn: "初十",
      //   IMonthCn: "九月",
      //   Term: null,
      //   astro: "天蝎座",
      //   cDay: 1,
      //   cMonth: 11,
      //   cYear: 1987,
      //   gzDay: "甲寅",
      //   gzMonth: "庚戌",
      //   gzYear: "丁卯",
      //   isLeap: false,
      //   isTerm: false,
      //   isToday: false,
      //   lDay: 10,
      //   lMonth: 9,
      //   lYear: 1987,
      //   nWeek: 7,
      //   ncWeek: "星期日"
      // }
      return str
    }
  },
  mounted() {
    this.time = new Date().getTime()
    setInterval(this.setTime, 200)
  },
  methods: {
    setTime() {
      this.time = new Date().getTime()
    },
    mouseover() {
      this.show = false
    },
    mouseout() {
      this.show = true
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  width: 400px;
  height: 50px;
  margin-left: calc(50% - 200px);
  position: relative;
  div {
    position: absolute;
    top: 0;
    left: 0;
    width: 400px;
    height: 100%;
    margin: auto;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .hm {
    font-size: 36px;
    color: white;
    text-shadow: 0 0 20px rgba(0,0,0,0.35);
    pointer-events: none;
  }
  .calendar {
    font-size: 26px;
    color: white;
    text-shadow: 0 0 20px rgba(0,0,0,0.35);
    pointer-events: none;
  }
}
</style>>
