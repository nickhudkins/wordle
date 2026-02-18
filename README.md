# Wordle

A Wordle clone hosted at [wordle.nickhudkins.com](https://wordle.nickhudkins.com).

## Infrastructure

AWS infrastructure is managed with Terraform in the `.infra/` directory. This covers all cloud resources the project depends on:

- **S3** bucket for the static site
- **CloudFront** distribution with custom domain + ACM certificates
- **Lambda** functions (`wordle-api`, `daily-word-changer`)
- **API Gateway** (HTTP API) with custom domain (`api.wordle.nickhudkins.com`)
- **EventBridge** rule to rotate the daily word
- **IAM** roles, policies, and GitHub Actions deploy permissions
- **CloudWatch** log groups

### Getting started

```sh
cd .infra
terraform init
terraform plan   # preview changes
terraform apply  # apply changes
```

Requires the `terraform` AWS CLI profile to be configured with SSO access.
