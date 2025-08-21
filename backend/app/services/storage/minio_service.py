import os 
from minio import Minio
from datetime import datetime
import pandas as pd 
from io import BytesIO, StringIO
from datetime import timedelta 
from app.config.settings import MinIOSettings
from .base_storage import BaseStorage

settings = MinIOSettings() 

class MinioStorageService(BaseStorage):
    def __init__(self):
        self.client = Minio(
            settings.MINIO_ENDPOINT,
            access_key = settings.MINIO_ACCESS_KEY.get_secret_value(),
            secret_key = settings.MINIO_SECRET_KEY.get_secret_value(),
            secure=False
        )
        self.bucket = settings.MINIO_BUCKET_NAME
        if not self.client.bucket_exists(self.bucket): 
            self.client.make_bucket(self.bucket) 
        self.minio_presigned_url_expiry = settings.MINIO_PRESIGNED_URL_EXPIRY 

        # set the bucket policy
        self.client.set_bucket_policy(
            self.bucket,
            """
            {
                "Version": "2012-10-17",
                "Statement": [
                    {
                        "Effect": "Allow",
                        "Principal": "*",
                        "Action": "s3:GetObject",
                        "Resource": "arn:aws:s3:::uploads/*"
                    }
                ]
            }
            """
        )

    def upload_file(self, file_bytes: bytes, file_name: str) -> str:
        self.client.put_object(
            self.bucket, file_name, BytesIO(file_bytes), length = len(file_bytes)
        )
        return f"{self.bucket}/{file_name}"

    def generate_presigned_url(self, filename: str, user_id: str):
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        name, extension = os.path.splitext(filename)
        new_filename = f"{name}_{timestamp}{extension}"
        object_name = f"{user_id}/{new_filename}"
        
        url = self.client.presigned_put_object(
            self.bucket, 
            object_name, 
            expires = timedelta(seconds = self.minio_presigned_url_expiry)
        )
        
        return url, object_name
    
    def get_object(self, bucket_name: str, object_name: str):
        """Get object from MinIO"""
        try:
            return self.client.get_object(bucket_name, object_name)
        except Exception as e:
            raise ValueError(f"Error getting object from MinIO: {str(e)}")
    
    def read_csv_from_object(self, object_name: str):
        """Read CSV data from MinIO object"""
        try:
            response = self.client.get_object(self.bucket, object_name)
            csv_data = response.read().decode('utf-8')
            response.close()
            response.release_conn()
            
            # Use StringIO for CSV data since it's already decoded to string
            df = pd.read_csv(StringIO(csv_data))
            return df
            
        except Exception as e:
            raise ValueError(f"Error reading CSV from MinIO: {str(e)}")
    
    def process_uploaded_csv(self, file_path: str, collection):
        record = collection.find_one({"file_path": file_path})
        if not record:
            raise ValueError("File not found in the database")
        
        try:
            df = self.read_csv_from_object(file_path)
            return df
        except Exception as e:
            raise ValueError(f"Error processing CSV: {str(e)}")
    
def get_minio_service():
    return MinioStorageService()