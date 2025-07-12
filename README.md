# The Ceaseless Watcher

Awesomesauce swag discord bot that shows you info about your infra and more!!!

## Installation

### With Docker

#### Docker Compose

See the provided [compose.yml](compose.yml) file for sample configuration.

```bash
docker compose up -d
```

### With Podman

shoutout ^^^

#### Podman Compose

```bash
podman compose up -d
```

<!-- ### Kubernetes

#### Helm -->

### Manual

Manual installation is not recommended, but if you want to do it anyway, follow the steps for manual building from the [Development](#development) section below.

## Development

### Prerequisites

- Clone the repository:

    ```bash
    git clone https://github.com/Hellspawn-Corp/Watcher.git
    ```

- For containerized development, install Docker or Podman.
- For manual development, install Node.js (or compatible runtime) and pnpm.

### Building

#### Build with Docker

```bash
docker build -t watcher:dev .
```

#### Build with Podman

```bash
podman build -t watcher:dev .
```

#### Manual Build

```bash
pnpm run build
pnpm run start
```
