# ════════════════════════════════════════════════
# wordle.nickhudkins.com
# Wordle clone — S3 static site + CloudFront + API Gateway + Lambda
# ════════════════════════════════════════════════

# ── Imports ──────────────────────────────────
import {
  to = aws_s3_bucket.wordle_nickhudkins_com
  id = "wordle.nickhudkins.com"
}
import {
  to = aws_acm_certificate.wordle_nickhudkins_com
  id = "arn:aws:acm:us-east-1:977902694062:certificate/38742f86-e9c7-429a-81d4-4c6f9f4c849a"
}
import {
  to = aws_acm_certificate.api_wordle_nickhudkins_com
  id = "arn:aws:acm:us-east-1:977902694062:certificate/8884b8f7-3c60-44a4-b122-0c3f1bbf0fa3"
}
import {
  to = aws_cloudfront_distribution.wordle_nickhudkins_com
  id = "E1OV5GB7F9NK3F"
}
import {
  to = aws_lambda_function.wordle_api
  id = "wordle-api"
}
import {
  to = aws_lambda_function.daily_word_changer
  id = "daily-word-changer"
}
import {
  to = aws_lambda_permission.wordle_api_apigw_meta
  id = "wordle-api/50036c3e-41ca-5054-ad6a-4b3db676493f"
}
import {
  to = aws_lambda_permission.wordle_api_apigw_check
  id = "wordle-api/79858473-4fe8-585c-aaaa-8a8bb4fd46c1"
}
import {
  to = aws_lambda_permission.daily_word_changer_eventbridge
  id = "daily-word-changer/AWSEvents_WordChanger_Ida80abb51-8fc1-4e3b-872e-44664cae9710"
}
import {
  to = aws_apigatewayv2_api.wordle_api
  id = "ly8y7i9sva"
}
import {
  to = aws_apigatewayv2_stage.wordle_api_default
  id = "ly8y7i9sva/$default"
}
import {
  to = aws_apigatewayv2_route.wordle_api_meta
  id = "ly8y7i9sva/u9vn8bj"
}
import {
  to = aws_apigatewayv2_route.wordle_api_check
  id = "ly8y7i9sva/vsbl09v"
}
import {
  to = aws_apigatewayv2_integration.wordle_api_meta
  id = "ly8y7i9sva/xnqwf7g"
}
import {
  to = aws_apigatewayv2_integration.wordle_api_check
  id = "ly8y7i9sva/v246ff3"
}
import {
  to = aws_apigatewayv2_domain_name.api_wordle_nickhudkins_com
  id = "api.wordle.nickhudkins.com"
}
import {
  to = aws_apigatewayv2_api_mapping.wordle_api
  id = "yekqd9/api.wordle.nickhudkins.com"
}
import {
  to = aws_cloudwatch_event_rule.word_changer
  id = "WordChanger"
}
import {
  to = aws_cloudwatch_event_target.word_changer_lambda
  id = "WordChanger/Ida80abb51-8fc1-4e3b-872e-44664cae9710"
}
import {
  to = aws_cloudwatch_log_group.lambda_wordle_api
  id = "/aws/lambda/wordle-api"
}
import {
  to = aws_cloudwatch_log_group.lambda_daily_word_changer
  id = "/aws/lambda/daily-word-changer"
}

# ── S3 ───────────────────────────────────────
resource "aws_s3_bucket" "wordle_nickhudkins_com" {
  bucket              = "wordle.nickhudkins.com"
  object_lock_enabled = false
  tags                = {}
}

# ── ACM Certificates ────────────────────────
resource "aws_acm_certificate" "wordle_nickhudkins_com" {
  domain_name               = "wordle.nickhudkins.com"
  key_algorithm             = "RSA_2048"
  subject_alternative_names = ["wordle.nickhudkins.com"]
  tags                      = {}
  validation_method         = "DNS"
  options {
    certificate_transparency_logging_preference = "ENABLED"
  }
}

resource "aws_acm_certificate" "api_wordle_nickhudkins_com" {
  domain_name               = "api.wordle.nickhudkins.com"
  key_algorithm             = "RSA_2048"
  subject_alternative_names = ["api.wordle.nickhudkins.com"]
  tags                      = {}
  validation_method         = "DNS"
  options {
    certificate_transparency_logging_preference = "ENABLED"
  }
}

