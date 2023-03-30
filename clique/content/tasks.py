from django.conf import settings
from celery import shared_task
import logging
import boto3
from botocore.exceptions import ClientError
import os
from boto3.s3.transfer import TransferConfig

@shared_task
def upload_file(file_name, bucket, object_name=None):
    """Upload a file to an S3 bucket

    :param file_name: File to upload
    :param bucket: Bucket to upload to
    :param object_name: S3 object name. If not specified then file_name is used
    :return: True if file was uploaded, else False
    """
    # Set the desired multipart threshold value (10 MB)
    config = TransferConfig(multipart_threshold=10*1024*1024)

    # If S3 object_name was not specified, use file_name
    if object_name is None:
        object_name = os.path.basename(file_name)

    # Upload the file
    s3_client = boto3.client('s3', aws_access_key_id=settings.AWS_S3_ACCESS_KEY_ID,
                             aws_secret_access_key=settings.AWS_S3_SECRET_ACCESS_KEY)
    try:
        response = s3_client.upload_file(file_name, bucket, object_name, Config=config)
        os.remove(file_name)
    except ClientError as e:
        logging.error(e)
        return False
    return True