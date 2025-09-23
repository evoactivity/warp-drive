---
layout: false

hero:
  name: "The Manual"
  text: Boldly Go Where No App Has Gone Before
  tagline: "WarpDrive is a universal data framework for <strong>ambitious</strong> web applications. Handling the tough
        parts for you like caching, persistence, request deduplication and testing."
  actions:
    - theme: brand
      text: Get Started
      link: /guides
    - theme: alt
      text: API Docs
      link: /api
    - theme: alt
      text: LLM Docs
      link: /llm-docs
    # - theme: alt
    #   text: Contributing
    #   link: /guide/contributing/become-a-contributor

features:
  - title: Connect With Any API
    icon: 🧩
    details: Or All Of Them. No Architectural Lock-in 🔓
  - title: Universal
    icon: 🌌
    details: Fine Grained Reactivity That Works Natively With Any Framework Or Library
  - title: Typed
    icon: ts
    details: Fully Typed, Ready To Rock 💚 
  - title: For Every Scale
    icon: 🚀
    details: From Weekend Hobby To Enterprise - WarpDrive Delivers
---

<script setup lang="ts">
import Home from '.vitepress/theme/homepage/home.vue';
</script>

<Home />
