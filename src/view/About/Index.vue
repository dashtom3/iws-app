<template>
    <div>
        <!-- <mu-appbar title="关于">
            <mu-icon-button icon='arrow_back' slot="left" @click="back"/>
        </mu-appbar> -->
        <div>
        <div class="title">
            <div>舜禹水务</div>
            <div class="description" style="font-size: 16px;"></div>

        </div>

        </div>
    </div>
</template>
<script>
    export default{
      methods: {
        back() {
          this.$router.go(-1);
        },
      },
    };
</script>
<style lang="css" scoped>
    .title{
        color: #474a4f;
        font-size: 48px;
        text-align: center;
        margin: 72px 0;
    }
</style>
