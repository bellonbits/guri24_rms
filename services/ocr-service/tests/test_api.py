import pytest
from fastapi.testclient import TestClient
from server import app, JOB_STORE
from models import JobStatus


@pytest.fixture
def client():
    return TestClient(app)


def test_health_endpoint(client):
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["service"] == "guri24-tesseract-ocr-intelligence"
    assert data["engine"] == "tesseract-ocr"
    assert "installed_languages" in data
    assert "tesseract_installed" in data


def test_metrics_endpoint(client):
    res = client.get("/metrics")
    assert res.status_code == 200
    assert "text/plain" in res.headers["content-type"]
    body = res.text
    assert "ocr_requests_total" in body
    assert "ocr_processing_duration_seconds" in body
    assert "ocr_pages_processed_total" in body


def test_extract_with_hint_and_review_workflow(client):
    req_payload = {
        "file_name": "national_id_mwangi.pdf",
        "mime_type": "application/pdf",
        "file_size_bytes": 1024,
        "page_count": 1,
        "organization_id": "org-guri24-001",
        "category": "TENANT_IDENTIFICATION",
        "raw_content_hint": """
        REPUBLIC OF KENYA
        NATIONAL IDENTITY CARD
        ID NUMBER: 29845120
        FULL NAME: PETER GATITU MWANGI
        DATE OF BIRTH: 15/08/1992
        SEX: MALE
        """,
    }

    res = client.post("/v1/ocr/extract", json=req_payload)
    assert res.status_code == 200
    data = res.json()

    job_id = data["job_id"]
    assert data["status"] == JobStatus.NEEDS_REVIEW.value
    assert data["authoritative_record_applied"] is False
    assert data["overall_confidence_pct"] > 0
    assert len(data["fields"]) >= 2

    # Verify all fields are marked unverified
    for field in data["fields"]:
        assert field["verified"] is False

    # Review Approval Workflow
    review_payload = {
        "decision": "APPROVED",
        "reviewer_user_id": "usr-admin-001",
        "review_notes": "Identity details verified against physical card",
        "field_corrections": {
            "full_name": "Peter Gatitu Mwangi (Verified)",
        },
    }
    rev_res = client.post(f"/v1/ocr/jobs/{job_id}/review", json=review_payload)
    assert rev_res.status_code == 200
    rev_data = rev_res.json()
    assert rev_data["status"] == JobStatus.VERIFIED.value
    assert rev_data["decision"] == "APPROVED"

    # Query updated job
    get_res = client.get(f"/v1/ocr/jobs/{job_id}")
    assert get_res.status_code == 200
    updated_job = get_res.json()
    assert updated_job["status"] == JobStatus.VERIFIED.value
    name_field = next(f for f in updated_job["fields"] if f["field_key"] == "full_name")
    assert name_field["corrected_value"] == "Peter Gatitu Mwangi (Verified)"
    assert name_field["verified"] is True


def test_zero_fake_data_policy_on_empty_document(client):
    req_payload = {
        "file_name": "blank_scanned_page.pdf",
        "mime_type": "application/pdf",
        "file_size_bytes": 500,
        "page_count": 1,
        "organization_id": "org-guri24-001",
        "category": "LEASE_AGREEMENT",
        "raw_content_hint": "",  # Empty document text
    }

    res = client.post("/v1/ocr/extract", json=req_payload)
    assert res.status_code == 200
    data = res.json()

    assert data["raw_text"] == ""
    assert data["overall_confidence_pct"] == 0.0
    assert data["fields"] == []
    assert data["status"] == JobStatus.NEEDS_REVIEW.value
