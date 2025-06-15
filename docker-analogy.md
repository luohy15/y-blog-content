# Docker -- An Introduction by Analogy

Original link: [Docker -- An Introduction by Analogy](https://hoblovski.github.io/2018/08/03/Docker-%E5%AE%9E%E7%94%A8%E7%B1%BB%E6%AF%94%E5%85%A5%E9%97%A8.html)

## Docker Usage

- Package applications and their required environments into independent images, simplifying dependency version control and deployment.
- Provide lightweight containers to improve service scalability.

## Container and Image

- An image is a template for a container. A container is a running instance of an image.
- A single image can have multiple containers running simultaneously.
- The relationship between an image and a container is analogous to the relationship between a program and a process.

## Analogy between Container and Program

Similar to:

```plaintext
               build              run
Dockerfile  ----------> image   --------> container
                  # analogous to #
               make               run
Makefile    ----------> program -------> process
```

## Commands

```bash
$ docker image pull IMAGE_NAME
```

Fetches a remote image to the local machine. Similar to `wget REMOTE_PROGRAM`. The `IMAGE_NAME` format is `NAME[:TAG]`. `TAG` refers to the version; if omitted, `NAME:latest` is used automatically.

```bash
$ docker image ls
```

Lists local images. Similar to `ls`.

```bash
$ docker image rm IMAGE_NAME
```

Removes a local image. Similar to `rm LOCAL_PROGRAM`.

```bash
$ docker container run [OPTS] IMAGE_NAME [COMMAND] [ARGS]
```
Creates a container to run the specified image. If the image is not available locally, Docker will download it.
Similar to `./PROGRAM`.
Common parameters include:
- `-p HOST_PORT:CONTAINER_PORT`: Maps network ports.
- `-v HOST_PATH:CONTAINER_PATH`: Maps directories.
- `-it`: Often used with `COMMAND` as `bin/bash` to open a shell in the container.

```bash
$ docker container ls
```

Lists all running containers. Similar to `ps aux`, but does not list "zombie processes" (see below).

```bash
$ docker container stop CONTAINER_ID
```

Sends SIGTERM to the container, then SIGKILL after a default of 10 seconds. Similar to `kill -15 PID`.

```bash
$ docker container kill CONTAINER_ID
```

Sends SIGKILL to the container. Similar to `kill -9 PID`.

```bash
$ docker container logs CONTAINER_ID
```

Observes the container's output. By default, container output is not displayed on the host.

Containers are not immediately deleted after they finish running; their exit codes and generated data files are retained. You can use `docker container import/export` to export data.

```bash
$ docker container ls -a
```

Lists all containers, including those that have finished running but have not yet been deleted. Similar to `ps aux`, including zombie processes (`<defunct>`). Another parameter is `-s`: lists container size. This usually refers to the size of modified/written files. Executing commands also increases size because it modifies `.xx_history`.

```bash
$ docker container run --rm IMAGE_NAME
```

Same as above, but automatically deletes the container after it finishes running. Similar to a detached fork.

```bash

$ docker container exec -it CONTAINER_ID /bin/bash
```

Opens a shell for a running container.

```bash
$ docker start CONTAINER_ID
```

Starts a container that has finished running but has not been deleted. Its data is preserved. This is less overhead than creating a new container.

```bash
$ docker attach CONTAINER_ID
```

Attaches input/output to the container. For example, if a container is running `sh`, you can connect to it via `attach`.

## Dockerfile

A Dockerfile describes the build process of an image, its components, etc. Use the command:

```bash
$ docker image build -t name:tag PATH
```

to build an image.

It consists of a series of instructions.

- `FROM IMAGE_NAME`: The base image on which this image is built. Common examples:
- `FROM scratch`: Starts an application from an empty image. Requires static compilation of the application as it doesn't even include libc.
- `FROM alpine:latest`: Starts an application from a distribution.
- `CMD COMMAND`: What command to run when the container starts.
- `ENTRYPOINT`: The command to run after the container starts.
- `COPY HOST_PATH CONTAINER_PATH`: Copies content from `HOST_PATH` on the host (relative to the `PATH` parameter of `docker image build`) to `CONTAINER_PATH` in the image.

## Layered View

A Docker image is composed of multiple layers, each representing a specific function. This layering is achieved through a file system internal to Docker. Each layer of an image is read-only, allowing multiple images to reuse the same layer.

Each instruction in a Dockerfile declares a layer in the image. Therefore, it's important to:

- Avoid splitting multiple commands into separate `RUN` instructions like a shell script. Instead, connect them with `&&` within a single `RUN`.
- Each layer should clean up its own garbage (a series of `rm` commands), because subsequent layers cannot clean up garbage from previous layers.

Otherwise, the image will become unnecessarily bloated.

A container is also composed of multiple layers. In fact, it adds a writable layer on top of its image. Writing is also done via COW (Copy-on-Write), because the underlying layers are read-only.

## Attach and Detach

Sometimes, we want to use a container's interactive service. The following workflow can be adopted:

- First, `run` in detached mode to make the container persistent. If a shell is needed (which is often the case), `interactive` and `tty` should also be added.
- When needed, `docker attach` to it.
- When finished, `detach`.
- Be extremely careful not to delete the container – all data will be lost.

Let's take KLEE as an example. KLEE can be installed in two ways: Docker and source code. The source code installation guide uses an ancient LLVM 3.4, which has been deprecated in LLVM apt for 16.04. KLEE states that manual compilation of LLVM 3.4 requires autoconf, not cmake. However, autoconf has long been abandoned by LLVM.

Given these issues with manual installation, I decided to use Docker. I won't go into `docker pull` etc. here.

1. Run a persistent container. Volume mapping might be needed for communication.

    ```bash
    $ docker container run -itd --ulimit='stack=-1:-1' --name="klee" klee/klee /bin/bash
    ```

    Sometimes you might accidentally type EOF or exit in bash. To prevent this, you can change it to:

    ```bash
    $ docker container run -itd --ulimit='stack=-1:-1' --name="klee" klee/klee /bin/bash -c 'while true; do bash; done'
    ```

2. When you need to run KLEE, `attach` to it. After attaching, you might need to press Enter a few times to get the bash prompt.

    ```bash
    $ docker container attach klee
    ```

3. To detach KLEE, use the default key combination `<C-P> <C-Q>`.

## Example

### Deploying Nginx

The official Nginx image is available on Dockerhub. We choose `nginx:1.15-alpine` because the Alpine version is smaller and has no loss in functionality.

```bash
$ docker pull nginx:1.15-alpine
$ docker container run -p 80:80 -d nginx:1.15-alpine
```

The `-d | --detach=true` flag is essential. Without a command, running `nginx -g 'daemon:off'` would prevent the container from running in the background.

Original link: [Docker -- An Introduction by Analogy](https://hoblovski.github.io/2018/08/03/Docker-%E5%AE%9E%E7%94%A8%E7%B1%BB%E6%AF%94%E5%85%A5%E9%97%A8.html)
