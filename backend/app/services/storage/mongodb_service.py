import math 
from uuid import uuid4
from datetime import datetime, timezone
import pandas as pd
from typing import List
from app.db.database import datasets_collection


def store_to_mongodb(dataset_id: str, dataset_name: str, user_id: str, username: str, dataset_df: List[dict]) -> dict: 

    current_time = datetime.now(timezone.utc).isoformat()

    # Check if dataset already exists using dataset_id
    existing_doc = datasets_collection.find_one({"dataset_id": dataset_id, "user_id": user_id})

    if existing_doc:
        # Update only metadata & data, keep same _id
        datasets_collection.update_one(
            {"_id": existing_doc["_id"]},
            {
                "$set": {
                    "record_count": len(dataset_df),
                    "data": dataset_df,
                    "updated_at": current_time
                }
            }
        )
        return {
            "id": str(existing_doc["_id"]),
            "user_id": user_id,
            "updated": True,
            "dataset_id": dataset_id,
            "dataset_name": dataset_name,
            "record_count": len(dataset_df)
        }

    else:
        # Generate new document ID but use passed dataset_id
        new_doc_id = uuid4().hex
        
        # Insert as a new dataset
        wrapper_doc = {
            "_id": new_doc_id,
            "dataset_id": dataset_id,  # Use the passed dataset_id
            "dataset_name": dataset_name,
            "user_id": user_id,
            "username": username,
            "created_at": current_time,
            "updated_at": current_time,
            "record_count": len(dataset_df),
            "description": "",
            "tags": [],
            "permissions": "public",
            "dataset_type": "",
            "is_spatial": False,
            "is_temporal": False,
            "data": dataset_df
        }

        datasets_collection.insert_one(wrapper_doc)

        return {
            "id": str(wrapper_doc["_id"]),
            "inserted": True,
            "dataset_id": dataset_id,  # Return the passed dataset_id
            "dataset_name": dataset_name,
            "record_count": len(dataset_df)
        }


def sanitize_document(doc):
    def sanitize_value(value):
        if isinstance(value, float):
            if math.isnan(value) or math.isinf(value):
                return None  # or use 0.0, depending on your use case
        elif isinstance(value, dict):
            return {k: sanitize_value(v) for k, v in value.items()}
        elif isinstance(value, list):
            return [sanitize_value(v) for v in value]
        return value

    doc["_id"] = str(doc["_id"])
    return {k: sanitize_value(v) for k, v in doc.items()}

def get_data_from_collection(collection = datasets_collection, dataset_id: str = None, offset: int = 0, limit: int = 9):
    try:
        if dataset_id:
            # Fetch the single dataset document
            doc = collection.find_one({"dataset_id": dataset_id})
            if not doc:
                return []

            doc = sanitize_document(doc)

            # Apply pagination to the "data" array inside the document
            total_count = len(doc.get("data", []))
            paginated_rows = doc.get("data", [])[offset:offset + limit]

            return {
                "_id": doc["_id"],
                "dataset_id": doc.get("dataset_id"),
                "dataset_name": doc.get("dataset_name"),
                "user_id": doc.get("user_id"),
                "username": doc.get("username"),
                "description": doc.get("description", ""),
                "total_count": total_count,
                "offset": offset,
                "limit": limit,
                "rows": paginated_rows
            }

        else:
            # Pagination applies to documents themselves
            cursor = collection.find().skip(offset).limit(limit)
            documents = [sanitize_document(doc) for doc in cursor]

            return [
                {
                    "_id": doc["_id"],
                    "dataset_id": doc.get("dataset_id"),
                    "dataset_name": doc.get("dataset_name"),
                    "user_id": doc.get("user_id"),
                    "username": doc.get("username"),
                    "description": doc.get("description", ""),
                    "created_at": doc.get("created_at"),
                    "updated_at": doc.get("updated_at"),
                
                }
                for doc in documents
            ]

    except Exception as e:
        raise RuntimeError(f"Error fetching documents: {e}")