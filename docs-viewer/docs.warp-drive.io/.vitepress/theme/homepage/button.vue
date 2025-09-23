<script setup lang="ts">
interface Props {
  link: string;
}

const props = defineProps<Props>();
const { link } = props;
</script>

<template>
  <a class="button" :href="link">
    <slot></slot>
  </a>
</template>

<style scoped lang="postcss">
.button {
  display: inline-block;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  background-color: #ffc474;
  border: 1px solid transparent;
  color: #311339;
  text-decoration: none;
  font-size: 1rem;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
  font-family: "Cantarell", sans-serif;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;

  @media (min-width: 600px) {
    padding: 1rem 1.5rem;
  }

  &.alt {
    border-color: #ffc474;
    background-color: transparent;
    color: #ffc474;
  }

  &:hover {
    background-color: #572859;
    border-color: #572859;
    color: #fff;
  }
}
</style>
