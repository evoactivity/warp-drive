<script setup lang="ts">
import { createHighlighter } from "shiki";
import { ShikiMagicMove } from "shiki-magic-move/vue";
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import "shiki-magic-move/dist/style.css";

const steps = {
  ember: [
    {
      title: "Create your store",
      description: "Create a recommended store instance for your application.",
      code: `import { useRecommendedStore } from '@warp-drive/core';

export default useRecommendedStore();`,
    },
    {
      title: "Create a request",
      description: "Create a request using WarpDrive's request utilities.",
      code: `import Component from '@glimmer/component';
import { findRecord } from '@warp-drive/utilities/rest';

export default class MyComponent extends Component {
  @service store;

  get request() {
    const requestOptions = findRecord("user", this.args.userId);
    return this.store.request(requestOptions);
  }
}`,
    },
    {
      title: "Use the request in a component",
      description: "Use the request in your Ember component with the Request component.",
      code: `import Component from '@glimmer/component';
import { Request } from '@warp-drive/ember';
import { findRecord } from '@warp-drive/utilities/rest';

export default class MyComponent extends Component {
  @service store;

  get request() {
    const requestOptions = findRecord("user", this.args.userId);
    return this.store.request(requestOptions);
  }

  <template>
    <Request @request={{this.request}}>
      <:content as |result|>
        Hello {{result.data.name}}!
      </:content>

      <:loading>Loading...</:loading>
    </Request>
  </template>
}`,
    },
  ],
  react: [
    {
      title: "Create your store",
      description: "Create a recommended store instance for your application.",
      code: `import { StoreProvider } from '@warp-drive/react';
import { Store } from './store.ts';
import { UserList } from './user-list.tsx';

export function App(props) {
  return (
    <div className='App'>
      <StoreProvider @Store={Store}>
        <h1>Hello React!</h1>
        <UserList />
      </StoreProvider>
    </div>
  );
}`,
    },

    {
      title: "Create a request",
      description: "Create a request using WarpDrive's request utilities.",
      code: `import { Request } from '@warp-drive/react';
import { listUsers } from './api.ts';

export function UserList() {
  return (
    <Request
      query={listUsers()}
      states={{
        loading: ({ state }) => <div>Loading Users...</div>,
        error: ({ error, features }) => (
          <div>
            <p>Error: {error.message}</p>
            <p><button onClick={features.retry}>Try Again?</button></p>
          </div>
        ),
        content: ({ result, features }) => (
          <ul>
            {result.data.map(user => <li>{user.name}</li>)}
          </ul>
        ),
      }}
    />
  );
}`,
    },
    {
      title: "Add real-time updates",
      description: "Subscribe to live data changes and keep your UI in sync automatically.",
      code: `import { Request } from '@warp-drive/react';
import { listUsers } from './api.ts';

export function UserList() {
  return (
    <Request
      query={listUsers()}
      subscribe={true}
      states={{
        loading: ({ state }) => <div>Loading Users...</div>,
        error: ({ error, features }) => (
          <div>
            <p>Error: {error.message}</p>
            <p><button onClick={features.retry}>Try Again?</button></p>
          </div>
        ),
        content: ({ result, features }) => (
          <div>
            <ul>
              {result.data.map(user => <li>{user.name}</li>)}
            </ul>
            <button onClick={features.refresh}>Refresh</button>
          </div>
        ),
      }}
    />
  );
}`,
    },
  ],
};

const highlighter = await createHighlighter({
  themes: ["aurora-x"],
  langs: ["javascript", "typescript", "glimmer-ts"],
});

const code = ref(steps.ember[0]);
const selectedFramework = ref<keyof typeof steps>("ember");
const activeStep = ref(0);
const stepsContainer = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

function createObserver() {
  observer?.disconnect();

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const index = Number(entry.target.getAttribute("data-step-index"));
        if (isNaN(index)) continue;
        activeStep.value = index;
        code.value = steps[selectedFramework.value][index];
      }
    },
    {
      rootMargin: "0px 0px -20% 0px",
      threshold: 0.01,
    }
  );

  if (stepsContainer.value) {
    const stepEls = stepsContainer.value.querySelectorAll(".step-content");
    for (const el of stepEls) {
      observer.observe(el);
    }
  }
}

