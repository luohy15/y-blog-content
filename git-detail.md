# Git Details

## Some Interesting Questions

1. What happens during init/clone/add/commit/push?
2. Does `amend + push -f` really delete sensitive history?

## Core Concepts

What is Git: Git is a **content-addressable file system**, and on top of that, it provides a user interface for a **version control system**.

Git directly records snapshots rather than performing diff comparisons.

![](https://git-scm.com/book/en/v2/images/snapshots.png)

If a file is not modified, Git does not re-store the file, but it re-stores the pointer to that file.

If a file is modified, Git re-stores the new file, but it compresses the overall size by packing (the latest version saves the complete content, historical versions only save differences).

## Directory Structure

```bash
.git
├── COMMIT_EDITMSG
├── HEAD # Current pointer
├── config
├── description
├── hooks
├── index # Staging area information
├── info
├── logs
├── objects # All data
├── packed-refs
└── refs # Stores reference files
```

## Data Types

top-down: ref, commit, tree, blob

{{< rawhtml >}}

<img src="https://git-scm.com/book/en/v2/images/data-model-4.png"  />{{< /rawhtml >}}

## Low-level Commands

### Storing Files

```bash
git hash-object -w filename
```

Outputs a 40-character hexadecimal checksum: the first 2 characters as the directory name, the last 38 as the file name.

Implementation details: The data to be stored (content) plus header information are SHA-1 digested to get this checksum, then the file is compressed with zlib and stored.

### Viewing Files

```bash
git cat-file -p checksum
```

Outputs file content.

```bash
git cat-file -t checksum
```

Outputs the type of data: blob, tree, commit.

### Staging Area

```bash
git update-index --add --cacheinfo 100644 checksum filename
```

Adds a file to the staging area.

```bash
git write-tree
```

Writes the content of the staging area to a tree object.

### Committing

```bash
git commit-tree tree_checksum
```

Gets a commit.

### References

```bash
git update-ref reference_filename checksum
```

Gets a reference (branch/tag).

## Answering Questions

Q: What happens during init/clone/add/commit/push?

A: During `init`, Git creates the `.git` directory, which contains the HEAD file, objects directory, and refs directory, etc.

   During `clone` (smart protocol), Git calls the server's `upload-pack` process, then uses the `fetch-pack` program to retrieve data.

   During `add`, the file is added to the staging area (index file).

   During `commit`, the content of the staging area is written to a tree object and the tree object is committed, while also updating refs and HEAD.

   During `push` (smart protocol), Git calls the server's `receive-pack` process, and uses the `send-pack` program to compare and transfer data not present on the server.

Q: Does `amend + push -f` really delete sensitive history?

A: After testing, the local `objects` directory still contains data after `amend`, but if you re-pull remotely after `push -f`, these objects are gone. So, it can be considered that sensitive records are deleted.
