<template lang="pug">
  div(style="width: 100%; max-width: 1008px; margin: 0 auto;")
    div
      h1 Valine Checker
      p.site-name {{ sitename }}
    div.card
      zi-tabs
        zi-tabs-item(label="评论" value="comment")
          comment(v-for="c in this.comments" v-bind:key="c.id" v-bind="c")
        zi-tabs-item(label="日志" value="logs")
          zi-note 日志
</template>

<script>

import Comment from '../component/Comment'
import Vue from 'vue'

Vue.component('comment', Comment)

export default {
    name: 'Admin',
    data() {
        return {
            sitename: '',
            comments: []
        }
    },
    mounted() {
        this.$http.get('/comments').then(res =>{
            this.sitename = res.data.site_name
            this.comments = res.data.comments
        }).catch(err => {
            console.log(err)
        })
    }
}

</script>

<style scoped>
h1{
    font-weight: bold;
    font-size: 30px;
    margin: 10px 0 0 20px;
}

.site-name{
    margin: 0 0 20px 25px;
    font-size:15px;
}

.log-link{
    margin-right: 0;
    margin-left: auto;
}

.card{
    box-sizing: border-box;
    margin: 0 20px;
}
</style>