<template>
  <router-view/>
</template>

<style>
@import url("https://fonts.googleapis.com/icon?family=Material+Icons+Round");

html {
  color-scheme: light;
}
html.dark {
  color-scheme: dark;
}

html, body {
  margin: 0;
  padding: 0;
  background-color: var(--el-bg-color);
  color: var(--el-text-color-primary);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--el-text-color-primary);
}
</style>
