import os
import json 
import pandas as pd
from dotenv import load_dotenv

from app.config.logging import get_logger, setup_logging
from erp_client.erp_next_client import ERPNextClient

setup_logging()
logger = get_logger("services.erp")
load_dotenv()

# fields = ["naming_series","subject","customer","raised_by","status","priority","issue_type",
#           "issue_split_from","description","service_level_agreement","response_by","response_by_variance",
#           "agreement_status","resolution_by","resolution_by_variance","service_level_agreement_creation",
#           "on_hold_since","total_hold_time","first_response_time","first_responded_on","avg_response_time",
#           "resolution_details","opening_date","opening_time","resolution_date","resolution_time",""
#           "user_resolution_time","lead","contact","email_account","customer_name","project","company",
#           "via_customer_portal","attachment","content_type"]

# fields_2 = ["farmer_name"]
# {"name":"SLC-2502230508","owner":"srikanth@csa-india.org","creation":"2023-02-25 11:51:36.021487","modified":"2023-02-27 10:19:10.808445","modified_by":"srikanth@csa-india.org","docstatus":0,"idx":0,"sample_collection_date_time":"2021-12-06 13:22:00","farmer_name":"Machhindra Nana Tupe","phone_number":"9960280057","aadhar_no":"0","location":"{\"type\":\"FeatureCollection\",\"features\":[{\"type\":\"Feature\",\"properties\":{\"point_type\":\"circle\",\"radius\":115.86642126053913},\"geometry\":{\"type\":\"Point\",\"coordinates\":[75.025889,19.957588]}}]}","latitude":19.96,"longitude":75.02,"village":"Vairagad sy 68","survey_number":"68","earthworm_count":"0","doctype":"Soil Collection Data","__last_sync_on":"2025-08-07T12:17:08.270Z"}
def get_dataset_with_fields(client: ERPNextClient, dataset_id: str, fields: list = None, limit_page_length: int = 10) -> pd.DataFrame:
    if fields is None:
        fields = ["*"]
        
    endpoint = f"{client.base_url}/api/resource/{dataset_id}"
    fields_json = str(fields).replace("'", '"')

    params = {
        'limit_page_length': limit_page_length,
        'fields': json.dumps(fields),
    }

    response = client.session.get(endpoint, params=params)
    response.raise_for_status()

    records = response.json().get("data", [])
    return pd.DataFrame(records)

def pull_dataset(dataset_name: str) -> pd.DataFrame:
    erp_uri = os.getenv("ERP_URI")
    erp_username = os.getenv("ERP_USERNAME")
    erp_password = os.getenv("ERP_PASSWORD")

    if not all([erp_uri, erp_username, erp_password]):
        raise ValueError("Missing required environment variables: ERP_URI, ERP_USERNAME, ERP_PASSWORD")

    try:
        logger.info(f"Connecting to ERP instance: {erp_uri}")
        client = ERPNextClient(base_url=erp_uri)

        client.login(username=erp_username, password=erp_password)
        logger.info("Successfully logged in to ERP")

        logger.info(f"Fetching dataset: {dataset_name}")
        dataset = client.get_dataset(dataset_name)
        logger.info(f"Dataset contents:\n{dataset.head()}")

        logger.info("Syncing dataset with selected fields from index 0...")
        sync_data = get_dataset_with_fields(client, dataset_name)
        logger.info(f"Synced data:\n{sync_data.head()}")

        # logger.info("Converting the data into json")
        # sync_data = sync_data.to_json(orient = "records")
        # sync_data = json.dumps(sync_data, indent = 2)

        return sync_data

    except Exception as e:
        logger.exception("Error while pulling dataset")
        raise


if __name__ == "__main__":
    print(pull_dataset("Soil Collection Data"))
