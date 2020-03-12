<template lang="pug">
  div(style="max-size: 100%;")
    div
      h1.title {{ sitename }}
    div.card
      zi-tabs
        zi-tabs-item(label="评论" value="comment")
          zi-note 评论
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
        console.log('damn')
        this.$http.get('/comments').then(res =>{
            console.log('this is res')
            console.log(res)
            this.sitename = res.data.site_name
            this.comments = res.data.comments
        }).catch(err => {
            console.log(err)
        })
    }
}

</script>

<style scoped>
.title{
    font-size: 30px;
    font-weight: bold;
    margin: 10px auto 20px 20px;
}
.log-link{
    margin-right: 0;
    margin-left: auto;
}

.card{
    box-sizing: border-box;
    margin: 0 20px
}
</style>