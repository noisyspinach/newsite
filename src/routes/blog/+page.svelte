<script>
  const modules = import.meta.glob('/src/posts/*.md', {
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

  const posts = Object.entries(modules)
    .map(([path, post]) => ({
      slug: path.split('/').pop().replace('.md', ''),
      ...post.metadata
    }))
    .sort((a, b) => new Date(b.date) - new Date(a.date));
</script>

<svelte:head>
  <title>Blog | noisyspinach</title>
  <meta
    name="description"
    content="Bro isn't it obvious what this is"
  />
</svelte:head>

<main class="blog">
  <a href="/">Home</a>

  <header>
    <h1>Blog</h1>
  </header>

  <hr />

  <section>
    {#each posts as post}
      <article>
        <time datetime={post.date}>
          {formatDate(post.date)}
        </time>

        <h2>
          <a href={`/blog/${post.slug}`}>
            {post.title}
          </a>
        </h2>

        <p>{post.description}</p>
      </article>

      <hr />
    {/each}
  </section>
</main>