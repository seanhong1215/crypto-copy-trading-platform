<template>
  <footer class="site-footer">
    <div class="container footer-grid">
      <div>
        <img class="footer-logo" src="@/assets/c_images/brand-lockup.svg" alt="FinFolio" />
        <p>{{ $t('footer.disclaimer') }}</p>
      </div>
      <nav aria-label="頁尾導覽">
        <strong>{{ $t('footer.product_col') }}</strong>
        <router-link to="/leaderboard">{{ $t('leaderboard.menu') }}</router-link>
        <router-link to="/following">{{ $t('following.menu') }}</router-link>
        <router-link to="/market">{{ $t('market.menu') }}</router-link>
      </nav>
    </div>
    <div class="copyright">© 2026 FinFolio {{ $t('common.copyright') }}</div>
  </footer>
</template>

<style scoped>
.site-footer { padding-top: 54px; color: #cad6e0; background: #07111f; }
.footer-grid { display: grid; grid-template-columns: minmax(0, 2fr) minmax(160px, 1fr); gap: 60px; padding-bottom: 44px; }
.footer-logo { width: 142px; margin-bottom: 20px; filter: brightness(0) invert(1); }
p { max-width: 560px; margin: 0; color: #91a2b3; font-size: 13px; line-height: 1.75; }
nav { display: grid; justify-content: end; gap: 12px; }
nav strong { margin-bottom: 4px; color: #fff; }
nav a { color: #91a2b3; }
nav a:hover { color: #fff; }
.copyright { padding: 20px; border-top: 1px solid rgba(255,255,255,.08); color: #718397; text-align: center; font-size: 12px; }
@media (max-width: 640px) { .footer-grid { grid-template-columns: 1fr; gap: 32px; } nav { justify-content: start; } }
</style>
