<script setup lang="ts">
import { createHighlighter } from "shiki";
import { ShikiMagicMove } from "shiki-magic-move/vue";
import { ref } from "vue";
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
import { Request } from '@warp-drive/ember';
import { findRecord } from '@warp-drive/utilities/rest';

export default class MyComponent extends Component {
  @service store;

  get request() {
    return this.store.request(findRecord("user", this.args.userId));
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
    return this.store.request(findRecord("user", this.args.userId));
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
  ],
};

const highlighter = await createHighlighter({
  themes: ["aurora-x"],
  langs: ["javascript", "typescript", "glimmer-ts"],
});

console.log("Highlighter created:", highlighter);

const code = ref(steps.ember[0]);
const selectedFramework = ref<keyof typeof steps>("ember");

function animate() {
  code.value = steps[selectedFramework.value][1];
}

function animate2() {
  code.value = steps[selectedFramework.value][2];
}

function reset() {
  code.value = steps[selectedFramework.value][0];
}

function changeFramework(framework: keyof typeof steps) {
  selectedFramework.value = framework;
  reset();
}
</script>

<template>
  <div class="code-example">
    <ShikiMagicMove
      lang="glimmer-ts"
      theme="aurora-x"
      :highlighter="highlighter"
      :code="code.code"
      :options="{ duration: 800, stagger: 0.3, lineNumbers: true }"
    />
    <button @click="animate">Animate</button>
    <button @click="animate2">Animate 2</button>
    <button @click="reset">Reset</button>
    <select v-model="selectedFramework" @change="changeFramework(selectedFramework)">
      <option value="ember">Ember</option>
      <option value="react">React</option>
    </select>
  </div>
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
</style>
