from typing import List, Optional, Union, Any 
from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, Field


class Tag(BaseModel):
    """
    Tag object:
      - id: integer (int64)
      - name: string
    """
    id: int = Field(..., description="Unique identifier of the tag", example=123)
    name: str = Field(..., description="Name of the tag")
    

class User(BaseModel):
    """
    User object.
    """
    id: UUID = Field(..., description="Unique user ID (UUID)")
    username: Optional[str] = Field(None, description="Username")
    firstName: Optional[str] = Field(None, description="First name of the user")
    lastName: Optional[str] = Field(None, description="Last name of the user")
    email: Optional[str] = Field(None, description="Email address", example="name@email.com")
    organisation: Optional[str] = Field(None, description="Organisation of the user")


class Dataset(BaseModel):
    """
    Dataset object.
    """
    id: Optional[int] = Field(..., description="Unique dataset ID (int)")
    title: str = Field(..., description="Title of the dataset", example="Soil Moisture Evolution in India")
    description: Optional[str] = Field(None, description="Text explaining what the dataset is about")
    uploader: User = Field(..., description="User who uploaded the dataset")
    uploadDate: datetime = Field(
        ...,
        description="The creation date and time in ISO 8601 format",
        example="2025-06-30T08:30:00Z"
    )
    tags: Optional[List[Tag]] = Field(None, description="List of tags associated with the dataset")
    isSpatial: bool = Field(..., description="Whether the dataset has any geospatial identifiers")
    isTemporal: bool = Field(..., description="Whether the dataset has any temporal identifiers")
    permissions: Optional[str] = Field("public", description="Permissions for the dataset", example="public")

class DatasetResponse(Dataset):
    document_id: str
    file_location: str

class ApiResponse(BaseModel):
    """
    Generic API response.
    """
    code: Optional[int] = Field(None, description="Response code", example=200)
    type: Optional[str] = Field(None, description="Type of response")
    message: Optional[str] = Field(None, description="Message accompanying the response")


class Error(BaseModel):
    """
    Error response object.
    """
    code: str = Field(..., description="Error code")
    message: str = Field(..., description="Error message")

class CloudFunctionRequest(BaseModel):
    func_name: str
    param_values: List[Any]
    # param_types: List[str] 
    # return_type: str 

class RunPipeline(BaseModel):
    dataset_id: str 
    user_id: str 
    username: str 

class PipelineStatus(BaseModel):
    dataset_id: str 
    user_id: str 

class Browse(BaseModel):
    dataset_id: Optional[str] = Field(None, description="ID of the dataset to fetch", example="123e4567-e89b-12d3-a456-426614174000")
    offset: Optional[int] = Field(0, description="Offset for pagination", example=0)
    limit: Optional[int] = Field(10, description="Number of items per page", example=10)

class BrowseDatasets(BaseModel):
    dataset_id: str
    offset: int = Field(0, description="Offset for pagination", example=0)
    limit: int = Field(10, description="Number of items per page", example=9) 

class PresignedURLRequest(BaseModel):
    filename: str = Field(..., description="Name of the file to generate a presigned URL for", example="data.csv")
    user_id: Optional[str] = Field(None, description="ID of the user requesting the presigned URL", example="123e4567-e89b-12d3-a456-426614174000")

class CreateDatasetRequest(BaseModel):
    file_path: str
    dataset_name: str
    user_id: str
    username: str