<template>
  <div class="loading">
    <div class="loading-left-line-wrapper">
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </div>
    <div class="loading-right-line-wrapper">
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </div>
  </div>
</template>

<script>

</script>

<style lang="scss" scoped>
  @import "../../assets/styles/global.scss";

  %line-wrapper {
    flex: 1;
    background: transparent;
    padding: px2rem(4);
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .line {
      width: 80%;
      height: px2rem(2);
      background: #d7d7d7;
      &:nth-child(1){
        -webkit-animation: telescopic 1.5s ease infinite;
        -o-animation: telescopic 1.5s ease infinite;
        animation: telescopic 1.5s ease infinite;
      }
      &:nth-child(2){
        -webkit-animation: telescopic 2s ease infinite;
        -o-animation: telescopic 2s ease infinite;
        animation: telescopic 2s ease infinite;
      }
      &:nth-child(3){
        -webkit-animation: telescopic 3s ease infinite;
        -o-animation: telescopic 3s ease infinite;
        animation: telescopic 3s ease infinite;
      }
    }
  }

  .loading {
    position: relative;
    width: px2rem(120);
    height: px2rem(90);
    background: transparent;
    border: px2rem(2) solid #d7d7d7;
    border-radius: px2rem(4);
    padding: px2rem(4);
    display: flex;
    .loading-left-line-wrapper {
      margin-right: px2rem(1);
      @extend %line-wrapper;
    }
    .loading-right-line-wrapper {
      margin-left: px2rem(1);
      @extend %line-wrapper;
    }
  }

  @keyframes telescopic {
    0% {
      width: 0;
    }
    50% {
      width: 80%;
    }
    100% {
      width: 0;
    }
  }

  @-moz-keyframes telescopic {
    0% {
      width: 0;
    }
    50% {
      width: 80%;
    }
    100% {
      width: 0;
    }
  }

  @-ms-keyframes telescopic {
    0% {
      width: 0;
    }
    50% {
      width: 80%;
    }
    100% {
      width: 0;
    }
  }

  @-o-keyframes telescopic {
    0% {
      width: 0;
    }
    50% {
      width: 80%;
    }
    100% {
      width: 0;
    }
  }

  @-webkit-keyframes telescopic {
    0% {
      width: 0;
    }
    50% {
      width: 80%;
    }
    100% {
      width: 0;
    }
  }
</style>
