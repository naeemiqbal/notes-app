# Deployment

## Live URL
http://notes-app-env.eba-h97mhmt6.us-east-1.elasticbeanstalk.com

## Infrastructure
| Resource | Name / ID |
|---|---|
| AWS Region | us-east-1 |
| ECR Repository | 039859352486.dkr.ecr.us-east-1.amazonaws.com/notes-app |
| EB Application | notes-app |
| EB Environment | notes-app-env |
| Instance type | t3.small (single instance) |
| Platform | Docker on Amazon Linux 2023 |

## Redeploy after code changes

```bash
# 1. Rebuild and push a new image
cd /home/naeem/javawork/fde/frontend && npm run build
cd ..
sudo docker build -t notes-app .
sudo docker tag notes-app:latest 039859352486.dkr.ecr.us-east-1.amazonaws.com/notes-app:latest
aws ecr get-login-password --region us-east-1 | \
  sudo docker login --username AWS --password-stdin 039859352486.dkr.ecr.us-east-1.amazonaws.com
sudo docker push 039859352486.dkr.ecr.us-east-1.amazonaws.com/notes-app:latest

# 2. Create a new app version and deploy
BUCKET=elasticbeanstalk-us-east-1-039859352486
zip -j notes-app-v2.zip Dockerrun.aws.json
aws s3 cp notes-app-v2.zip s3://$BUCKET/notes-app/notes-app-v2.zip
aws elasticbeanstalk create-application-version \
  --application-name notes-app --version-label v2 \
  --source-bundle S3Bucket=$BUCKET,S3Key=notes-app/notes-app-v2.zip \
  --region us-east-1
aws elasticbeanstalk update-environment \
  --application-name notes-app \
  --environment-name notes-app-env \
  --version-label v2 \
  --region us-east-1
```

## Teardown (avoid charges)
```bash
aws elasticbeanstalk terminate-environment \
  --environment-name notes-app-env --region us-east-1
aws elasticbeanstalk delete-application \
  --application-name notes-app --region us-east-1
aws ecr delete-repository \
  --repository-name notes-app --force --region us-east-1
```
