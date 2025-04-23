# 📦 GOETL

**GOETL** is a modern, extensible ETL (Extract, Transform, Load) utility designed for preparing datasets for LLM (Large Language Model) training and analytics. It supports both CLI and REST API modes, and comes with a sleek React-based web UI for interactive dataset preparation.

---

## 🚀 Features

- **Extract** text from `.pdf` and `.txt` files
- **Transform**: Clean, tokenize, and chunk text for LLM-friendly datasets
- **Load**: Output to JSONL, CSV, or directly to databases (Postgres, MySQL, SQLite, MongoDB, Redis)
- **Semantic Codebase Analysis**: Generate semantic graphs from code directories
- **REST API**: Run as a web service for programmatic or UI-driven ETL
- **Web UI**: Intuitive React frontend for easy job configuration and monitoring
- **Kubernetes & Docker Ready**: Production-grade deployment with Caddy reverse proxy

---

## 🏗️ Architecture

- **Go Backend**: High-performance ETL engine and REST API (`/api/etl`)
- **React Frontend**: User-friendly web UI (`webui/webui`)
- **Caddy**: Serves static UI and reverse-proxies API requests
- **Docker & K8s**: Containerized and orchestratable

---

## ⚡ Quick Start

### 1. Build & Run with Docker

```bash
docker build -t anuragsingh086/goetl:latest .
docker run -p 8080:8080 -v $(pwd)/samples:/data anuragsingh086/goetl:latest
```

- Web UI: [http://localhost:8080](http://localhost:8080)
- API: [http://localhost:8080/api/etl](http://localhost:8080/api/etl)

### 2. CLI Usage

```bash
go run ./cmd/main.go -input samples/demo.pdf -output output/data.jsonl -format jsonl
```

#### Supported CLI Flags

| Flag           | Description                                         |
|----------------|-----------------------------------------------------|
| `-input`       | Path to input file (.pdf/.txt) or directory         |
| `-output`      | Output file path (JSONL/CSV/DB)                     |
| `-chunksize`   | Chunk size in tokens (default: 200)                 |
| `-overlap`     | Token overlap between chunks (default: 20)          |
| `-format`      | Output format: jsonl, csv, postgres, mysql, sqlite, mongodb, redis |
| `-dburl`       | Database URL (for DB targets)                       |
| `-instruction` | Instruction template for JSONL                      |
| `-parse`       | Parse and analyze extracted text                    |
| `-semantic`    | Analyze codebase and output semantic graph          |
| `-semanticout` | Output path for semantic graph JSON                 |
| `-version`     | Show version and exit                               |

### 3. REST API

**POST** `/api/etl`

```json
{
  "input": "/data/demo.pdf",
  "output": "output/data.jsonl",
  "chunksize": 200,
  "overlap": 20,
  "format": "jsonl",
  "dburl": "",
  "instruction": "Please summarize the following text chunk #%d.",
  "parse": false,
  "semantic": false,
  "semanticout": "output/semantic_graph.json"
}
```

**GET** `/api/ping` or `/ping`  
Health check endpoint.

---

## 🌐 Web UI

- Navigate to [http://localhost:8080](http://localhost:8080)
- Drag & drop files, configure ETL jobs, and monitor progress visually.

---

## ☸️ Kubernetes Deployment

See [`k8s-deployment.yaml`](./k8s-deployment.yaml) for a sample manifest:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: goetl
spec:
  replicas: 3
  ...
```

---

## 🛠️ Development

### Backend

```bash
go run ./cmd/main.go
```

### Frontend

```bash
cd webui/webui
npm install
npm start
```

---

## 🐳 CI/CD

- Automated Docker builds and pushes via GitHub Actions.
- See [`.github/workflows/docker-image.yml`](.github/workflows/docker-image.yml).

---

## 📝 License

MIT License. See [LICENSE](./LICENSE).

---

## 🙏 Acknowledgements

- [Gin](https://github.com/gin-gonic/gin) for the web framework
- [Caddy](https://caddyserver.com/) for static and API serving
- [React](https://react.dev/) for the frontend

---

## 💡 Contributing

Pull requests and issues are welcome!  
Please open an issue for feature requests or bug reports.

---

## 📫 Contact

- Author: [Anurag Singh](https://github.com/anurag-bit)
- Repo: [https://github.com/anurag-bit/goetl](https://github.com/anurag-bit/goetl)

---
