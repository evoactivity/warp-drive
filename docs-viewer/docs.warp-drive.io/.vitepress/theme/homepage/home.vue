<script setup lang="ts">
import { VPTeamPage, VPTeamPageTitle, VPTeamMembers } from "vitepress/theme";
import { data as members } from "../../data/contributors.data.ts";
import { data as coreTeam } from "../../data/core.data.ts";
import { data as top12 } from "../../data/all-time.data.ts";
import ContributorList from "../../theme/ContributorList.vue";
import Hero from "./hero.vue";
import { onMounted, onUnmounted } from "vue";

onMounted(() => {
  document.body.classList.add("homepage");
});

onUnmounted(() => {
  document.body.classList.remove("homepage");
});
</script>

<template>
  <Hero />

  <VPTeamPage>
    <VPTeamPageTitle>
      <template #title>The Core Team</template>
      <template #lead>Some People You Should Really Buy a Coffee For.</template>
    </VPTeamPageTitle>
    <VPTeamMembers size="small" :members="coreTeam" />
  </VPTeamPage>

  <VPTeamPage>
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
  </VPTeamPage>
  <ContributorList :contributors="members" />
</template>

<style>
.homepage {
  background: #110819;
}
</style>
