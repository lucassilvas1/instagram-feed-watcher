# TypeScript Instagram Feed Scraper

A TypeScript library for scraping Instagram feeds.

## Installation

```bash
npm install instagram-feed-scraper
```

## Usage

```javascript
const { Watcher } = require("instagram-feed-scraper");

// Optional: Provide configuration options
const options = {
  userAgent: "Custom User Agent",
  cookieFilePath: "/path/to/your/cookies.txt", // Where to store session cookies (default: "../resources/cookies.txt")
  pollingInterval: [54_000, 72_000], // Time between each feed refresh (default: [54_582, 71_845])
  maxRetries: 3, // Maximum number of retries before crashing (default: 3)
  retryCooldown: [7000, 14_000], // Time between retries (default: [7352, 13_791])
};

const watcher = new Watcher(username, password, options); // Create a new Watcher instance

// Watch for new posts
const stopWatching = watcher.watch((post) => {
  // This callback will be called whenever a new post is found
  console.log(post);
});

// Or just retrieve the first 4 posts from the Following feed
watcher.get().then((posts) => {
  posts.forEach((post) => {
    console.log(post); // Access posts
  });
});

stopWatching(); // Remove listener

watcher.destroy(); // Remove all listeners and stop refreshing feed
```

## API Reference

### `Watcher`

#### `constructor(username: string, password: string, options?: Partial<WatcherOptions>): Watcher`

Creates a new `Watcher` instance.

- `username`: Your Instagram username.
- `password`: Your Instagram password.
- `options` (optional): Configuration options.

#### `get(): Promise<Post[]>`

Retrieves the first 4 posts from the Following feed.

Returns an array of posts.

#### `watch(listener: (post: Post) => void): () => void`

Calls `listener` for every new post found.

- `listener`: Function to be called whenever a new post is found.

Returns a function that removes the `listener`.

### `destroy(): void`

Remove all watchers and stop refreshing feed
