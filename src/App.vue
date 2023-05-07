<script setup>
import ToggleTheme from './components/ToggleTheme.vue'
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
    <ul class="list">
      <li class="list-item">
        <img class="night" src="/public/cover/banner.png" alt="cover" />
        <a class="list-title" href="./public/package/banner/">Banner</a>
      </li>
      <li class="list-item">
        <img class="night" src="/public/cover/lightTip.png" alt="cover" />
        <a class="list-title" href="./public/package/LightTip/">LightTip</a>
      </li>
    </ul>
  </main>
</template>

<style lang="scss">
.right-top {
  position: absolute;
  top: 24px;
  right: 24px;
}

.list {
  display: grid;
  grid-gap: 1rem;
  gap: 1rem;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  padding: 0;
  margin-bottom: 24px;

  .list-item {
    display: flex;
    flex-direction: column;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid var(--border-color);
    transition: background-color 0.3s;

    img {
      width: 100%;
      height: 200px;
      border-radius: 8px;
    }

    .list-title {
      margin: 12px 0;
      font-size: 18px;
      font-weight: 600;
      transition: color .3s;

      &:hover { color: var(--primary); }
    }
  }
}

@media (min-width: 640px) {
  .list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
