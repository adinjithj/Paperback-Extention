# Graph Report - .  (2026-04-19)

## Corpus Check
- 8 files · ~0 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 38 nodes · 47 edges · 7 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `Common.ts` - 14 edges
2. `Paperback` - 11 edges
3. `Paperback.ts` - 7 edges
4. `Settings.ts` - 6 edges
5. `searchRequest()` - 4 edges
6. `setStateData()` - 4 edges
7. `KomgaRequestInterceptor` - 4 edges
8. `setKomgaServerAddress()` - 3 edges
9. `setCredentials()` - 3 edges
10. `getServerUnavailableMangaTiles()` - 2 edges

## Surprising Connections (you probably didn't know these)
- `setStateData()` --calls--> `setCredentials()`  [EXTRACTED]
  C:\Users\adinj\Documents\githubprojects\paperback_dev\extensions-main-promises\src\Paperback\Common.ts → C:\Users\adinj\Documents\githubprojects\paperback_dev\extensions-main-promises\src\Paperback\Common.ts  _Bridges community 4 → community 5_

## Communities

### Community 0 - "Community 0"
Cohesion: 0.2
Nodes (1): Paperback

### Community 1 - "Community 1"
Cohesion: 0.25
Nodes (3): Languages.ts, Paperback.ts, KomgaRequestInterceptor

### Community 2 - "Community 2"
Cohesion: 0.43
Nodes (5): Common.ts, getKomgaAPI(), getOptions(), getServerUnavailableMangaTiles(), searchRequest()

### Community 3 - "Community 3"
Cohesion: 0.4
Nodes (1): Settings.ts

### Community 4 - "Community 4"
Cohesion: 0.5
Nodes (4): createKomgaAPI(), setKomgaServerAddress(), setOptions(), setStateData()

### Community 5 - "Community 5"
Cohesion: 1
Nodes (2): createAuthorizationString(), setCredentials()

### Community 6 - "Community 6"
Cohesion: 1
Nodes (1): parseMangaStatus()

## Knowledge Gaps
- **Thin community `Community 5`** (2 nodes): `createAuthorizationString()`, `setCredentials()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 6`** (2 nodes): `.getMangaDetails()`, `parseMangaStatus()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Paperback.ts` connect `Community 1` to `Community 6`, `Community 0`, `Community 3`, `Community 2`?**
  _High betweenness centrality (0.668) - this node is a cross-community bridge._
- **Why does `Common.ts` connect `Community 2` to `Community 4`, `Community 5`, `Community 1`, `Community 3`?**
  _High betweenness centrality (0.532) - this node is a cross-community bridge._
- **Why does `Paperback` connect `Community 0` to `Community 1`, `Community 6`?**
  _High betweenness centrality (0.452) - this node is a cross-community bridge._