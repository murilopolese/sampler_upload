# S3 upload server

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


[How do I force a subtree push to overwrite remote changes?](https://stackoverflow.com/questions/33172857/how-do-i-force-a-subtree-push-to-overwrite-remote-changes)

```
git push heroku `git subtree split --prefix src master`:master --force
```

## Docker image

```
docker run \
-p 80:8080 \
-e ACCESS_KEY=123 \
-e SECRET=321 \
-e BUCKET_NAME=bucketname \
murilopolese/sampler_upload:1.1.0
```
