# https://cloud.google.com/run/docs/quickstarts/deploy-continuously?hl=ja#cloudrun_deploy_continuous_code-go
# https://github.com/GoogleCloudPlatform/cloud-run-microservice-template-go/blob/main/Dockerfile

FROM golang:bookworm as builder

ARG GOOS=
ARG GOARCH=
ARG CGO_ENABLED=

ENV GOOS=${GOOS}
ENV GOARCH=${GOARCH}
ENV CGO_ENABLED=${CGO_ENABLED}

WORKDIR /srv
COPY go.* ./
RUN go mod download
COPY . ./
RUN go build -mod=readonly -v -o server ./cmd/server


FROM debian:bookworm-slim
RUN set -x && apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y ca-certificates && \
    rm -rf /var/lib/apt/lists/*
COPY --from=builder /srv/server /srv/server

CMD ["/srv/server"]
