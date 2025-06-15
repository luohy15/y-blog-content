# Drone CI Usage

Drone is a CI tool with native Docker support. Compared to Jenkins, it's more lightweight, and the development and debugging of pipelines and plugins (YAML, Python, Go, Bash) are much more comfortable than Jenkins' pipeline syntax and Groovy.

## Deployment

### Server

1. Create an OAuth application on the code hosting platform to get the ID and Secret.
2. Use a 16-character random string as the RPC Secret.
3. Configure the Server with the above information and domain protocol.

### Runner

1. Configure the RPC Secret and the Server's domain protocol.
2. Configure K8s operation permissions (if using K8s Runner).

For specific details, refer to the [Deployment Operations Documentation](https://docs.drone.io/server/overview/).

## Image Usage and Writing

A typical image is [plugins/docker](plugins/docker): supports docker-in-docker builds, then uploads to the image registry.

```yaml
kind: pipeline
name: default

steps:
- name: docker
  image: plugins/docker
  settings:
    username: xxx
    password: yyy
    registry: example.com
    repo: example.com/foo/bar
    tags: latest
```

Drone will convert the keys in the `settings` field to uppercase and prepend `PLUGIN_` as environment variables passed to the container. So the pipeline above is actually equivalent to:

```yaml
kind: pipeline
name: default

steps:
- name: docker
  image: plugins/docker
  environment:
    PLUGIN_USERNAME: xxx
    PLUGIN_PASSWORD: yyy
    PLUGIN_REGISTRY: example.com
    PLUGIN_REPO: example.com/foo/bar
    PLUGIN_TAGS: latest
```

We use Go/Bash to receive these environment variables and implement the target logic. After debugging, we integrate it into the pipeline (much better development and debugging experience than Jenkins).

## Centralized Pipeline Management and Reuse

If you maintain pipelines for multiple projects simultaneously, you'll find that the maintenance cost is too high, and there's redundancy between pipelines. To practice DRY / KISS principles, consider adding support for centralized pipeline management and reuse.

Drone's [Configuration Extension](https://docs.drone.io/extensions/conversion/) supports:

1. Sending an HTTP request to a specified service to get the pipeline definition (YAML string).
2. If the request is successful (returns 200), parse and run it.
3. If the request fails (returns 204), use the default `.drone.yml`.

So I [implemented](https://github.com/luohy15/drone-pipelines) a simple HTTP service for centralized management, which also supports template replacement for module reuse.

## References

jia.je's experimental records: https://jia.je/devops/2020/04/21/k8s-drone-ci/

Drone Plugin Documentation: https://docs.drone.io/plugins/overview/

Drone Centralized Pipeline Management Documentation: https://zhuanlan.zhihu.com/p/77215200

Example Repository: https://github.com/spainer/drone-configuration-repository
