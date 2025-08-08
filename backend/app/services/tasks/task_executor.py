import threading
import uuid
from typing import Dict, Any

from app.utils.erp import pull_dataset
from app.services.storage.mongodb_service import store_to_mongodb
from app.config.logging import LoggerMixin

# In-memory store for task metadata
tasks: Dict[str, Dict[str, Any]] = {}


class TaskRunner(LoggerMixin):
    def run_pipeline_task(self, dataset_id: str, exec_id: str):
        self.logger.info(f"[Thread: {threading.current_thread().name}] Starting task {exec_id} for dataset {dataset_id}")

        try:
            dataset = pull_dataset(dataset_id) 
            self.logger.info(f"[{exec_id}] Pulled dataset with {len(dataset)} records.")

            dataset_json = dataset.to_dict(orient="records")

            result = store_to_mongodb(dataset_id, dataset_json)
            self.logger.info(f"[{exec_id}] Dataset stored successfully in MongoDB.")

            tasks[exec_id]["status"] = "completed"
            tasks[exec_id]["result"] = result

        except Exception as e:
            self.logger.error(f"[{exec_id}] Task failed with error: {e}", exc_info=True)
            tasks[exec_id]["status"] = "error"
            tasks[exec_id]["error"] = str(e)

task_runner = TaskRunner()

def submit_task(dataset_id: str) -> str:
    exec_id = str(uuid.uuid4())

    tasks[exec_id] = {
        "status": "running",
        "result": None,
        "error": None
    }

    thread = threading.Thread(
        target = task_runner.run_pipeline_task,
        args = (dataset_id, exec_id),
        name = f"TaskThread-{exec_id[:8]}"
    )
    
    thread.start()

    return tasks[exec_id], exec_id

def get_task_status(exec_id: str) -> Dict[str, Any]:
    task = tasks.get(exec_id)
    if not task:
        return {"status": "not found"}

    return {
        "status": task["status"],
        "result": task.get("result"),
        "error": task.get("error")
    }
