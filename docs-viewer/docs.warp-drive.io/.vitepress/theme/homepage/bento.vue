<script setup>
import Starfield from "./starfield.vue";
</script>

<style scoped lang="postcss">
.bento {
  display: flex;
  flex-direction: column;
  max-width: 1344px;
  width: 100%;
  margin: 0 auto;
  padding: 0 2rem;

  gap: 16px 16px;

  @media (min-width: 640px) {
    display: grid;
    grid-template-areas:
      "a b"
      "c d"
      "e f";
  }

  @media (min-width: 980px) {
    padding: 0 4rem;
    grid-template-columns: repeat(10, 1fr);
    grid-template-areas:
      "a a a a b b b b b b"
      "c c d d d d f f f f"
      "e e e e e e f f f f";
  }
}
.a {
  grid-area: a;
}
.b {
  grid-area: b;
}
.c {
  grid-area: c;
}
.d {
  grid-area: d;
}
.e {
  grid-area: e;
}
.f {
  grid-area: f;
}

.box {
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  isolation: isolate;
  background: #230724;
  border-radius: 1rem;
  flex: none;
  order: 0;
  flex-grow: 0;
  padding: 2.5rem;
  color: #a98c88;
  font-size: 1.125rem;
  overflow: hidden;
  text-wrap: balance;
  text-align: center;

  @media (min-width: 980px) {
    text-align: left;
  }

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    padding: 1px;
    background: linear-gradient(to bottom, rgb(234 150 255 / 20%), rgb(87 40 89 / 100%));
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask-composite: exclude;
    pointer-events: none;
    z-index: -1;
  }

  &::after {
    content: "";
    position: absolute;
    pointer-events: none;
    inset: 0;
    box-shadow: inset 0px 0px 148px rgb(167 115 167 / 25%);
  }

  h2 {
    font-family:
      "cantarell", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
      "Noto Color Emoji";
    font-size: 1.5rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 0 0 0.5rem;
    color: #ffc474;
    width: 100%;
  }
}

.tagline {
  padding: 40% 0 0 0;
  order: 6;
  box-shadow: inset 0px 0px 148px rgb(167 115 167 / 25%);

  @media (min-width: 980px) {
    padding: 100% 0 0 0;
  }

  &::after {
    all: initial;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: tagline 4s linear infinite;
    content: "Boldy";
    font-family:
      "Syncopate", ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
      "Noto Color Emoji";
    color: #6b2d68;
    font-size: 2.5rem;
    font-weight: 900;
    text-align: center;
    width: 100%;

    @media (min-width: 980px) {
      font-size: clamp(1.4rem, 2vw, 2.5rem);
    }
  }

  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.typed {
  padding-top: 4.5rem;
  padding-bottom: 280px;

  span:nth-of-type(1) {
    color: #8e5399;
  }

  span:nth-of-type(2) {
    color: #ff8a00;
  }

  img {
    position: absolute;
    bottom: -10%;
    left: 50%;
    transform: translateX(-50%);
    max-width: initial;
    display: block;
    box-shadow: 0 4px 44px 16px rgb(0 0 0 / 25%);
  }
}

.universal {
  padding-top: 20%;
  text-align: center;

  .logos {
    position: absolute;
    pointer-events: none;
    width: 114%;
    top: 0;
    left: 0;
    padding-top: 100%;
    transform: translate3d(-8%, -8%, 0);
    z-index: -1;

    &::before,
    &::after {
      content: "";
      position: absolute;
      top: 0;
      right: 0;
      font-size: 1.5rem;
      background: url("./framework-logos.svg") no-repeat;
      background-size: contain;
      width: 100%;
      height: 100%;
    }

    &::before {
      margin-top: 4%;
      filter: blur(40px);
    }
  }
}

.sources {
  img {
    margin: 0 auto -60%;
  }
}

.speed {
  img {
    box-shadow: 0 4px 44px 16px rgb(0 0 0 / 25%);
    width: calc(100% + 2.5rem);
    max-width: initial;
    margin: -2.5rem 0 2.5rem 0;
  }
}

.workload {
  padding-top: 16rem;
  padding-bottom: 4.5rem;

  @media (min-width: 980px) {
    padding-top: 4.5rem;
    padding-right: 6rem;
  }

  img {
    mix-blend-mode: screen;
    opacity: 0.5;
    position: absolute;
    pointer-events: none;
    right: 0;
    top: 0;
    bottom: 0;

    @media (min-width: 980px) {
    }
  }
}

@keyframes tagline {
  0% {
    content: "Boldly";
  }
  13% {
    content: "Go";
  }
  21% {
    content: "Where";
  }
  31% {
    content: "No";
  }
  41% {
    content: "App";
  }
  51% {
    content: "Has";
  }
  61% {
    content: "Gone";
  }
  71% {
    content: "Before";
  }
  95% {
    content: "Before";
  }
  100% {
    content: "Boldly";
  }
}
</style>

<template>
  <section class="bento">
    <div class="a box sources">
      <h2>Source Agnostic</h2>
      <p>
        Support for any API format. Mix and match standard APIs like JSON:API, GraphQL, tRPC or write a completely
        bespoke handler.
      </p>
      <img src="./sources.png" width="395" height="505" alt="Multiple API sources logos" />
    </div>
    <div class="b box speed">
      <img src="./network.png" width="1260" height="337" alt="Network performance graph" />
      <h2>Light Speed Performance</h2>
      <p>
        WarpDrive provides an out the box caching system suitable for most apps, you can be sure you are only hitting
        the network as required.
      </p>
    </div>
    <div class="c box tagline">
      <Starfield :speed="0.5" :enable-scroll-speed="false" :trail-length="0.004" :max-fps="60" />
    </div>
    <div class="d box universal">
      <div class="logos"></div>
      <h2>Universal</h2>
      <p>An unmatched data experience now available everywhere you write Javascript.</p>
    </div>
    <div class="e box workload">
      <h2>Reduce the Workload</h2>
      <p>
        Why make the same requests across tabs and windows? WarpDrive will make a request once and share it between all
        instances of your app.
      </p>
      <img src="./workload.png" width="415" height="740" alt="" />
    </div>
    <div class="f box typed">
      <h2><span>let</span> data: <span>BeTyped</span>;</h2>
      <p>
        Working with JSON shouldn’t be a guessing game. Your requests are fully typed so you know exactly what you’re
        working with.
      </p>
      <img src="./types.png" width="602" height="271" alt="TypeScript code example" />
    </div>
  </section>
</template>
