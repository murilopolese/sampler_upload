# Sample pack upload server

This is a nodejs server starts an http server that receives files and stores them on a s3 bucket.

Expected environment variables:

```
ACCESS_KEY
SECRET
BUCKET_NAME
```

## Deploy to heroku:

```
git subtree push --prefix src heroku master
```

## Docker image

```
docker run \
-p 80:8080 \
-e ACCESS_KEY=123 \
-e SECRET=321 \
-e BUCKET_NAME=bucketname \
murilopolese/sampler_upload:1.0.0
```
