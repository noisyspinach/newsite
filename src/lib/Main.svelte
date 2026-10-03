<script>
  import { cubicInOut } from "svelte/easing";
  import { root } from "./items.js";
  import { Moon } from "@lucide/svelte";
  import "./all.css";

  let path = $state([]);
  let dir = $state(1);
  let locked = false;

  const current = $derived(path.at(-1));
  const items = $derived(current?.children ?? root);

  let dark = $state(false);

  function toggleTheme() {
    dark = !dark;
    document.documentElement.classList.toggle("dark", dark);
  }

  function move(change, d) {
    if (locked) return;

    locked = true;
    dir = d;
    change();

    setTimeout(() => {
      locked = false;
    }, 650);
  }

  const enter = (folder) => {
    move(() => path.push(folder), 1);
  };

  const back = () => {
    if (path.length) {
      move(() => path.pop(), -1);
    }
  };

  function zoom(node, { from, delay = 0 }) {
    return {
      delay,
      duration: 450,
      easing: cubicInOut,
      css: (t) =>
        `transform: scale(${from + (1 - from) * t}); opacity: ${t}`
    };
  }

  let mouseX = $state(0);
  let mouseY = $state(0);

  let rotation = $state(0);
  let targetRotation = 0;
  let animationFrame = null;

  function rotateMenu(event) {
    targetRotation += event.deltaY * 0.3;

    if (!animationFrame) {
      animationFrame = requestAnimationFrame(animateRotation);
    }
  }

  function animateRotation() {
    const diff = targetRotation - rotation;

    if (Math.abs(diff) < 0.01) {
      rotation = targetRotation;
      animationFrame = null;
      return;
    }

    rotation += diff * 0.08;

    animationFrame = requestAnimationFrame(animateRotation);
  }

  function updateCursor(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }
</script>

<svelte:window
  onmousemove={updateCursor}
  onkeydown={(e) => e.key === "Escape" && back()}
/>

<button
  class="theme-toggle"
  onclick={toggleTheme}
  aria-label="Toggle dark mode"
>
  <Moon size={24} />
</button>

<div class="stage">
  <div class="intro">
    <h1>hiya</h1>

    <p class="description">
      I'm <code>noisyspinach</code> although some people
      know me as simply <code>dotun</code>.
      I'm a developer and gamer.
      This is the bit where lorem ipsum goes because I don't
      know what to put here
    </p>
  </div>

  <div class="menu-area" onwheel={rotateMenu}>
    {#key items}
      <div
        class="ring"
        style:--d={path.length}
        in:zoom={{ from: dir > 0 ? 0.5 : 2.4, delay: 150 }}
        out:zoom={{ from: dir > 0 ? 2.4 : 0.5 }}
      >
        {#each items as item, i}
          {#if item.children}
            <button
              class="b folder"
              style:--a={(i * 360) / items.length + rotation}
              onclick={() => enter(item)}
            >
              {item.name}
            </button>
          {:else}
            <a
              class="b"
              style:--a={(i * 360) / items.length + rotation}
              href={item.href}
              target={item.href.startsWith("http") ? "_blank" : undefined}
              rel={item.href.startsWith("http") ? "noopener" : undefined}
            >
              {item.name}
            </a>
          {/if}
        {/each}
      </div>
    {/key}

    <div class="center">
      <div>{current?.name ?? "Home"}</div>

      {#if path.length}
        <button onclick={back}>Back</button>
      {/if}
    </div>
  </div>
</div>