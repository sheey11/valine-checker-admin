<template lang="pug">
  div(style="width: 100%; max-width: 1008px; margin: 0 auto;")
    div(style="display: flex;")
      div
        h1 Valine Checker
        vue-content-loading.site-name(:width="7" :height="1" v-if="loadingComents" style="width:115px; height:15px")
          rect(width="7" height="1" rx="0.3" ry="0.3")
        p.site-name(v-if="!loadingComents") {{ sitename }}
      div.valine-checker-status-wrapper
        zi-dot(:type="vcStatusDotType")
        p(style="margin-left: 10px;") {{ valineCheckerStatus }}
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
              zi-textarea.log-text(readonly="true" :value="log" :rows="23")
              zi-files.file-tree(:files="files" @file-click="clickHandler")
        zi-tabs-item(label="Valine Checker" value="vc")
          zi-fieldset.vc-status-content-wrapper
            div(style="display: flex")
              zi-dot(:type="vcStatusDotType")
              p(style="margin-left: 10px;") {{ valineCheckerStatus }}
            template(v-slot:footer)
              div.vc-action-buttons
                zi-button(size="mini" type="success" auto :disabled="valineCheckerStatus == '正在运行'" @click='launchVC') 启动
                zi-button(size="mini" type="danger" auto :disabled="valineCheckerStatus != '正在运行'" @click='stopVC') 停止
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
      valineCheckerStatus: '未知',
      vcStatusDotType: 'primary',
      timer: 0,
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
          .get("/api/logs/read?filename=" + this.selectedFile)
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
          .get("/api/logs/delete?filename=" + this.selectedFile)
          .then(res => {
            if(res.data.code == 200){
              this.listLogs()
              this.$Toast.success('已删除。')
              this.selectedFile = ''
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
          .get("/api/logs/list")
          .then(res => {
            console.log(res)
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
      },
      showVCErrMsg(){
        this.$http
          .get("/api/vc/errmsg" + this.selectedFile)
          .then(res => {
            this.$Toast.danger('错误信息：'+ res.msg)
          }).catch(err => {
            this.$Toast.danger(err.toString())
          });
      },
      loadVCStatus(){
        this.$http
          .get("/api/vc/status")
          .then(res => {
            if(res.data.code == 200){
              switch(res.data.status){
                case 'sleeping':
                  this.valineCheckerStatus = '未运行'
                  this.vcStatusDotType = 'primary'
                  break;
                case 'failure':
                  this.valineCheckerStatus = '运行失败'
                  this.vcStatusDotType = 'danger'
                  this.showVCErrMsg()
                  break;
                case 'error':
                  this.valineCheckerStatus = '运行出错'
                  this.vcStatusDotType = 'danger'
                  this.showVCErrMsg()
                  break;
                case 'running':
                  this.valineCheckerStatus = '正在运行'
                  this.vcStatusDotType = 'success'
                  break;
              }
            }else{
              this.valineCheckerStatus = '未知'
              this.$Toast.danger('获取 Valine Checker 状态失败：' + res.data.msg)
            }
          }).catch(err => {
            this.$Toast.danger(err.toString())
          });
      },
      launchVC(){
        this.$http
          .get("/api/vc/launch" + this.selectedFile)
          .then(res => {
            if(res.data.code == 200){
              this.valineCheckerStatus = 'running'
              this.$Toast.success('启动成功')
            }
          }).catch(err => {
            this.$Toast.danger(err.toString())
          });
      },
      stopVC(){
        this.$http
          .get("/api/vc/stop" + this.selectedFile)
          .then(res => {
            if(res.data.code == 200){
              this.loadVCStatus()
              this.$Toast.success('已停止')
            }else{
              this.loadVCStatus()
              this.$Toast.danger('操作失败: ' + res.data.msg)
            }
          }).catch(err => {
            this.$Toast.danger(err.toString())
          });
      }
  },
  mounted() {
    // 获取评论
    this.$http
      .get("/api/comments")
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
      
      // 获取日志
      this.listLogs()

      // 获取 valine-checker 状态
      this.loadVCStatus()

      // 定时刷新 vc 状态
      if(this.timer){
          clearInterval(this.timer)
      }else{
          this.timer = setInterval(()=>{
            this.loadVCStatus()
          },5000)
      }
  },
  destroyed(){
    clearInterval(this.timer)
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

.valine-checker-status-wrapper{
  display: flex;
  margin: auto 20px auto auto;
  text-align: center;
  vertical-align: center;
  font-size: 13px;
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

.vc-status-content-wrapper{
  margin-top: 10px;
  margin-bottom: 50px;
}

.vc-action-buttons *{
  margin-right: 10px;
}
</style>