function changeFramework(framework: keyof typeof steps) {
  selectedFramework.value = framework;
  activeStep.value = 0;
  code.value = steps[framework][0];
  nextTick(() => createObserver());
}

onMounted(() => {
  nextTick(() => createObserver());
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<template>
  <section class="code-example">
    <div class="code-layout">
      <div class="code-panel">
        <div class="tabs">
          <button
            v-for="(_, framework) in steps"
            :key="framework"
            class="tab"
            :class="{ active: selectedFramework === framework }"
            @click="changeFramework(framework as keyof typeof steps)"
          >
            {{ framework.charAt(0).toUpperCase() + framework.slice(1) }}
          </button>
        </div>
        <div class="code-box">
          <ShikiMagicMove
            lang="glimmer-ts"
            theme="aurora-x"
            :highlighter="highlighter"
            :code="code.code"
            :options="{ duration: 300, stagger: 0.3, lineNumbers: true, containerStyle: false }"
          />
        </div>
      </div>

      <div ref="stepsContainer" class="steps-panel">
        <div
          v-for="(step, index) in steps[selectedFramework]"
          :key="`${selectedFramework}-${index}`"
          class="step"
          :class="{ active: activeStep === index }"
        >
          <div :data-step-index="index" class="step-content">
            <div class="step-number">{{ index + 1 }}</div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.code-example {
  margin: 0 auto;
  max-width: 1344px;
  padding: 3rem 2rem;

  @media (min-width: 980px) {
    padding: 5rem 4rem;
  }
}

/* Two-column layout */
.code-layout {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media (min-width: 980px) {
    flex-direction: row;
    gap: 2rem;
  }
}

/* Code panel - sticky (tabs + code box) */
.code-panel {
  min-width: 0;
  background: #0b0411;
  border: 1px solid rgb(234 150 255 / 20%);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 230px -110px #ff00d6;
  position: sticky;
  top: 5rem;
  width: 100%;
  height: 40vh;
  display: flex;
  flex-direction: column;
  z-index: 1;
  flex-shrink: 0;

  @media (min-width: 980px) {
    flex: 1 1 70%;
    width: auto;
    top: 15rem;
    height: calc(100vh - 28rem);
    align-self: flex-start;
  }
}

/* Tabs */
.tabs {
  display: flex;
  border-bottom: 1px solid rgb(234 150 255 / 20%);
}

.tab {
  padding: 0.4rem 1rem;
  background: transparent;
  border: none;
  border-right: 1px solid rgb(234 150 255 / 20%);
  color: #a98c88;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    color 0.2s ease,
    background 0.2s ease;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;

  &:hover {
    color: #ffc474;
    background: rgb(255 196 116 / 5%);
  }

  &.active {
    color: #ffc474;
    background: #e42d37;
  }
}

.code-box {
  overflow: auto;
  flex: 1;
  min-height: 0;
  padding: 1rem;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  pre {
    margin: 0;
    font-size: 14px;
  }
}

/* Steps panel */
.steps-panel {
  flex: 1 1 40%;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.step {
  min-height: 50vh;
  transition: opacity 0.3s ease;
  opacity: 0.4;

  @media (min-width: 980px) {
    min-height: 80vh;
  }

  &:last-child {
    min-height: 0;

    @media (min-width: 980px) {
      min-height: 80vh;
    }
  }

  &.active {
    opacity: 1;
  }
}

.step-content {
  .step-number {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    background: rgb(234 150 255 / 10%);
    border: 1px solid rgb(234 150 255 / 20%);
    color: #ffc474;
    font-size: 0.8rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    font-family:
      "cantarell", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
      "Noto Color Emoji";
  }

  h3 {
    font-family:
      "cantarell", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
      "Noto Color Emoji";
    font-size: 1.25rem;
    font-weight: 700;
    color: #ffc474;
    margin: 0 0 0.5rem;
  }

  p {
    color: #a98c88;
    font-size: 1rem;
    line-height: 1.6;
    margin: 0;
  }
}
</style>
