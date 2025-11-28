#!/usr/bin/env bash
set -euo pipefail

AWS_REGION="us-west-2"
AWS_PROFILE="free-app-ci"
STACK_NAME="free-app-frontend"
BUCKET_NAME="free-app-frontend"
TEMPLATE_FILE="infra/frontend-s3-cloudfront.yml"
FRONTEND_DIR="frontend"
BUILD_DIR="dist"

echo "==> Building frontend..."
(
  cd "$FRONTEND_DIR"
  npm ci
  npm run build
)

echo "==> Deploying CloudFormation stack ($STACK_NAME)..."
aws cloudformation deploy \
  --template-file "$TEMPLATE_FILE" \
  --stack-name "$STACK_NAME" \
  --parameter-overrides BucketName="$BUCKET_NAME" \
  --capabilities CAPABILITY_NAMED_IAM \
  --region "$AWS_REGION" \
  --profile "$AWS_PROFILE" \
  --no-fail-on-empty-changeset

echo "==> Syncing build to S3 bucket: $BUCKET_NAME"
aws s3 sync "$FRONTEND_DIR/$BUILD_DIR" "s3://$BUCKET_NAME" \
  --delete \
  --region "$AWS_REGION" \
  --profile "$AWS_PROFILE"

echo "==> Fetching CloudFront distribution ID from stack..."
DIST_ID=$(aws cloudformation describe-stack-resources \
  --stack-name "$STACK_NAME" \
  --logical-resource-id CloudFrontDistribution \
  --query 'StackResources[0].PhysicalResourceId' \
  --output text \
  --region "$AWS_REGION" \
  --profile "$AWS_PROFILE")

if [[ -z "$DIST_ID" || "$DIST_ID" == "None" ]]; then
  echo "!! Could not resolve CloudFrontDistribution PhysicalResourceId. Skipping invalidation."
  exit 0
fi

echo "==> Creating CloudFront invalidation for distribution $DIST_ID ..."
aws cloudfront create-invalidation \
  --distribution-id "$DIST_ID" \
  --paths "/*" \
  --profile "$AWS_PROFILE"

echo "==> Done."
