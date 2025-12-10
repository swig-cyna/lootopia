import * as Minio from "minio"

async function main() {
  const s3Client = new Minio.Client({
    endPoint: process.env.S3_ENDPOINT,
    port: process.env.S3_PORT ? Number(process.env.S3_PORT) : undefined,
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
    useSSL: process.env.S3_USE_SSL === "true",
  })

  const bucketExists = await s3Client.bucketExists(process.env.S3_NAME)

  const policy = JSON.stringify({
    Statement: [
      {
        Action: ["s3:GetBucketLocation"],
        Effect: "Allow",
        Principal: {
          AWS: ["*"],
        },
        Resource: [`arn:aws:s3:::${process.env.S3_NAME}`],
      },
      {
        Action: ["s3:GetObject"],
        Effect: "Allow",
        Principal: {
          AWS: ["*"],
        },
        Resource: [`arn:aws:s3:::${process.env.S3_NAME}/*`],
      },
    ],
    Version: "2012-10-17",
  })

  if (!bucketExists) {
    console.log(`Bucket ${process.env.S3_NAME} does not exist. Creating...`)
    await s3Client.makeBucket(process.env.S3_NAME)
    await s3Client.setBucketPolicy(process.env.S3_NAME, policy)

    console.log(`Bucket ${process.env.S3_NAME} created.`)
  } else {
    console.log(`Bucket ${process.env.S3_NAME} already exists.`)
  }
}

main()
