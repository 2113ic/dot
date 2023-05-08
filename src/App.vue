<script setup>
import ToggleTheme from './components/ToggleTheme.vue'
import ListBox from './components/ListBox.vue'
import listData from '@/config.js'

console.log(listData);
</script>

<template>
  <header>
    <h1 class="title">DOT</h1>
    <p class="summay">
      Welcome to my repository for my personal hobby projects!
    </p>
    <ToggleTheme class="right-top"></ToggleTheme>
  </header>
  <main>
    <ListBox :list="listData"></ListBox>
  </main>
</template>

<style lang="scss">
.right-top {
  position: absolute;
  top: 24px;
  right: 24px;
}
</style>
