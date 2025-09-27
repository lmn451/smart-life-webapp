<template>
  <div
    class="app-logo"
    aria-label="Smart Life Logo"
  >
    <svg
      class="logo-svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      role="img"
    >
      <g
        fill="none"
        stroke="currentColor"
        stroke-width="28"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle
          cx="256"
          cy="256"
          r="172"
        />
        <line
          x1="256"
          y1="104"
          x2="256"
          y2="236"
        />
      </g>
    </svg>
    <span class="logo-title">Smart&nbsp;Life</span>
  </div>
</template>

<script>
export default {
  name: 'AppLogo'
}
</script>

<style scoped>
.app-logo {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: var(--el-text-color-primary);
}
.logo-svg {
  width: 40px;
  height: 40px;
  display: block;
}
.logo-title {
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.2px;
}
</style>
