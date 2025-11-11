#!/bin/bash

# This script builds the gRPC library from source.
set -e

# Ensure output directory exists
mkdir -p ./pb

# Generate TypeScript types from all .proto files at repo root
# Uses the proto-loader CLI bundled with @grpc/proto-loader
npm run proto:gen