# ── CloudFront ───────────────────────────────
resource "aws_cloudfront_distribution" "wordle_nickhudkins_com" {
  aliases             = ["wordle.nickhudkins.com"]
  default_root_object = "index.html"
  enabled             = true
  http_version        = "http2"
  is_ipv6_enabled     = true
  price_class         = "PriceClass_All"
  retain_on_delete    = false
  staging             = false
  tags                = {}
  wait_for_deployment = true
  default_cache_behavior {
    allowed_methods        = ["GET", "HEAD"]
    cache_policy_id        = "658327ea-f89d-4fab-a63d-7e88639e58f6"
    cached_methods         = ["GET", "HEAD"]
    compress               = true
    default_ttl            = 0
    max_ttl                = 0
    min_ttl                = 0
    smooth_streaming       = false
    target_origin_id       = "wordle.nickhudkins.com.s3.us-east-1.amazonaws.com"
    trusted_key_groups     = []
    trusted_signers        = []
    viewer_protocol_policy = "redirect-to-https"
    grpc_config {
      enabled = false
    }
  }
  origin {
    connection_attempts      = 3
    connection_timeout       = 10
    domain_name              = "wordle.nickhudkins.com.s3.us-east-1.amazonaws.com"
    origin_id                = "wordle.nickhudkins.com.s3.us-east-1.amazonaws.com"
  }
  restrictions {
    geo_restriction {
      locations        = []
      restriction_type = "none"
    }
  }
  viewer_certificate {
    acm_certificate_arn            = "arn:aws:acm:us-east-1:977902694062:certificate/38742f86-e9c7-429a-81d4-4c6f9f4c849a"
    cloudfront_default_certificate = false
    minimum_protocol_version       = "TLSv1.2_2021"
    ssl_support_method             = "sni-only"
  }
}

# ── Lambda ───────────────────────────────────
resource "aws_lambda_function" "wordle_api" {
  architectures                  = ["x86_64"]
  function_name                  = "wordle-api"
  handler                        = "index.handler"
  memory_size                    = 128
  package_type                   = "Zip"
  reserved_concurrent_executions = -1
  role                           = aws_iam_role.wordle_api.arn
  runtime                        = "nodejs14.x"
  skip_destroy                   = false
  tags                           = {}
  timeout                        = 3
  filename                       = "placeholder.zip"
  environment {
    variables = {
      BANNED_WORD  = "$$$$$"
      CORRECT_WORD = "bavin"
      REVISION     = "1467"
    }
  }
  ephemeral_storage {
    size = 512
  }
  logging_config {
    log_format = "Text"
    log_group  = "/aws/lambda/wordle-api"
  }
  tracing_config {
    mode = "PassThrough"
  }
  lifecycle {
    ignore_changes = [filename, source_code_hash, environment]
  }
}

resource "aws_lambda_function" "daily_word_changer" {
  architectures                  = ["x86_64"]
  function_name                  = "daily-word-changer"
  handler                        = "index.handler"
  memory_size                    = 128
  package_type                   = "Zip"
  reserved_concurrent_executions = -1
  role                           = aws_iam_role.daily_word_changer.arn
  runtime                        = "nodejs14.x"
  skip_destroy                   = false
  tags                           = {}
  timeout                        = 3
  filename                       = "placeholder.zip"
  ephemeral_storage {
    size = 512
  }
  logging_config {
    log_format = "Text"
    log_group  = "/aws/lambda/daily-word-changer"
  }
  tracing_config {
    mode = "PassThrough"
  }
  lifecycle {
    ignore_changes = [filename, source_code_hash]
  }
}

resource "aws_lambda_permission" "wordle_api_apigw_meta" {
  action        = "lambda:InvokeFunction"
  function_name = "wordle-api"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:us-east-1:977902694062:ly8y7i9sva/*/*/meta"
  statement_id  = "50036c3e-41ca-5054-ad6a-4b3db676493f"
}

resource "aws_lambda_permission" "wordle_api_apigw_check" {
  action        = "lambda:InvokeFunction"
  function_name = "wordle-api"
  principal     = "apigateway.amazonaws.com"
  source_arn    = "arn:aws:execute-api:us-east-1:977902694062:ly8y7i9sva/*/*/check/{word}"
  statement_id  = "79858473-4fe8-585c-aaaa-8a8bb4fd46c1"
}

