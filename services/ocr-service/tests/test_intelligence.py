import pytest
from intelligence.classifier import DocumentClassifier
from intelligence.extractors import StructuredExtractor
from models import DocumentCategory, PageExtraction


def test_classification_and_extraction_national_id():
    sample_text = """
    JAMHURI YA KENYA
    REPUBLIC OF KENYA
    NATIONAL IDENTITY CARD
    SERIAL NUMBER: 104829103
    ID NUMBER: 29845120
    FULL NAME: PETER GATITU MWANGI
    DATE OF BIRTH: 15/08/1992
    SEX: MALE
    DISTRICT OF BIRTH: NYERI
    """
    cat, conf = DocumentClassifier.classify(sample_text)
    assert cat == DocumentCategory.NATIONAL_ID.value
    assert conf >= 80.0

    pages = [PageExtraction(page_number=1, text=sample_text, word_count=30, confidence=95.0, is_scanned_ocr=False)]
    fields = StructuredExtractor.extract_fields(cat, sample_text, pages)

    field_map = {f.field_key: f for f in fields}
    assert "id_number" in field_map
    assert field_map["id_number"].extracted_value == "29845120"
    assert field_map["id_number"].is_sensitive_pii is True
    assert field_map["id_number"].verified is False
    assert field_map["id_number"].source_page == 1

    assert "full_name" in field_map
    assert "PETER GATITU MWANGI" in field_map["full_name"].extracted_value
    assert field_map["full_name"].verified is False


def test_classification_and_extraction_rental_agreement():
    sample_text = """
    RESIDENTIAL LEASE AGREEMENT
    This Tenancy Agreement is made between:
    LANDLORD: Guri24 Estates Management Ltd
    TENANT: Amina Hassan Mohamed
    PREMISES: Jacaranda Heights Apartments
    UNIT NO: B-204
    MONTHLY RENT: KES 45,000.00
    SECURITY DEPOSIT: KES 45,000.00
    COMMENCEMENT DATE: 01/01/2026
    The Tenant covenants to pay rent on or before the 5th of each month.
    """
    cat, conf = DocumentClassifier.classify(sample_text)
    assert cat == DocumentCategory.RENTAL_AGREEMENT.value

    pages = [PageExtraction(page_number=1, text=sample_text, word_count=45, confidence=95.0, is_scanned_ocr=False)]
    fields = StructuredExtractor.extract_fields(cat, sample_text, pages)
    field_map = {f.field_key: f for f in fields}

    assert field_map["monthly_rent_kes"].extracted_value == "45000.00"
    assert field_map["security_deposit_kes"].extracted_value == "45000.00"
    assert field_map["unit_number"].extracted_value == "B-204"
    assert "Amina Hassan" in field_map["tenant_name"].extracted_value


def test_classification_and_extraction_payment_receipt():
    sample_text = """
    OFFICIAL PAYMENT RECEIPT
    RECEIPT NO: QWE1234567
    DATE: 20/02/2026
    RECEIVED FROM: Brian Otieno
    AMOUNT PAID: KES 35,000.00
    BEING PAYMENT OF: February 2026 Rent Unit 101
    PAYMENT METHOD: M-PESA Paybill 882200
    """
    cat, conf = DocumentClassifier.classify(sample_text)
    assert cat == DocumentCategory.PAYMENT_RECEIPT.value

    pages = [PageExtraction(page_number=1, text=sample_text, word_count=25, confidence=95.0, is_scanned_ocr=False)]
    fields = StructuredExtractor.extract_fields(cat, sample_text, pages)
    field_map = {f.field_key: f for f in fields}

    assert field_map["transaction_reference"].extracted_value == "QWE1234567"
    assert field_map["amount_kes"].extracted_value == "35000.00"
    assert "Brian Otieno" in field_map["payer_name"].extracted_value


def test_classification_and_extraction_bank_statement():
    sample_text = """
    EQUITY BANK STATEMENT
    ACCOUNT NO: 0180293847561
    ACCOUNT STATEMENT
    STATEMENT PERIOD: 01/01/2026 to 31/01/2026
    OPENING BALANCE: KES 150,000.00
    TOTAL CREDITS: KES 450,000.00
    TOTAL DEBITS: KES 120,000.00
    CLOSING BALANCE: KES 480,000.00
    """
    cat, conf = DocumentClassifier.classify(sample_text)
    assert cat == DocumentCategory.BANK_STATEMENT.value

    pages = [PageExtraction(page_number=1, text=sample_text, word_count=30, confidence=95.0, is_scanned_ocr=False)]
    fields = StructuredExtractor.extract_fields(cat, sample_text, pages)
    field_map = {f.field_key: f for f in fields}

    assert "••••••••" in field_map["account_number"].extracted_value
    assert field_map["account_number"].extracted_value.endswith("7561")
    assert field_map["opening_balance"].extracted_value == "150000.00"
    assert field_map["closing_balance"].extracted_value == "480000.00"


def test_classification_and_extraction_invoice():
    sample_text = """
    TAX INVOICE
    INVOICE NO: INV-2026-904
    INVOICE DATE: 01/02/2026
    DUE DATE: 15/02/2026
    BILLED TO: Guri24 Rental Management Ltd
    SUBTOTAL: KES 25,000.00
    VAT 16%: KES 4,000.00
    TOTAL AMOUNT DUE: KES 29,000.00
    """
    cat, conf = DocumentClassifier.classify(sample_text)
    assert cat == DocumentCategory.INVOICE.value

    pages = [PageExtraction(page_number=1, text=sample_text, word_count=25, confidence=95.0, is_scanned_ocr=False)]
    fields = StructuredExtractor.extract_fields(cat, sample_text, pages)
    field_map = {f.field_key: f for f in fields}

    assert field_map["invoice_number"].extracted_value == "INV-2026-904"
    assert field_map["total_amount_kes"].extracted_value == "29000.00"


def test_classification_and_extraction_property_document():
    sample_text = """
    CERTIFICATE OF LEASE / TITLE DEED
    LAND REFERENCE NO: 209/14502/12
    COUNTY: NAIROBI
    REGISTERED PROPRIETOR: James Kariuki Mwangi
    PARCEL NUMBER: NAIROBI/BLOCK82/402
    LAND REGISTRAR SEAL AFFIXED
    """
    cat, conf = DocumentClassifier.classify(sample_text)
    assert cat == DocumentCategory.PROPERTY_DOCUMENT.value

    pages = [PageExtraction(page_number=1, text=sample_text, word_count=25, confidence=95.0, is_scanned_ocr=False)]
    fields = StructuredExtractor.extract_fields(cat, sample_text, pages)
    field_map = {f.field_key: f for f in fields}

    assert field_map["lr_number"].extracted_value == "209/14502/12"
    assert "James Kariuki" in field_map["registered_proprietor"].extracted_value
