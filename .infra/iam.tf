# ════════════════════════════════════════════════
# IAM — Wordle-specific roles, policies, and attachments
# ════════════════════════════════════════════════

# ── Imports ──────────────────────────────────
import {
  to = aws_iam_role.wordle_api
  id = "wordle-api-role-k9mgdat2"
}
import {
  to = aws_iam_role.daily_word_changer
  id = "daily-word-changer-role-h4uwwiic"
}
import {
  to = aws_iam_role.wordle_api_deployer
  id = "WordleAPIDeployer"
}
import {
  to = aws_iam_policy.wordle_api_deployer
  id = "arn:aws:iam::977902694062:policy/WordleAPIDeployer"
}
import {
  to = aws_iam_policy.github_actions_wordle
  id = "arn:aws:iam::977902694062:policy/GithubActions-Wordle"
}
import {
  to = aws_iam_policy.invalidate_wordle_cloudfront
  id = "arn:aws:iam::977902694062:policy/InvalidateWordleCloudFront"
}
import {
  to = aws_iam_policy.lambda_basic_exec_3334772a
  id = "arn:aws:iam::977902694062:policy/service-role/AWSLambdaBasicExecutionRole-3334772a-1857-4556-b610-3999e7921f37"
}
import {
  to = aws_iam_policy.lambda_basic_exec_f7197d9b
  id = "arn:aws:iam::977902694062:policy/service-role/AWSLambdaBasicExecutionRole-f7197d9b-0d2a-4193-a33f-582fd8550247"
}
import {
  to = aws_iam_policy.lambda_update_config
  id = "arn:aws:iam::977902694062:policy/lambda-update-config"
}
import {
  to = aws_iam_role_policy_attachment.wordle_api_basic_exec
  id = "wordle-api-role-k9mgdat2/arn:aws:iam::977902694062:policy/service-role/AWSLambdaBasicExecutionRole-3334772a-1857-4556-b610-3999e7921f37"
}
import {
  to = aws_iam_role_policy_attachment.daily_word_changer_basic_exec
  id = "daily-word-changer-role-h4uwwiic/arn:aws:iam::977902694062:policy/service-role/AWSLambdaBasicExecutionRole-f7197d9b-0d2a-4193-a33f-582fd8550247"
}
import {
  to = aws_iam_role_policy_attachment.daily_word_changer_lambda_update
  id = "daily-word-changer-role-h4uwwiic/arn:aws:iam::977902694062:policy/lambda-update-config"
}
import {
  to = aws_iam_role_policy_attachment.wordle_api_deployer_policy
  id = "WordleAPIDeployer/arn:aws:iam::977902694062:policy/WordleAPIDeployer"
}
import {
  to = aws_iam_user_policy_attachment.github_actions_wordle_deployer
  id = "github-actions/arn:aws:iam::977902694062:policy/WordleAPIDeployer"
}
import {
  to = aws_iam_user_policy_attachment.github_actions_wordle
  id = "github-actions/arn:aws:iam::977902694062:policy/GithubActions-Wordle"
}
import {
  to = aws_iam_user_policy_attachment.github_actions_invalidate_cf
  id = "github-actions/arn:aws:iam::977902694062:policy/InvalidateWordleCloudFront"
}

# ── Roles ────────────────────────────────────
resource "aws_iam_role" "wordle_api" {
  assume_role_policy = jsonencode({
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
    Version = "2012-10-17"
  })
  force_detach_policies = false
  max_session_duration  = 3600
  name                  = "wordle-api-role-k9mgdat2"
  path                  = "/service-role/"
  tags                  = {}
}

resource "aws_iam_role" "daily_word_changer" {
  assume_role_policy = jsonencode({
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
    Version = "2012-10-17"
  })
  force_detach_policies = false
  max_session_duration  = 3600
  name                  = "daily-word-changer-role-h4uwwiic"
  path                  = "/service-role/"
  tags                  = {}
}

resource "aws_iam_role" "wordle_api_deployer" {
  assume_role_policy = jsonencode({
    Statement = [{
      Action    = "sts:AssumeRole"
      Condition = {}
      Effect    = "Allow"
      Principal = {
        AWS = "arn:aws:iam::977902694062:root"
      }
    }]
    Version = "2012-10-17"
  })
  force_detach_policies = false
  max_session_duration  = 3600
  name                  = "WordleAPIDeployer"
  path                  = "/"
  tags                  = {}
}

# ── Policies ─────────────────────────────────
resource "aws_iam_policy" "wordle_api_deployer" {
  name = "WordleAPIDeployer"
  path = "/"
  policy = jsonencode({
    Statement = [{
      Action   = ["lambda:CreateFunction", "s3:PutObject", "lambda:UpdateFunctionCode", "lambda:UpdateFunctionConfiguration"]
      Effect   = "Allow"
      Resource = "*"
      Sid      = "VisualEditor0"
      }, {
      Action   = "iam:ListRoles"
      Effect   = "Allow"
      Resource = "*"
      Sid      = "VisualEditor1"
    }]
    Version = "2012-10-17"
  })
  tags = {}
}

