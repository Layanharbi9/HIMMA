# HIMMA · هِمَّة — Sovereign AI Platform (live demo)

**🚀 [Open the live demo →](https://layanharbi9.github.io/HIMMA/)**

HIMMA is a self-hosted AI platform for a regulated enterprise where **no company data may leave company infrastructure**. It ran on a k3s Kubernetes cluster with a single NVIDIA T4:

| Service | Model / tool | Measured on the cluster |
|---|---|---|
| FR1 · AI Assistant | Qwen2.5-7B-Instruct AWQ on vLLM (GPU) | 0.75 s first token · ~47 tokens/s · 42.7 tokens/s with 5 users |
| FR2 · Meeting Transcription | faster-whisper `small` INT8 (CPU) | 60 s clip in 23.6 s |
| FR3 · Document Digitisation | Tesseract OCR over HTTP (CPU) | A4 page in 3.1 s |
| FR4 · Visual Q&A (bonus) | Qwen2-VL-2B-Instruct (GPU, time-shared) | — |
| Operations | Prometheus · Grafana · Alertmanager · RBAC · NetworkPolicies | self-heals in 37 s |

The employee-facing app — bilingual (Arabic/English), dark/light themes — was built with **Next.js, React, TypeScript, and Tailwind CSS** and deployed inside the cluster as the Docker image [`layanalharbi4/himma-ui`](https://hub.docker.com/r/layanalharbi4/himma-ui).

## About this demo

The cluster and its models are offline, so this site is a **static build of the real HIMMA screens** (prerendered pages and compiled styles taken from the `himma-ui` image). A small script ([`demo/himma-demo.js`](demo/himma-demo.js)) restores the interactions and **replays results recorded on the real cluster in July 2026** — the assistant answers, the meeting transcript, the OCR of a scanned A4 page, and the chart answer. Nothing is sent anywhere.

**Author:** Layan Mohammed Alharbi — individual final project, AI Infrastructure track, Masar program (SANI × Misk × SDAIA). Supervised by Osama Alqahtani.
