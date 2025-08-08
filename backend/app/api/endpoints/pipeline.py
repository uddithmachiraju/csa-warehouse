from fastapi import APIRouter, HTTPException
from app.utils.erp import pull_dataset
from app.schemas.models import RunPipeline
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
    result, exec_id = submit_task(request.dataset_id)
    return {
        "status": "submitted",
        "execution_id": exec_id,
        "result": result
    }

@run_router.get("/pipelineStatus/{exec_id}")
def get_pipeline_status(exec_id):
    return get_task_status(exec_id)