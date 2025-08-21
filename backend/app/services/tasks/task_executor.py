import threading
import uuid
from datetime import datetime, timezone
from typing import Dict, Any

from app.utils.erp import pull_dataset
from app.services.storage.mongodb_service import store_to_mongodb
from app.config.logging import LoggerMixin
from app.db.database import pipeline_status, datasets_collection

# In-memory store for task metadata
tasks: Dict[str, Dict[str, Any]] = {}


class TaskRunner(LoggerMixin):
    def run_pipeline_task(self, dataset_id: str, dataset_name: str, user_id: str, username: str, exec_id: str):
        self.logger.info(f"[Thread: {threading.current_thread().name}] Starting task {exec_id} for dataset {dataset_id}")

        try:
            # Pull fresh dataset from ERP
            dataset = pull_dataset(dataset_name) 
            self.logger.info(f"[{exec_id}] Pulled dataset with {len(dataset)} records.")

            dataset_json = dataset.to_dict(orient="records")

            # Store/update dataset in MongoDB using the existing service
            # This handles both new inserts and updates automatically
            result = store_to_mongodb(dataset_id, dataset_name, user_id, username, dataset_json)
            
            # Get the actual dataset document ID from the result
            dataset_doc_id = result.get("id") 
            
            if result.get("updated"):
                self.logger.info(f"[{exec_id}] Updated existing dataset {dataset_id} with {len(dataset_json)} records.")
            elif result.get("inserted"):
                self.logger.info(f"[{exec_id}] Created new dataset {dataset_id} with {len(dataset_json)} records.")

            # Update in-memory status
            tasks[exec_id]["status"] = "completed"

            # Always create/update pipeline status using the dataset document ID
            pipeline_status.update_one(
                {"_id": dataset_doc_id},
                {
                    "$set": {
                        "_id": dataset_doc_id,
                        "dataset_id": dataset_id,
                        "name": dataset_name,
                        "user_id": user_id,
                        "exec_id": exec_id,
                        "status": "completed"
                    }
                },
                upsert=True
            )

        except Exception as e:
            self.logger.error(f"[{exec_id}] Task failed with error: {e}", exc_info=True)

            # Update in-memory status
            tasks[exec_id]["status"] = "error"

task_runner = TaskRunner()


def submit_task(dataset_id: str, dataset_name: str, user_id: str, username: str) -> tuple[dict, str]:
    exec_id = str(uuid.uuid4())

    # Only update pipeline status if dataset already exists
    existing_dataset = datasets_collection.find_one({"dataset_name": dataset_name, "user_id": user_id})
    
    if existing_dataset:
        # Set pipeline status to running for existing dataset
        pipeline_status.update_one(
            {"_id": existing_dataset["_id"]},
            {
                "$set": {
                    "_id": existing_dataset["_id"],
                    "dataset_id": dataset_name,
                    "name": dataset_name,
                    "user_id": user_id,
                    "exec_id": exec_id,
                    "status": "running"
                }
            },
            upsert=True
        )

    # Track in-memory task
    tasks[exec_id] = {"status": "running"}

    # Run task in background thread
    thread = threading.Thread(
        target=task_runner.run_pipeline_task,
        args=(dataset_id,dataset_name, user_id, username, exec_id),
        name=f"TaskThread-{exec_id[:8]}"
    )
    thread.start()

    return tasks[exec_id], exec_id


def get_task_status(dataset_id: str, user_id: str) -> Dict[str, Any]:
    # First find the dataset to get its ID
    dataset_doc = datasets_collection.find_one({"dataset_id": dataset_id, "user_id": user_id})
    
    if not dataset_doc:
        return {
            "status": "not found",
            "message": "No matching dataset for this user."
        }
    
    # Look up pipeline status using the same ID as the dataset document
    result = pipeline_status.find_one({"_id": dataset_doc["_id"]})

    if not result:
        return {
            "status": "not found",
            "message": "No pipeline status found for this dataset."
        }

    return {
        "exec_id": result.get("exec_id"),
        "status": result.get("status", "unknown")
    }