# Graph Report - .  (2026-04-20)

## Corpus Check
- 16 files · ~0 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 48 nodes · 57 edges · 7 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `Common.ts` - 16 edges
2. `Paperback` - 11 edges
3. `Paperback.ts` - 7 edges
4. `MangaFreak` - 6 edges
5. `Settings.ts` - 6 edges
6. `MangaFreak.ts` - 4 edges
7. `searchRequest()` - 4 edges
8. `setStateData()` - 4 edges
9. `KomgaRequestInterceptor` - 4 edges
10. `setKomgaServerAddress()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `setStateData()` --calls--> `setKomgaServerAddress()`  [EXTRACTED]
  C:\Users\adinj\Documents\githubprojects\paperback_dev\extensions-main-promises\src\Paperback\Common.ts → C:\Users\adinj\Documents\githubprojects\paperback_dev\extensions-main-promises\src\Paperback\Common.ts  _Bridges community 5 → community 6_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.2
Nodes (4): Languages.ts, Paperback.ts, KomgaRequestInterceptor, parseMangaStatus()

### Community 1 - "Community 1"
Cohesion: 0.2
Nodes (1): Paperback

### Community 2 - "Community 2"
Cohesion: 0.22
Nodes (2): MangaFreak.ts, MangaFreak

### Community 3 - "Community 3"
Cohesion: 0.36
Nodes (5): Common.ts, getKomgaAPI(), getOptions(), getServerUnavailableMangaTiles(), searchRequest()

### Community 4 - "Community 4"
Cohesion: 0.4
Nodes (1): Settings.ts

### Community 5 - "Community 5"
Cohesion: 0.5
Nodes (4): createAuthorizationString(), setCredentials(), setOptions(), setStateData()

### Community 6 - "Community 6"
Cohesion: 1
Nodes (2): createKomgaAPI(), setKomgaServerAddress()

## Knowledge Gaps
- **Thin community `Community 6`** (2 nodes): `createKomgaAPI()`, `setKomgaServerAddress()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Common.ts` connect `Community 3` to `Community 5`, `Community 6`, `Community 2`, `Community 0`, `Community 4`?**
  _High betweenness centrality (0.678) - this node is a cross-community bridge._
- **Why does `Paperback.ts` connect `Community 0` to `Community 1`, `Community 4`, `Community 3`?**
  _High betweenness centrality (0.587) - this node is a cross-community bridge._
- **Why does `Paperback` connect `Community 1` to `Community 0`?**
  _High betweenness centrality (0.366) - this node is a cross-community bridge._