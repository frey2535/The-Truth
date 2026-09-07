#!/usr/bin/env bash
# Create a local upload keystore. Play App Signing re-signs the store copy.
set -euo pipefail
root="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$root/android"
if [[ -f upload.keystore ]]; then
  echo "android/upload.keystore already exists. Leaving it alone."
  exit 0
fi
keytool -genkeypair -v \
  -keystore upload.keystore \
  -alias thetruth \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -dname "CN=The Truth, OU=Current Flow Consulting, O=Current Flow Consulting, L=Unknown, ST=Unknown, C=US"
echo
echo "Add android/keystore.properties (gitignored) with:"
echo "  storeFile=upload.keystore"
echo "  storePassword=..."
echo "  keyAlias=thetruth"
echo "  keyPassword=..."
echo
echo "Upload-key SHA-256 (for Digital Asset Links until Play App Signing is on):"
keytool -list -v -keystore upload.keystore -alias thetruth | sed -n 's/.*SHA256: //p'
