FROM golang:1.24-alpine3.22 AS builder

WORKDIR /build

COPY go.mod go.sum ./
RUN go mod tidy
COPY . .

RUN go build -o containerService ./cmd/account/main.go

FROM alpine:3.22

WORKDIR /app

COPY --from=builder /build/containerService .

EXPOSE 8080
CMD ["./containerService"]
