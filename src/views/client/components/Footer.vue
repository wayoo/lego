<template>
  <div class="footer">
    <!-- eslint-disable -->
    <div
      data-v-2e9af750=""
      class="footers-con el-row is-justify-flex-start el-row--flex"
    >
      <div data-v-2e9af750="" class="left">
        <img
          data-v-2e9af750=""
          src="data:image/png;base64,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"
          alt=""
          class="left-logo"
        />
        <div data-v-2e9af750="" class="foot-w">伟东家政培训平台</div>
      </div>
      <div data-v-2e9af750="" class="center">
        <p data-v-2e9af750="">邮编：100089</p>
        <p data-v-2e9af750="">地址：北京市海淀区怡和8号院</p>
      </div>
      <div data-v-2e9af750="" class="right">
        <img
          data-v-2e9af750=""
          src="../asset/component/footer/qrcode.png"
          alt=""
        /><span data-v-2e9af750="">扫码查看H5端</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style lang="less">
.footer {
    margin: 0 auto;
    background-color: #202735;

    .footers-con {
      width: 1200px;
      height: 195px;
      margin: 0 auto;
      display: flex;
    }

    .left {
      margin-left: 20px;
      margin-right: 212px;

      .left-logo {
        width: 101px;
        margin-top: 60px;
      }

      .foot-w {
        margin-top: 29px;
        height: 30px;
        font-size: 22px;
        font-family: PingFangSC-Bold, PingFang SC;
        font-weight: bold;
        color: #fff;
        line-height: 30px;
      }
    }

    .center {
      margin-top: 50px;
      margin-right: 380px;

      p {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #fff;
        margin-bottom: 13px;
        opacity: 0.6;
      }
    }

    .right {
      width: 100px;
      text-align: center;

      img {
        width: 90px;
        height: 90px;
        margin-top: 48px;
        margin-bottom: 16px;
      }

      span {
        display: block;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #fff;
      }
    }
}
</style>
