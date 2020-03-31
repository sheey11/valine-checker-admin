<template lang="pug">
  div
    h1.title {{ title }}
      .login-wrap
        zi-input(placeholder="用户名" autofocus="true" v-model="uname" @keydown="inputKeydown($event)")
        zi-input(placeholder="密码" style="margin: 10px 0" v-model="passwd" _type="password" @keydown="inputKeydown($event)")
        zi-button(type="success" style="margin-top: 20px" @click="doLogin" v-bind:loading="isLoading") 登陆
</template>

<script>
export default {
  name: 'Home',
  data() {
    return {
      title: "Valine Checker",
      uname: '',
      passwd: '',
      isLoading: false,
    }
  },
  methods: {
    doLogin(){
      this.isLoading = true;
      this.$http.post('/login', {
        uname: this.uname,
        passwd: this.passwd
      }).then(res => {
        if(res.data.code == 200){
          this.$router.push('admin');
        }else{
          this.$Toast.danger(res.data.msg)
        }
        this.isLoading = false;
      }).catch(err => {
        this.$Toast.danger(err.toString())
        this.isLoading = false;
      })
    },
    inputKeydown(ev){
      if(ev.keyCode == 13){
        this.doLogin();
      }
    }
  }
}
</script>

<style scoped>

.title{
  text-align: center;
  color: #2c3e50;
  margin-top: 50px;
}

.login-wrap{
  text-align: center;
  width: 20%;
  min-width: 255px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 150px;
  display: flex;
  flex-direction: column;
}

.login-wrap *{
  margin-left: 0;
  margin-right: 0;
}

</style>