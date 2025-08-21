from bson import ObjectId
from fastapi import APIRouter, HTTPException
from app.utils.erp import pull_dataset
from app.db.database import collection
from app.schemas.models import RunPipeline, PipelineStatus 
from app.services.storage.mongodb_service import store_to_mongodb
from app.services.tasks.task_executor import submit_task, get_task_status

run_router = APIRouter()

@run_router.post("/run")
async def run_pipeline(request: RunPipeline):
    dataset = pull_dataset(request.dataset_id) 
    dataset_json = dataset.to_dict(orient="records")
    result = store_to_mongodb(request.dataset_id, dataset_json) 
    return {
        "status": "success",
        "result": result 
    }

@run_router.post("/run-dataset")
def run_dataset(request: RunPipeline):
    try:
        dataset_doc = collection.find_one({"_id": ObjectId(request.dataset_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid dataset_id format.")

    if not dataset_doc:
        raise HTTPException(status_code=404, detail="Dataset not found.")

    dataset_name = dataset_doc.get("dataset_name")
    if not dataset_name:
        raise HTTPException(status_code=400, detail="Dataset name missing in record.")

    # Pass dataset_name to submit_task
    result, exec_id = submit_task(request.dataset_id, dataset_name, request.user_id, request.username)

    return {
        "execution_id": exec_id,
        "status": result["status"]
    }

@run_router.get("/pipelineStatus")
def get_pipeline_status(request: PipelineStatus):
    return get_task_status(request.dataset_id, request.user_id) 