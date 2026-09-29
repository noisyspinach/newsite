<script>
  import { cubicInOut } from "svelte/easing";
  import { root } from "./items.js";
  import "./menu.css";

  let path = $state([]);        // folders
  let dir = $state(1);          // 1 = zooming in, -1 = zooming out
  let locked = false;           

  const current = $derived(path.at(-1));
  const items = $derived(current?.children ?? root);

  function move(change, d) {
    if (locked) return;
    locked = true;
    dir = d;
    change();
    setTimeout(() => (locked = false), 650);
  }

  const enter = (folder) => move(() => path.push(folder), 1);
  const back = () => { if (path.length) move(() => path.pop(), -1); };

  function zoom(node, { from, delay = 0 }) {
    return {
      delay,
      duration: 450,
      easing: cubicInOut,
      // lovely, isn't it?
      css: (t) => `transform: scale(${from + (1 - from) * t}); opacity: ${t}`
    };
  }

  let mouseX = $state(0);
  let mouseY = $state(0);
  let hovering = $state(false);

  function updateCursor(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
  }
</script>

<svelte:window
  onmousemove={updateCursor}
  onkeydown={(e) => e.key === "Escape" && back()}
/>

  <div class="stage">
  <!-- svelte-ignore element_invalid_self_closing_tag -->
    <div
      class:filled={hovering}
      class="cursor"
      style:left={`${mouseX}px`}
      style:top={`${mouseY}px`}
    />

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
  {#key items}
    <div
      class="ring"
      style:--d={path.length}
      in:zoom={{ from: dir > 0 ? 0.5 : 2.4, delay: 150 }}
      out:zoom={{ from: dir > 0 ? 2.4 : 0.5 }}
    >

      {#each items as item, i}
        {#if item.children}
          <button class="b folder" style:--a={(i * 360) / items.length} onclick={() => enter(item)} onmouseenter={() => hovering = true} onmouseleave={() => hovering = false}>
            {item.name}
          </button>
        {:else}
          <a class="b" style:--a={(i * 360) / items.length} href={item.href} target="_blank" rel="noopener" onmouseenter={() => hovering = true} onmouseleave={() => hovering = false}>
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

