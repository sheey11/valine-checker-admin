<template lang="pug">
  div(style="width: 100%; max-width: 1008px; margin: 0 auto;")
    div
      h1 Valine Checker
      vue-content-loading.site-name(:width="7" :height="1" v-if="loadingComents" style="width:115px; height:15px")
        rect(width="7" height="1" rx="0.3" ry="0.3")
      p.site-name(v-if="!loadingComents") {{ sitename }}
    div.card
      zi-tabs
        zi-tabs-item(label="评论" value="comment")
          div.comment-wrapper
            vue-content-loading(:width="1008" :height="150" style="width: 100%; height: 150px;" v-if="loadingComents")
              rect(width="50" height="20" x="0" y="0" rx="5" ry="5")
              rect(width="100" height="20" x="60" y="0" rx="5" ry="5")
              rect(width="50" height="20" x="170" y="0" rx="5" ry="5")
              rect(width="700" height="80" x="40" y="30" rx="10" ry="10")
              rect(width="150" height="30" x="0" y="120" rx="5" ry="5")
              rect(width="150" height="30" x="160" y="120" rx="5" ry="5")
              rect(width="150" height="30" x="320" y="120" rx="5" ry="5")
            comment(v-for="c in this.comments" :key="c.id" v-bind="c" :isSpam.sync="c.isSpam" @removed="removeComments")
        zi-tabs-item(label="日志" value="logs")
          div.log-wrapper
            div.log-info-wrapper
              p {{ logStatus }}
              zi-button(:disabled="selectedFile==''" size="mini" style="margin-right: 0; margin-left:auto;" @click="deleteSelectedLogs") 删除选中日志
            div.log
              zi-textarea.log-text(readonly="true" :value="log" rows=23)
              zi-files.file-tree(:files="files" @file-click="clickHandler")
</template>

<script>
import Comment from "../component/Comment";
import VueContentLoading from 'vue-content-loading';
import Vue from "vue";

Vue.component("comment", Comment);
Vue.component("VueContentLoading", VueContentLoading);

export default {
  name: "Admin",
  data() {
    return {
      sitename: "",
      comments: [],
      loadingComents: true,
      log: '',
      logStatus: '正在加载...',
      files: [],
      selectedFile: '',
    }
  },
  methods: {
      removeComments(id){
        for (let i = 0; i < this.comments.length; i++) {
          if (this.comments[i].id == id) {
            this.comments.splice(i, 1);
            return
          }
        }
      },
      clickHandler(e){
        // 读取选中日志
        this.selectedFile = e.name;
        this.$http
          .get("/logs/read?filename=" + this.selectedFile)
          .then(res => {
            if(res.data.code == 200){
              this.log = res.data.data
              this.logStatus = e.name
            }else{
              this.$Toast.danger('读取日志失败，' + res.data.msg)
              this.logStatus = '读取日志失败。'
            }
          }).catch(err => {
            this.$Toast.danger(err.toString())
            this.logStatus = '读取日志失败。'
          });
      },
      deleteSelectedLogs(){
        // 删除选中日志
        this.$http
          .get("/logs/delete?filename=" + this.selectedFile)
          .then(res => {
            if(res.data.code == 200){
              this.listLogs()
              this.$Toast.success('已删除。')
            }else{
              this.$Toast.danger('删除失败，' + res.data.msg)
            }
          }).catch(err => {
            this.$Toast.danger(err.toString())
          });
      },
      listLogs(){
        this.files.splice(0, this.files.length)
        // 获取日志信息
        this.$http
          .get("/logs/list")
          .then(res => {
            if(res.data.code == 200){
              for(let file of res.data.logs){
                this.files.push({
                  type: 'file',
                  name: file,
                })
              }
              this.logStatus = '加载完成。'
            }else{
              this.$Toast.danger('获取日志失败，' + res.data.msg)
              this.logStatus = '获取日志失败。'
            }
          }).catch(err => {
            this.$Toast.danger(err.toString())
            this.logStatus = '获取日志失败。'
          });
      }
  },
  mounted() {
    // 获取评论
    this.$http
      .get("/comments")
      .then(res => {
        if(res.data.code == 200){
          this.loadingComents = false;
          this.sitename = res.data.site_name;
          this.comments = res.data.comments;
        }else{
          this.$Toast.danger('获取评论失败，' + res.data.msg)
        }
      }).catch(err => {
        this.$Toast.danger(err.toString())
      });
      
      this.listLogs()
  }
};
</script>

<style scoped>
h1 {
  color: rgb(48, 48, 48);
  font-weight: bold;
  font-size: 30px;
  margin: 10px 0 0 20px;
}
.site-name {
  color: rgb(48, 48, 48);
  margin: 0 0 15px 25px;
  font-size: 15px;
}

.comment-wrapper{
  margin-top: 10px;
  margin-bottom: 50px;
}

.log-wrapper{
  margin-top: 10px;
  margin-bottom: 50px;
}

.log-info-wrapper{
  display: flex;
}

.log-info-wrapper p{
  margin: 0 0 10px 10px;
}

.log{
  display: flex;
}

.log-text{
  margin-left: 0;
  margin-right: 5px;
  width: 70%;
}

.file-tree{
  margin-right: 0;
  width: 30%;
}

.card {
  box-sizing: border-box;
  margin: 0 20px;
}
</style>