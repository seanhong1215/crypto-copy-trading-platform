<template>
  <div class="gai-footer footer">
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-sm-6 footer-col">
          <p class="col-title">FinFolio</p>
          <p class="footer-desc">{{ $t('footer.disclaimer') }}</p>
        </div>
        <div class="col-xs-12 col-sm-6 footer-col footer-col-right">
          <p class="col-title">{{ $t('footer.product_col') }}</p>
          <router-link to="/leaderboard" tag="a" exact>{{ $t('leaderboard.menu') }}</router-link>
          <br />
          <router-link to="/following" tag="a" exact>{{ $t('following.menu') }}</router-link>
          <br />
          <router-link to="/market" tag="a" exact>{{ $t('market.menu') }}</router-link>
        </div>
      </div>
    </div>
    <div class="text-center copyright">
      <span>Copyright @2026 FinFolio {{ $t('common.copyright') }}</span>
    </div>
  </div>
</template>

<style scoped>
.footer-desc {
  font-size: 13px;
  color: hsla(0, 0%, 100%, 0.5);
  max-width: 320px;
  line-height: 1.6;
}
@media (min-width: 768px) {
  .footer-col-right {
    text-align: right;
  }
}
</style>
