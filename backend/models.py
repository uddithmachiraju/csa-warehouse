from typing import List, Optional, Union
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


class LocationLatLong(BaseModel):
    """
    Location specified by latitude and longitude.
    """
    lat: float = Field(..., description="Latitude")
    long: float = Field(..., description="Longitude")


class LocationHierarchy(BaseModel):
    """
    Hierarchical location identifiers. All fields optional.
    """
    country: Optional[str] = Field(None, description="Country name")
    state: Optional[str] = Field(None, description="State name")
    district: Optional[str] = Field(None, description="District name")
    village: Optional[str] = Field(None, description="Village name")


class TimeYearly(BaseModel):
    """
    Placeholder for yearly temporal hierarchy.
    TODO: Define actual fields, e.g., `year: int`, etc., as per your spec.
    """
    # Example field; replace or extend as needed:
    # year: int = Field(..., description="Year, e.g., 2025")
    pass


class TimeMonthly(BaseModel):
    """
    Placeholder for monthly temporal hierarchy.
    TODO: Define actual fields, e.g., `year: int`, `month: int`, etc., as per your spec.
    """
    # Example fields; replace or extend as needed:
    # year: int = Field(..., description="Year, e.g., 2025")
    # month: int = Field(..., ge=1, le=12, description="Month number, 1-12")
    pass


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
    id: UUID = Field(..., description="Unique dataset ID (UUID)")
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
    spatialHierarchy: Optional[Union[LocationLatLong, LocationHierarchy]] = Field(
        None,
        description="One of LocationLatLong or LocationHierarchy, if isSpatial=True"
    )
    isTemporal: bool = Field(..., description="Whether the dataset has any temporal identifiers")
    temporalHierarchy: Optional[Union[TimeYearly, TimeMonthly]] = Field(
        None,
        description="One of TimeYearly or TimeMonthly, if isTemporal=True"
    )


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
