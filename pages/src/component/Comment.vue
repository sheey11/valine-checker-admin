<template lang="pug">
  zi-fieldset.comment-container
    div.comment-info
      zi-dot
      p(v-if="authorUrl == ''").sender {{ sender }}
      a(v-else :href="authorUrl" target="_blank").sender {{ sender }}
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
        zi-button(size="small" v-if="!isSpam" :disabled="isSpam" :loading="isChangingStatus" @click="markAsSpam") 标记为垃圾评论并隐藏
        zi-button(size="small" v-if="isSpam" :loading="isChangingStatus" @click="markAsNormal") 标记为正常评论并显示
        zi-button(size="small" :disabled="isSpam" :loading="isChangingStatus" @click="hide") 隐藏
        zi-button(type="danger" size="small" :loading="isChangingStatus" @click="whetherDeleteDialog") 删除
        zi-dialog(v-model="visible" cancel="取消" done="确定" :beforeDone="deleteComment")
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
        removeMyself: Function,
    },
    data() {
        return {
            visible: false,
            isChangingStatus: false,
            deleteComment: function(done) {
                done()
                this.$parent.$parent.remove()
            },
        }
    },
    events: [
        'removed',
    ],
    methods:{
        openTab(url){
            window.open(url)
        },
        markAsSpam(){
            this.isChangingStatus = true
            this.$http.get('/action?type=markspam&id=' + this.id).then(res => {
                if(res.data.code == 200){
                    this.$Toast.success(res.data.msg)
                }else{
                    this.$Toast.danger(res.data.msg)
                }
                this.isSpamProp = true;
                this.isChangingStatus = false
            }).catch(err => {
                this.$Toast.danger(err.toString())
                this.isChangingStatus = false
            })
        },
        hide(){
            this.isChangingStatus = true
            this.$http.get('/action?type=hide&id=' + this.id).then(res => {
                if(res.data.code == 200){
                    this.$Toast.success(res.data.msg)
                }else{
                    this.$Toast.danger(res.data.msg)
                }
                this.isChangingStatus = false
            }).catch(err => {
                this.$Toast.danger(err.toString())
                this.isChangingStatus = false
            })
        },
        markAsNormal(){
            this.isChangingStatus = true
            this.$http.get('/action?type=marknormal&id=' + this.id).then(res => {
                if(res.data.code == 200){
                    this.$Toast.success(res.data.msg)
                }else{
                    this.$Toast.danger(res.data.msg)
                }
                this.isSpamProp = false;
                this.isChangingStatus = false
            }).catch(err => {
                this.$Toast.danger(err.toString())
                this.isChangingStatus = false
            })
        },
        whetherDeleteDialog(){
            // this.isChangingStatus = true
            this.visible = true
        },
        remove(){
            this.isChangingStatus = true
            this.$http.get('/action?type=delete&id=' + this.id).then(res => {
                if(res.data.code == 200){
                    this.$Toast.success(res.data.msg)
                    this.$emit('removed', this.id)
                }else{
                    this.$Toast.danger(res.data.msg)
                }
                this.isChangingStatus = false
            }).catch(err => {
                this.$Toast.danger(err.toString())
                this.isChangingStatus = false
            })
        }
    },
    computed: {
        isSpamProp: {
            get() { return this.isSpamProp},
            set(val) { this.$emit('update:isSpam', val)}
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