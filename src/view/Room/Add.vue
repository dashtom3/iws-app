<template>
    <div>
        <mu-appbar title="新建房间">
            <mu-icon-button icon='arrow_back' slot="left" @click="back"/>
        </mu-appbar>
        <div>
        <div class="title">
            <!-- <div>微豆 Vdo</div>
            <div class="description" style="font-size: 16px;">一个移动端豆瓣 Web 应用</div> -->
            <qrcode val="roomAdd.qrcode"></qrcode>
        </div>
        <mu-raised-button label="选择模版" class="add-select-template" icon="" @click="popUpTemplate()" primary/>
        <mu-popup position="bottom" popupClass="popup-bottom" :open="bottomPopup" @close="popUpTemplate()">
          <mu-appbar title="弹出">
            <mu-flat-button slot="right" label="关闭" color="white" @click="popUpTemplate('bottom')"/>
          </mu-appbar>
          <mu-grid-list class="gridlist-demo">
            <!-- <mu-sub-header>图片展示</mu-sub-header> -->
            <mu-grid-tile v-for="tile, index in list" :key="index">
              <img :src="tile.image"/>
              <span slot="title">{{tile.title}}</span>
              <span slot="subTitle">by <b>{{tile.author}}</b></span>
              <mu-icon-button icon="star_border" slot="action"/>
            </mu-grid-tile>
          </mu-grid-list>
        </mu-popup>
        <mu-divider/>
        <div class="add-content">
          <!-- <mu-list-item> -->
          <mu-text-field label="名称" labelFloat fullWidth/>
          <mu-text-field label="简介" labelFloat multiLine :rows="3" :rowsMax="4" fullWidth/>
          <!-- </mu-list-item> -->
          <mu-checkbox label="是否可见" v-model="roomAdd.isShow"/><br/>
          <mu-checkbox label="加入需要申请" v-model="roomAdd.isQualified"/><br/>
          <mu-raised-button label="创建房间" fullWidth icon="label" primary/>
        </div>
        </div>
    </div>
</template>
<script>
    export default{
      data() {
        return {
          bottomPopup: false,
          roomAdd: {
            title: null,
            content: null,
            isShow: false,
            isQualified: false,
            picUrl: null,
            qrcode: null,
          },
        };
      },
      methods: {
        back() {
          this.$router.go(-1);
        },
        handleToggle(key) {
          this[key] = !this[key];
        },
        popUpTemplate() {
          this.bottomPopup = !this.bottomPopup;
        },
      },
    };
</script>
<style lang="css">
  .popup-bottom {
    width: 100%;
    height: 200px;
  }
</style>
<style lang="css" scoped>
    .title{
        text-align: center;
        padding: 48px 0;
    }
    .add-select-template {
      margin-top: -40px;
    }
    .add-content {
      margin-left: 10px;
      margin-right: 10px;
      margin-bottom: 10px;
    }
    .add-button {
      width: 100%
    }

</style>
