<script setup lang="ts">
import { VPNavBarSearch } from "vitepress/theme";
import logo from "./logo.svg";
import word from "./word.svg";
</script>

<template>
  <header class="container">
    <nav class="navigation">
      <a href="/" class="logo-mark">
        <logo class="logo" />
        <word class="word" />
      </a>
      <ul>
        <li><a href="/" class="active">Home</a></li>
        <li><a href="/guides">Guides</a></li>
        <li><a href="/api">API</a></li>
      </ul>
      <div class="search"><VPNavBarSearch /></div>
    </nav>
  </header>
</template>

<style scoped lang="postcss">
.container {
  position: sticky;
  top: 0;
  max-width: 1344px;
  padding: 0;
  margin: 0 auto;
  z-index: 10;

  @media (min-width: 980px) {
    padding: 0 2rem;
    top: 1.5rem;
  }
}

.navigation {
  display: flex;
  width: 100%;
  margin: 0 auto;
  background: rgba(255 255 255 / 0.03);
  border-bottom-left-radius: 0.5rem;
  border-bottom-right-radius: 0.5rem;
  backdrop-filter: blur(13px);
  padding: 1rem 2rem;
  box-shadow: 0 2px 12px rgba(0 0 0 / 0.05);
  align-items: center;
  justify-content: space-between;
  gap: 2rem;

  @media (min-width: 540px) {
    gap: 2rem;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-bottom-left-radius: 0.5rem;
    border-bottom-right-radius: 0.5rem;
    padding: 1px;
    background: linear-gradient(to bottom, rgba(255 255 255 / 0.15), rgba(0 0 0 / 0.15));
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
    z-index: -1;
  }

  @media (min-width: 980px) {
    border-radius: 0.5rem;

    &::before {
      border-radius: 0.5rem;
    }
  }

  ul {
    display: flex;
    justify-content: center;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 0.25rem;
    text-shadow: 0 2px 2px rgba(0 0 0 / 0.25);

    @media (min-width: 540px) {
      display: flex;
    }

    a {
      display: block;
      color: #ffc474;
      padding: 0.25rem 1rem;
      border-radius: 20rem;

      &:hover,
      &.active {
        background: rgba(255 196 166 / 0.13);
      }
    }
  }
}

.logo-mark {
  display: flex;
  align-items: center;
  gap: 1rem;
  text-decoration: none;
  filter: drop-shadow(0 0 6px #110819);
}

.logo {
  height: 42px;
  width: 66px;
}

.word {
  display: none;
  height: 18px;
  width: 169px;

  @media (min-width: 980px) {
    display: block;
  }
}

.search {
  width: 66px;
  display: flex;
  justify-content: flex-end;

  @media (min-width: 980px) {
    width: 250px;
  }

  .VPNavBarSearch {
    padding-left: 0;
    flex: 0;

    &:deep(.DocSearch-Button) {
      height: 42px;
      background-color: var(--vp-c-bg-alt);
      border-radius: 20rem;
    }
  }
}
</style>
