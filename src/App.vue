<script setup>
import ToggleTheme from './components/ToggleTheme.vue';
</script>

<template>
  <header>
    <h1 class="title">DOT</h1>
    <p class="summay">Welcome to my repository for my personal hobby projects!</p>
    <ToggleTheme class="right-top"></ToggleTheme>
  </header>

</template>

<style>
  .right-top {
    position: absolute;
    top: 24px; right: 24px;
  }
</style>