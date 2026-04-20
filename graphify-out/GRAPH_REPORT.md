# Graph Report - .  (2026-04-20)

## Corpus Check
- 28 files · ~0 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 287 nodes · 433 edges · 24 communities detected
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## God Nodes (most connected - your core abstractions)
1. `index.js` - 87 edges
2. `source.js` - 87 edges
3. `Common.ts` - 24 edges
4. `Paperback` - 11 edges
5. `Paperback` - 11 edges
6. `Paperback` - 11 edges
7. `from()` - 9 edges
8. `from()` - 9 edges
9. `MangaFreak` - 7 edges
10. `MangaFreak` - 7 edges

## Surprising Connections (you probably didn't know these)
- `buildMangaUrl()` --calls--> `normalizeMangaId()`  [EXTRACTED]
  C:\Users\adinj\Documents\githubprojects\paperback_dev\extensions-main-promises\src\WeebCentral\Common.ts → C:\Users\adinj\Documents\githubprojects\paperback_dev\extensions-main-promises\src\MangaFreak\Common.ts

## Communities

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (8): index.js, checkIEEE754(), getKomgaAPI(), getOptions(), getServerUnavailableMangaTiles(), searchRequest(), writeDouble(), writeFloat()

### Community 1 - "Community 1"
Cohesion: 0.07
Nodes (8): source.js, checkIEEE754(), getKomgaAPI(), getOptions(), getServerUnavailableMangaTiles(), searchRequest(), writeDouble(), writeFloat()

### Community 2 - "Community 2"
Cohesion: 0.08
Nodes (5): MangaFreak, Paperback, parseChapterList(), parseMangaDetails(), Source

### Community 3 - "Community 3"
Cohesion: 0.08
Nodes (5): MangaFreak, Paperback, parseChapterList(), parseMangaDetails(), Source

### Community 4 - "Community 4"
Cohesion: 0.09
Nodes (5): Paperback.ts, KomgaRequestInterceptor, Paperback, parseMangaStatus(), Settings.ts

### Community 5 - "Community 5"
Cohesion: 0.14
Nodes (13): Common.ts, buildMangaUrl(), createAuthorizationString(), createKomgaAPI(), getKomgaAPI(), getOptions(), getServerUnavailableMangaTiles(), normalizeMangaId() (+5 more)

### Community 6 - "Community 6"
Cohesion: 0.17
Nodes (12): asciiSlice(), base64Slice(), decodeCodePointsArray(), encodeChunk(), fromByteArray(), hexSlice(), latin1Slice(), slowToString() (+4 more)

### Community 7 - "Community 7"
Cohesion: 0.27
Nodes (12): alloc(), allocUnsafe(), assertSize(), Buffer(), checked(), createBuffer(), from(), fromArrayBuffer() (+4 more)

### Community 8 - "Community 8"
Cohesion: 0.17
Nodes (12): asciiSlice(), base64Slice(), decodeCodePointsArray(), encodeChunk(), fromByteArray(), hexSlice(), latin1Slice(), slowToString() (+4 more)

### Community 9 - "Community 9"
Cohesion: 0.27
Nodes (12): alloc(), allocUnsafe(), assertSize(), Buffer(), checked(), createBuffer(), from(), fromArrayBuffer() (+4 more)

### Community 10 - "Community 10"
Cohesion: 0.2
Nodes (5): Languages.ts, MangaFreak.ts, MangaFreak, parseChapterList(), parseMangaDetails()

### Community 11 - "Community 11"
Cohesion: 0.22
Nodes (9): asciiToBytes(), asciiWrite(), base64Write(), blitBuffer(), latin1Write(), ucs2Write(), utf16leToBytes(), utf8ToBytes() (+1 more)

### Community 12 - "Community 12"
Cohesion: 0.22
Nodes (9): asciiToBytes(), asciiWrite(), base64Write(), blitBuffer(), latin1Write(), ucs2Write(), utf16leToBytes(), utf8ToBytes() (+1 more)

### Community 13 - "Community 13"
Cohesion: 0.25
Nodes (3): WeebCentral.ts, parseMangaDetails(), WeebCentral

### Community 14 - "Community 14"
Cohesion: 0.4
Nodes (6): base64clean(), base64ToBytes(), byteLength(), getLens(), isInstance(), toByteArray()

### Community 15 - "Community 15"
Cohesion: 0.33
Nodes (6): createAuthorizationString(), createKomgaAPI(), setCredentials(), setKomgaServerAddress(), setOptions(), setStateData()

### Community 16 - "Community 16"
Cohesion: 0.4
Nodes (6): base64clean(), base64ToBytes(), byteLength(), getLens(), isInstance(), toByteArray()

### Community 17 - "Community 17"
Cohesion: 0.33
Nodes (6): createAuthorizationString(), createKomgaAPI(), setCredentials(), setKomgaServerAddress(), setOptions(), setStateData()

### Community 18 - "Community 18"
Cohesion: 0.5
Nodes (4): arrayIndexOf(), bidirectionalIndexOf(), hexWrite(), numberIsNaN()

### Community 19 - "Community 19"
Cohesion: 0.5
Nodes (4): arrayIndexOf(), bidirectionalIndexOf(), hexWrite(), numberIsNaN()

### Community 20 - "Community 20"
Cohesion: 0.5
Nodes (1): KomgaRequestInterceptor

### Community 21 - "Community 21"
Cohesion: 0.5
Nodes (1): KomgaRequestInterceptor

### Community 22 - "Community 22"
Cohesion: 1
Nodes (1): Tracker

### Community 23 - "Community 23"
Cohesion: 1
Nodes (1): Tracker

## Knowledge Gaps
- **Thin community `Community 22`** (2 nodes): `Tracker`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.
- **Thin community `Community 23`** (2 nodes): `Tracker`, `.constructor()`
  Too small to be a meaningful cluster - may be noise or needs more connections extracted.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `index.js` connect `Community 0` to `Community 2`, `Community 22`, `Community 14`, `Community 6`, `Community 7`, `Community 18`, `Community 11`, `Community 15`, `Community 20`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **Why does `source.js` connect `Community 1` to `Community 3`, `Community 23`, `Community 16`, `Community 8`, `Community 9`, `Community 19`, `Community 12`, `Community 17`, `Community 21`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **Why does `Common.ts` connect `Community 5` to `Community 10`, `Community 4`, `Community 13`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.08 - nodes in this community are weakly interconnected._