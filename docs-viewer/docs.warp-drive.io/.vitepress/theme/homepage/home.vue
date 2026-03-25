<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import FontFaceObserver from "fontfaceobserver-es";
import { VPTeamPage, VPTeamPageTitle, VPTeamMembers } from "vitepress/theme";
import { data as members } from "../../data/contributors.data.ts";
import { data as coreTeam } from "../../data/core.data.ts";
import { data as top12 } from "../../data/all-time.data.ts";
import ContributorList from "../../theme/ContributorList.vue";
import Hero from "./hero.vue";
import Navigation from "./navigation.vue";
import Bento from "./bento.vue";
import CodeExample from "./code-example.vue";

// So we can alter the fallback fonts to reduce layout shifts
const cantarell = new FontFaceObserver("Cantarell");
const syncopate = new FontFaceObserver("Syncopate");

Promise.all([cantarell.load(), syncopate.load()]).then(() => {
  document.documentElement.classList.add("fonts-loaded");
});

onMounted(() => {
  document.body.classList.add("homepage", "dark");
});

onUnmounted(() => {
  document.body.classList.remove("homepage", "dark");
});
</script>

<template>
  <Navigation />
  <Hero />
  <Bento />
  <Suspense>
    <CodeExample />
  </Suspense>

  <VPTeamPage class="core-team">
    <VPTeamPageTitle>
      <template #title>The Core Team</template>
      <template #lead>Some People You Should Really Buy a Coffee For.</template>
    </VPTeamPageTitle>
    <VPTeamMembers size="small" :members="coreTeam" />
  </VPTeamPage>

  <VPTeamPage class="hall-of-fame">
    <VPTeamPageTitle>
      <template #title>The Hall Of Fame</template>
      <template #lead>The Top 12 All Time Contributors / Excluding The Core Team</template>
    </VPTeamPageTitle>
    <VPTeamMembers size="small" :members="top12.decoratedTop12" />
  </VPTeamPage>

  <VPTeamPage>
    <VPTeamPageTitle>
      <template #title>Our Contributors</template>
      <template #lead>A big thank you to all the amazing people who have helped improve this project.</template>
    </VPTeamPageTitle>
    <ContributorList :contributors="members" />
  </VPTeamPage>
  <!-- <div class="contributors-wrapper">
  </div> -->
</template>

<style>
.homepage {
  background: #110819;

  /* VPTeamPage overrides */
  .VPTeamPage {
    margin: 0 auto;
    max-width: 1344px;
    padding: 3rem 2rem;

    @media (min-width: 980px) {
      padding: 5rem 4rem;
    }
  }

  /* Section titles */
  .VPTeamPageTitle {
    padding: 0 0 16px;
  }

  .VPTeamPageTitle .title {
    color: #ffc474;
    font-size: 1.5rem;
    font-weight: bold;
    font-family:
      "cantarell", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
      "Noto Color Emoji";
  }

  .VPTeamPageTitle .lead {
    color: #a98c88;
    font-size: 0.9rem;
  }

  /* Members grid */
  .VPTeamMembers {
    padding: 0;
  }

  .VPTeamMembers .container {
    max-width: 1344px;
    gap: 12px;
  }

  .core-team .VPTeamMembers .container {
    gap: 12px;
  }

  /* Member cards */
  .VPTeamMembersItem {
    background: transparent;
    border: none;
    border-radius: 8px;
    overflow: visible;
  }

  .hall-of-fame .VPTeamMembersItem .profile {
    padding: 12px;
    padding-top: 36px;
  }

  .hall-of-fame .VPTeamMembersItem.small .avatar {
    margin-top: -36px;
  }

  .core-team .VPTeamMembersItem {
    background: #0b0411;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      box-shadow: 0 0 40px -20px rgb(228 45 55 / 30%);
    }
  }

  .core-team .VPTeamMembersItem .profile {
    padding-top: 16px;
  }

  .core-team .VPTeamMembersItem.small .avatar {
    width: 64px;
    height: 64px;
  }

  .VPTeamMembersItem .profile {
    background: transparent;
    padding: 16px;
  }

  .hall-of-fame .VPTeamMembersItem .profile {
    padding: 12px;
  }

  .VPTeamMembersItem .data {
    padding-top: 12px;
  }

  .VPTeamMembersItem .name {
    color: #ffc474;
    font-size: 0.85rem;
  }

  .VPTeamMembersItem .affiliation {
    color: #a98c88;
    font-size: 0.75rem;
  }

  .VPTeamMembersItem.small .avatar {
    width: 48px;
    height: 48px;
    box-shadow: 0 0 20px -5px rgb(234 150 255 / 25%);
  }

  .VPTeamMembersItem .links {
    height: 40px;
    margin: 0 -8px -12px;
  }

  .hall-of-fame .VPTeamMembersItem .links {
    margin: 0;
  }

  .hall-of-fame .VPTeamMembers .container {
    margin-top: 48px;
    grid-template-columns: repeat(auto-fit, minmax(175px, 1fr));
    gap: 48px 16px;
  }

  .VPTeamMembersItem .org.link {
    color: #a98c88;

    &:hover {
      color: #ffc474;
    }
  }

  .VPTeamMembersItem .desc {
    color: #8a7070;
    font-size: 0.75rem;
  }

  .VPTeamMembersItem .links .VPSocialLink {
    fill: #a98c88;
    transition: fill 0.2s ease;

    &:hover {
      fill: #ffc474;
    }
  }

  .VPTeamMembersItem .sp-link {
    color: #e42d37;
    background: transparent;
    border: none;

    &:hover {
      background: transparent;
    }
  }

  /* Hall of Fame - avatar, name, and links only */
  .hall-of-fame .VPTeamMembersItem {
    background: #0b0411;
  }

  .hall-of-fame .VPTeamMembersItem .name {
    font-size: 14px;
  }

  .hall-of-fame .VPTeamMembersItem .affiliation {
    display: none;
  }

  .hall-of-fame .VPTeamMembersItem .desc {
    display: none;
  }

  .hall-of-fame .VPTeamMembersItem .sp {
    display: none;
  }

  /* Contributor list */
  .contributors-wrapper {
    margin: 0 auto;
    max-width: 1344px;
    padding: 0rem 2rem;

    @media (min-width: 980px) {
      padding: 0rem 4rem;
    }
  }

  .contributors-container .avatar {
    border-color: rgb(234 150 255 / 20%);
  }
}
</style>