resource "aws_lambda_permission" "daily_word_changer_eventbridge" {
  action        = "lambda:InvokeFunction"
  function_name = "daily-word-changer"
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.word_changer.arn
  statement_id  = "AWSEvents_WordChanger_Ida80abb51-8fc1-4e3b-872e-44664cae9710"
}

# ── API Gateway v2 ───────────────────────────
resource "aws_apigatewayv2_api" "wordle_api" {
  api_key_selection_expression = "$request.header.x-api-key"
  disable_execute_api_endpoint = true
  name                         = "wordle-api"
  protocol_type                = "HTTP"
  route_selection_expression   = "$request.method $request.path"
  tags                         = {}
  cors_configuration {
    allow_credentials = false
    allow_headers     = ["cache-control", "x-nordle-revision"]
    allow_methods     = ["GET"]
    allow_origins     = ["http://localhost:3000", "https://wordle.nickhudkins.com"]
    expose_headers    = []
    max_age           = 0
  }
}

resource "aws_apigatewayv2_stage" "wordle_api_default" {
  api_id        = aws_apigatewayv2_api.wordle_api.id
  auto_deploy   = true
  name          = "$default"
  stage_variables = {}
  tags           = {}
  default_route_settings {
    data_trace_enabled       = false
    detailed_metrics_enabled = false
    throttling_burst_limit   = 0
    throttling_rate_limit    = 0
  }
}

resource "aws_apigatewayv2_route" "wordle_api_meta" {
  api_id             = aws_apigatewayv2_api.wordle_api.id
  api_key_required   = false
  authorization_type = "NONE"
  route_key          = "GET /meta"
  target             = "integrations/${aws_apigatewayv2_integration.wordle_api_meta.id}"
}

resource "aws_apigatewayv2_route" "wordle_api_check" {
  api_id             = aws_apigatewayv2_api.wordle_api.id
  api_key_required   = false
  authorization_type = "NONE"
  route_key          = "GET /check/{word}"
  target             = "integrations/${aws_apigatewayv2_integration.wordle_api_check.id}"
}

resource "aws_apigatewayv2_integration" "wordle_api_meta" {
  api_id                 = aws_apigatewayv2_api.wordle_api.id
  connection_type        = "INTERNET"
  integration_method     = "POST"
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.wordle_api.arn
  payload_format_version = "2.0"
  timeout_milliseconds   = 30000
}

resource "aws_apigatewayv2_integration" "wordle_api_check" {
  api_id                 = aws_apigatewayv2_api.wordle_api.id
  connection_type        = "INTERNET"
  integration_method     = "POST"
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.wordle_api.arn
  payload_format_version = "2.0"
  timeout_milliseconds   = 30000
}

resource "aws_apigatewayv2_domain_name" "api_wordle_nickhudkins_com" {
  domain_name = "api.wordle.nickhudkins.com"
  tags        = {}
  domain_name_configuration {
    certificate_arn = aws_acm_certificate.api_wordle_nickhudkins_com.arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }
}

resource "aws_apigatewayv2_api_mapping" "wordle_api" {
  api_id      = aws_apigatewayv2_api.wordle_api.id
  domain_name = aws_apigatewayv2_domain_name.api_wordle_nickhudkins_com.domain_name
  stage       = aws_apigatewayv2_stage.wordle_api_default.id
}

# ── EventBridge ──────────────────────────────
resource "aws_cloudwatch_event_rule" "word_changer" {
  description         = "It changes words"
  event_bus_name      = "default"
  force_destroy       = false
  name                = "WordChanger"
  schedule_expression = "rate(1 day)"
  state               = "ENABLED"
  tags                = {}
}

resource "aws_cloudwatch_event_target" "word_changer_lambda" {
  arn            = aws_lambda_function.daily_word_changer.arn
  event_bus_name = "default"
  force_destroy  = false
  rule           = aws_cloudwatch_event_rule.word_changer.name
  target_id      = "Ida80abb51-8fc1-4e3b-872e-44664cae9710"
}

# ── CloudWatch Logs ──────────────────────────
resource "aws_cloudwatch_log_group" "lambda_wordle_api" {
  log_group_class   = "STANDARD"
  name              = "/aws/lambda/wordle-api"
  retention_in_days = 0
  skip_destroy      = false
  tags              = {}
}

resource "aws_cloudwatch_log_group" "lambda_daily_word_changer" {
  log_group_class   = "STANDARD"
  name              = "/aws/lambda/daily-word-changer"
  retention_in_days = 0
  skip_destroy      = false
  tags              = {}
}
