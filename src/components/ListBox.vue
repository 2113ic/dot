<script setup>
const data = defineProps(['list'])
</script>

<template>
  <ul class="list">
    <li class="list-item" v-for="item of data.list" :key="item.title">
      <img class="night" :src="item.cover" alt="cover" />
      <a class="list-title" :href="item.url">{{ item.title }}</a>
    </li>
  </ul>
</template>

<style lang="scss">
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
      transition: color 0.3s;

      &:hover {
        color: var(--primary);
      }
    }
  }
}

@media (min-width: 640px) {
  .list {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
