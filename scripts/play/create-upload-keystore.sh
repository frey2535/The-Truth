#!/usr/bin/env bash
# Create a local upload keystore. Play App Signing re-signs the store copy.
# Passwords: ANDROID_UPLOAD_STORE_PASSWORD and ANDROID_UPLOAD_KEY_PASSWORD, or a generated pair.
set -euo pipefail
root="$(cd "$(dirname "$0")/../.." && pwd)"
cd "$root/android"
if [[ -f upload.keystore ]]; then
  echo "android/upload.keystore already exists. Leaving it alone."
  if [[ -f keystore.properties ]]; then
    store_pass="$(sed -n 's/^storePassword=//p' keystore.properties | head -1)"
    keytool -list -v -keystore upload.keystore -alias thetruth -storepass "$store_pass" | sed -n 's/.*SHA256: //p' || true
  fi
  exit 0
fi

store_pass="${ANDROID_UPLOAD_STORE_PASSWORD:-}"
key_pass="${ANDROID_UPLOAD_KEY_PASSWORD:-$store_pass}"
if [[ -z "$store_pass" ]]; then
  store_pass="$(openssl rand -base64 24 | tr -d '/+=' | head -c 24)"
  key_pass="$store_pass"
fi

keytool -genkeypair \
  -keystore upload.keystore \
  -alias thetruth \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -dname "CN=The Truth, OU=Current Flow Consulting, O=Current Flow Consulting, L=Unknown, ST=Unknown, C=US" \
  -storepass "$store_pass" \
  -keypass "$key_pass"

if [[ ! -f keystore.properties ]]; then
  cat > keystore.properties <<EOF
storeFile=upload.keystore
storePassword=$store_pass
keyAlias=thetruth
keyPassword=$key_pass
EOF
  echo "wrote android/keystore.properties (gitignored)"
fi

echo
echo "Back up android/upload.keystore and the passwords. Losing them blocks Play updates."
echo "GitHub Actions secrets:"
echo "  ANDROID_UPLOAD_KEYSTORE_BASE64  (base64 of android/upload.keystore)"
echo "  ANDROID_UPLOAD_STORE_PASSWORD"
echo "  ANDROID_UPLOAD_KEY_ALIAS=thetruth"
echo "  ANDROID_UPLOAD_KEY_PASSWORD"
echo
echo "Upload-key SHA-256 (Play App Signing will add a second fingerprint after the first upload):"
keytool -list -v -keystore upload.keystore -alias thetruth -storepass "$store_pass" | sed -n 's/.*SHA256: //p'
