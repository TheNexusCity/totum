# Metaverse Loader/Codec
## Woader? Moader? Moadec.

This library takes an arbitrary URL (https://, ethereum://, and more) and compiles it into a THREE.js app representing it, written against the Metaversefile API. 

You can use this library to translate your avatars, models, NFTs, web pages (and more) into a collection of `import()`-able little web apps which interoperate with each other.

The metaverse loader is intended to be driven by a plugin engine (like vite.js/rollup.js), and game engine (like Webaverse) to provide a complete immersive world (or metaverse) to the user.

It is easy to define your own data types and NFT interpretations by writing your own app template. If you would like to support a new file format or Ethereum Token, we would appreciate a PR.

Although this library does not provide game engine facilities, the API is designed to be easy to hook into game engines, and to be easy to drive using AIs like OpenAI's Codex.
