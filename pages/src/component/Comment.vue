<template lang="pug">
  zi-fieldset.comment-container
    div.comment-info
      zi-dot
      p(v-if="authorUrl == ''").sender {{ sender }}
      a(v-else v-bind:href="authorUrl" target="_blank").sender {{ sender }}
      zi-dot(v-if="mail != ''")
      p(v-if="mail != ''") {{ mail }}
      zi-dot
      p {{ time }}
      zi-dot(v-if="isSpam")
      p(v-if="isSpam").spam 垃圾评论
    zi-card.comment-content
      div(v-html="comment")
    template(v-slot:footer).comment-actions
      div.action-buttons
        zi-button(size="small" @click="openTab(url)") 查看
        zi-button(size="small" v-if="!isSpam" v-bind:disabled="isSpam" v-bind:loading="isChangingStatus" @click="markAsSpam") 标记为垃圾评论并隐藏
        zi-button(size="small" v-if="isSpam" v-bind:loading="isChangingStatus" @click="markAsNormal") 标记为正常评论并显示
        zi-button(size="small" v-bind:disabled="isSpam" v-bind:loading="isChangingStatus" @click="hide") 隐藏
        zi-button(type="danger" size="small" v-bind:loading="isChangingStatus" @click="whetherDeleteDialog" beforeDone="a => _delete()") 删除
        zi-dialog(v-model="visible" cancel="取消" done="确定")
          h5(style="margin-bottom: 0px;") 确定要删除这条评论吗？
          p(style="margin: 0px 0 15px 0;") 此操作不可逆。
          zi-card
            div(v-html="comment")
</template>

<script>
export default {
    name: "Comment",
    props: {
        id: String,
        sender: String,
        mail: String,
        time: String,
        isSpam: Boolean,
        url: String,
        comment: String,
        authorUrl: String,
    },
    data() {
        return {
            visible: false,
            isChangingStatus: false,
        }
    },
    methods:{
        openTab(url){
            window.open(url)
        },
        markAsSpam(){
            // TODO
        },
        hide(){
            // TODO
        },
        markAsNormal(){
            // TODO
        },
        whetherDeleteDialog(){
            // this.isChangingStatus = true
            this.visible = true
        },
        _delete() {
            console.log('wwdhqiufkhil;dofgglklfjdhsgjdfklgw')
        }
    }
}
</script>

<style scoped>
.comment-container{
    margin: 10px 10px;
}

.comment-info{
    font-size: 14px;
    color: #616161;
    display: flex;
}

.comment-info *{
    padding: 0 3px;
    margin: 0;
}

.sender{
    font-weight: bold;
}

.spam{
    font-weight: bold;
    
}

.comment-content{
    margin-top: 20px;
    margin-left: 10px;
}

.comment-actions{
    margin-top: 5px;
    margin-bottom: 0px;
}

.action-buttons * {
    margin-right: 10px;
    margin-left: 0;
}

</style>