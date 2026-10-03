<script>
  import { page } from "$app/state";

  const posts = import.meta.glob("/src/posts/*.md", {
    eager: true
  });

  function formatDate(dateString) {
    const date = new Date(dateString);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[date.getUTCDay()];
    const dayNum = date.getUTCDate();
    const monthName = months[date.getUTCMonth()];
    
    const suffix = (n) => {
      if (n > 3 && n < 21) return 'th';
      switch (n % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
      }
    };
    
    return `${dayName} ${dayNum}${suffix(dayNum)} ${monthName}`;
  }

  const post = $derived(
    posts[`/src/posts/${page.params.slug}.md`]
  );
</script>

<svelte:head>
  <title>
    {post?.metadata?.title ?? "Not found"} | noisyspinach
  </title>

  {#if post?.metadata?.description}
    <meta
      name="description"
      content={post.metadata.description}
    />
  {/if}
</svelte:head>

<main class="post">
  <a href="/blog">Blog</a>

  {#if post}
    {@const Post = post.default}

    <article>
      <time datetime={post.metadata.date}>
        {formatDate(post.metadata.date)}
      </time>


      <div class="content">
        <Post />
      </div>
    </article>
  {:else}
    <h1>Post not found</h1>
  {/if}
</main>