resource "aws_iam_policy" "github_actions_wordle" {
  name = "GithubActions-Wordle"
  path = "/"
  policy = jsonencode({
    Statement = [{
      Action   = ["s3:PutObject", "s3:GetObject", "s3:ListBucket", "s3:DeleteObject", "s3:GetBucketLocation"]
      Effect   = "Allow"
      Resource = ["arn:aws:s3:::wordle.nickhudkins.com/*", "arn:aws:s3:::wordle.nickhudkins.com"]
      Sid      = "VisualEditor0"
    }]
    Version = "2012-10-17"
  })
  tags = {}
}

resource "aws_iam_policy" "invalidate_wordle_cloudfront" {
  name = "InvalidateWordleCloudFront"
  path = "/"
  policy = jsonencode({
    Statement = [{
      Action   = "cloudfront:CreateInvalidation"
      Effect   = "Allow"
      Resource = "arn:aws:cloudfront::977902694062:distribution/E1OV5GB7F9NK3F"
      Sid      = "VisualEditor0"
    }]
    Version = "2012-10-17"
  })
  tags = {}
}

resource "aws_iam_policy" "lambda_basic_exec_3334772a" {
  name = "AWSLambdaBasicExecutionRole-3334772a-1857-4556-b610-3999e7921f37"
  path = "/service-role/"
  policy = jsonencode({
    Statement = [{
      Action   = "logs:CreateLogGroup"
      Effect   = "Allow"
      Resource = "arn:aws:logs:us-east-1:977902694062:*"
      }, {
      Action   = ["logs:CreateLogStream", "logs:PutLogEvents"]
      Effect   = "Allow"
      Resource = ["arn:aws:logs:us-east-1:977902694062:log-group:/aws/lambda/wordle-api:*"]
    }]
    Version = "2012-10-17"
  })
  tags = {}
}

resource "aws_iam_policy" "lambda_basic_exec_f7197d9b" {
  name = "AWSLambdaBasicExecutionRole-f7197d9b-0d2a-4193-a33f-582fd8550247"
  path = "/service-role/"
  policy = jsonencode({
    Statement = [{
      Action   = "logs:CreateLogGroup"
      Effect   = "Allow"
      Resource = "arn:aws:logs:us-east-1:977902694062:*"
      }, {
      Action   = ["logs:CreateLogStream", "logs:PutLogEvents"]
      Effect   = "Allow"
      Resource = ["arn:aws:logs:us-east-1:977902694062:log-group:/aws/lambda/daily-word-changer:*"]
    }]
    Version = "2012-10-17"
  })
  tags = {}
}

resource "aws_iam_policy" "lambda_update_config" {
  name = "lambda-update-config"
  path = "/"
  policy = jsonencode({
    Statement = [{
      Action   = ["lambda:ListVersionsByFunction", "lambda:GetLayerVersion", "lambda:GetAccountSettings", "lambda:GetFunctionConfiguration", "lambda:GetLayerVersionPolicy", "lambda:ListProvisionedConcurrencyConfigs", "lambda:GetProvisionedConcurrencyConfig", "lambda:ListTags", "lambda:ListLayerVersions", "lambda:ListLayers", "lambda:ListCodeSigningConfigs", "lambda:GetAlias", "lambda:ListFunctions", "lambda:GetEventSourceMapping", "lambda:GetFunction", "lambda:ListAliases", "lambda:UpdateFunctionConfiguration", "lambda:GetFunctionCodeSigningConfig", "lambda:ListFunctionEventInvokeConfigs", "lambda:ListFunctionsByCodeSigningConfig", "lambda:GetFunctionConcurrency", "lambda:GetFunctionEventInvokeConfig", "lambda:ListEventSourceMappings", "lambda:GetCodeSigningConfig", "lambda:GetPolicy"]
      Effect   = "Allow"
      Resource = "*"
      Sid      = "VisualEditor0"
    }]
    Version = "2012-10-17"
  })
  tags = {}
}

# ── Role Policy Attachments ──────────────────
resource "aws_iam_role_policy_attachment" "wordle_api_basic_exec" {
  policy_arn = aws_iam_policy.lambda_basic_exec_3334772a.arn
  role       = aws_iam_role.wordle_api.name
}

resource "aws_iam_role_policy_attachment" "daily_word_changer_basic_exec" {
  policy_arn = aws_iam_policy.lambda_basic_exec_f7197d9b.arn
  role       = aws_iam_role.daily_word_changer.name
}

resource "aws_iam_role_policy_attachment" "daily_word_changer_lambda_update" {
  policy_arn = aws_iam_policy.lambda_update_config.arn
  role       = aws_iam_role.daily_word_changer.name
}

resource "aws_iam_role_policy_attachment" "wordle_api_deployer_policy" {
  policy_arn = aws_iam_policy.wordle_api_deployer.arn
  role       = aws_iam_role.wordle_api_deployer.name
}

# ── User Policy Attachments (github-actions user) ─
# The github-actions IAM user is defined elsewhere (shared resource).
# These attachments grant it the wordle-specific deploy permissions.
resource "aws_iam_user_policy_attachment" "github_actions_wordle_deployer" {
  policy_arn = aws_iam_policy.wordle_api_deployer.arn
  user       = "github-actions"
}

resource "aws_iam_user_policy_attachment" "github_actions_wordle" {
  policy_arn = aws_iam_policy.github_actions_wordle.arn
  user       = "github-actions"
}

resource "aws_iam_user_policy_attachment" "github_actions_invalidate_cf" {
  policy_arn = aws_iam_policy.invalidate_wordle_cloudfront.arn
  user       = "github-actions"
}
