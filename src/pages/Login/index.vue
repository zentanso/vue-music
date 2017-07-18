<template>
  <div>
    <x-header class="header-wrapper">
      登录
      <x-icon slot="overwrite-left" type="android-arrow-back" class="topbar-icon" @click="onBackClick"></x-icon>
    </x-header>
    <div class="wrapper">
      <group style="padding: 10px 0 10px 0; font-size: 16px;">
        <x-input title="手机" :is-type="validatePhone"	v-model="phone" show-clear :max="11">
        </x-input>
        <x-input title="密码" type="password" v-model="password" :is-type="validatePassword"></x-input>
      </group>
      <x-button :disabled="isLoading || !isValidated" class="button-style" :show-loading="isLoading" @click.native="_login">登录</x-button>
    </div>
    <toast :time="1000" v-model="showMsg" position="bottom" :text="msg" type="text"></toast>
  </div>
</template>

<script>
import { XHeader, XButton, Group, XInput, Toast } from 'vux'
import { login } from '@/api'
import { LOADING, ERROR, LOADED } from '@/constants'
import cookie from '@/util/cookie'
import { mapActions } from 'vuex'

export default {
  name: 'login',
  components: {
    XHeader,
    XButton,
    Group,
    XInput,
    Toast
  },
  beforeRouteEnter (to, from, next) {
    if (cookie.get('__csrf')) next(false)
    next()
  },
  data () {
    return {
      phone: '',
      password: '',
      loadState: {
        login: LOADED
      },
      minLen: 6,
      msg: '',
      showMsg: false
    }
  },
  computed: {
    isLoading () {
      return this.loadState.login === LOADING
    },
    isValidated () {
      const phoneValid = this.validatePhone(this.phone).valid
      const passwordValid = this.validatePassword(this.password).valid
      return phoneValid && passwordValid
    }
  },
  methods: {
    ...mapActions([
      'setMyId'
    ]),
    onBackClick () {
      window.history.go(-1)
    },
    async _login () {
      this.loadState.login = LOADING
      const res = await login(this.phone, this.password)
      this.password = ''
      console.log(res)
      if (!res) {
        this.loadState.login = ERROR
        return
      }
      if (res.data.code !== 200) {
        this.msg = res.data.msg
        this.showMsg = true
        this.loadState.login = ERROR
        return
      }
      this.loadState.login = LOADED
      this.setMyId(res.data.profile.userId)
      window.localStorage.myid = res.data.profile.userId
      this.$router.push('/')
    },
    validatePhone (str) {
      const reg = /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(18[0,5-9]))\d{8}$/
      return {
        valid: reg.test(str),
        msg: '手机号为11位数字'
      }
    },
    validatePassword (str) {
      return {
        valid: str.length > 6,
        msg: '密码过短'
      }
    },
    async b () {
      const p = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve({
            code: 201,
            data: {
              msg: '模拟错误'
            }
          })
        }, 2000)
      })
      return await p
    }
  }
}
</script>

<style lang="less" scoped>
.header-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 499;
}
.wrapper {
  width: 80%;
  margin: 46px auto 0 auto;
}

.button-style {
  font-family: 'Microsoft YaHei';
  font-size: 14px;
}
</style>
