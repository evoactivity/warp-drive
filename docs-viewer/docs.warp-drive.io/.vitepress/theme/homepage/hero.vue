<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import Bubble from "./bubble.vue";
import Button from "./button.vue";
import Starfield from "./starfield.vue";
import { useData } from "vitepress";

const { frontmatter } = useData();

const starSpeed = ref(0.2);

function increaseSpeed() {
  starSpeed.value = 1;
}

function resetSpeed() {
  starSpeed.value = 0.2;
}

onMounted(() => {
  document.addEventListener("scroll", resetSpeed, { passive: true });
});

onUnmounted(() => {
  document.removeEventListener("scroll", resetSpeed);
});
</script>

<template>
  <div class="background-container">
    <Starfield :speed="starSpeed" :enable-scroll-speed="false" :max-fps="60" />
    <Bubble :speed="1" :max-fps="60" />
  </div>
  <div class="hero">
    <div class="content">
      <h1>{{ frontmatter.hero.text }}</h1>
      <p v-html="frontmatter.hero.tagline"></p>

      <ul class="actions">
        <li v-for="(action, index) in frontmatter.hero.actions" :key="index">
          <Button
            :class="action.theme"
            :link="action.link"
            @mouseover="if (action.theme === 'brand') increaseSpeed();"
            @mouseleave="resetSpeed"
          >
            {{ action.text }}
          </Button>
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.background-container {
  pointer-events: none;
  background: #110819;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  z-index: -1;

  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(to top, #110819, #11081900);
    z-index: 1;
  }
}

.hero {
  display: block;
  color: #ffc474;
  text-align: left;
  max-width: 1344px;
  margin: 0 auto;
  padding: 8rem 2rem;
  font-family:
    ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";

  @media (min-width: 980px) {
    padding: 11rem 4rem;
  }

  .content {
    max-width: 700px;
  }

  h1,
  p {
    text-shadow: 0 2px 2px rgba(0 0 0 / 0.25);
  }

  h1 {
    font-family:
      "Syncopate", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
      "Noto Color Emoji";
    font-size: clamp(3rem, 4.5vw, 4rem);
    font-weight: 900;
    line-height: 1;
    margin: 0 0 2.5rem;
    color: #ffeacd;
  }

  p {
    font-family:
      "Cantarell", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
      "Noto Color Emoji";
    margin: 0;
    font-size: 1.25rem;
    line-height: 1.4;

    & :deep(strong) {
      color: #ff8a00;
    }
  }
}

html:not(.fonts-loaded) .hero {
  h1 {
    font-family:
      ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    font-weight: 900;
    font-stretch: 122%;
    line-height: 0.9;
    font-size-adjust: cap-height 1;
  }

  p {
    font-family:
      ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    font-size-adjust: cap-height 0.75;
    margin-bottom: 2.6rem;
  }
}

.actions {
  list-style: none;
  padding: 0;
  margin: 2.5rem 0 0 0;
  display: flex;
  gap: 1rem;

  li {
    margin: 0;
  }
}
</style>
