import re
from typing import Dict, List, Optional
from models import DocumentCategory, ExtractedField, PageExtraction


class StructuredExtractor:
    """Transforms raw OCR text into structured fields per document category."""

    @staticmethod
    def _clean_val(raw: str) -> str:
        return raw.strip().lstrip("-:*• ").rstrip(".,;")

    @staticmethod
    def _find_page_number(field_val: str, pages: List[PageExtraction]) -> int:
        """Finds which page number contained the extracted field value."""
        if not field_val or not pages:
            return 1
        val_clean = field_val.strip().lower()
        for p in pages:
            if val_clean in p.text.lower():
                return p.page_number
        return 1

    @classmethod
    def extract_national_id(cls, text: str, pages: List[PageExtraction]) -> List[ExtractedField]:
        fields: List[ExtractedField] = []

        # Full Name
        name_match = re.search(r"(?:FULL\s+NAMES?|NAME|JINA)[:\s]+([A-Z\s]{4,40})", text, re.IGNORECASE)
        if name_match:
            name_val = cls._clean_val(name_match.group(1))
            fields.append(
                ExtractedField(
                    field_key="full_name",
                    field_label="Full Name",
                    extracted_value=name_val,
                    confidence_pct=95.0,
                    source_page=cls._find_page_number(name_val, pages),
                    is_sensitive_pii=True,
                    verified=False,
                )
            )

        # ID Number
        id_match = re.search(r"(?:ID\s+NUMBER|IDENTITY\s+NO|ID\s+NO|NAMBARI\s+YA\s+KITAMBULISHO)[:\s]*([0-9]{7,9})", text, re.IGNORECASE)
        if not id_match:
            id_match = re.search(r"\b([1-4][0-9]{7})\b", text)
        if id_match:
            id_val = id_match.group(1).strip()
            val_err = None if (7 <= len(id_val) <= 8) else "Kenyan National ID must be 7 to 8 digits"
            fields.append(
                ExtractedField(
                    field_key="id_number",
                    field_label="ID Number",
                    extracted_value=id_val,
                    confidence_pct=98.0 if not val_err else 60.0,
                    source_page=cls._find_page_number(id_val, pages),
                    is_sensitive_pii=True,
                    verified=False,
                    validation_error=val_err,
                )
            )

        # Date of Birth
        dob_match = re.search(r"(?:DATE\s+OF\s+BIRTH|DOB|TAREHE\s+YA\s+KUZALIWA)[:\s]*([0-9]{1,2}[./-][0-9]{1,2}[./-][0-9]{2,4})", text, re.IGNORECASE)
        if dob_match:
            dob_val = dob_match.group(1).strip()
            fields.append(
                ExtractedField(
                    field_key="date_of_birth",
                    field_label="Date of Birth",
                    extracted_value=dob_val,
                    confidence_pct=94.0,
                    source_page=cls._find_page_number(dob_val, pages),
                    is_sensitive_pii=True,
                    verified=False,
                )
            )

        # Gender / Sex
        gender_match = re.search(r"(?:SEX|GENDER|JINSIA)[:\s]*\b(MALE|FEMALE|M|F)\b", text, re.IGNORECASE)
        if gender_match:
            g_raw = gender_match.group(1).upper()
            g_val = "MALE" if g_raw in ("M", "MALE") else "FEMALE"
            fields.append(
                ExtractedField(
                    field_key="gender",
                    field_label="Gender",
                    extracted_value=g_val,
                    confidence_pct=96.0,
                    source_page=cls._find_page_number(gender_match.group(0), pages),
                    is_sensitive_pii=False,
                    verified=False,
                )
            )

        return fields

    @classmethod
    def extract_rental_agreement(cls, text: str, pages: List[PageExtraction]) -> List[ExtractedField]:
        fields: List[ExtractedField] = []

        # Landlord
        landlord_match = re.search(r"(?:LANDLORD|LESSOR|PROPERTY\s+OWNER)[:\s]+([A-Za-z0-9\s.,&'-]{3,50})", text, re.IGNORECASE)
        if landlord_match:
            ll_val = cls._clean_val(landlord_match.group(1))
            fields.append(
                ExtractedField(
                    field_key="landlord_name",
                    field_label="Landlord Name",
                    extracted_value=ll_val,
                    confidence_pct=92.0,
                    source_page=cls._find_page_number(ll_val, pages),
                    is_sensitive_pii=False,
                    verified=False,
                )
            )

        # Tenant
        tenant_match = re.search(r"(?:TENANT|LESSEE)[:\s]+([A-Za-z\s.,'-]{3,40})", text, re.IGNORECASE)
        if tenant_match:
            t_val = cls._clean_val(tenant_match.group(1))
            fields.append(
                ExtractedField(
                    field_key="tenant_name",
                    field_label="Tenant Name",
                    extracted_value=t_val,
                    confidence_pct=92.0,
                    source_page=cls._find_page_number(t_val, pages),
                    is_sensitive_pii=True,
                    verified=False,
                )
            )

        # Property Name & Unit Number
        prop_match = re.search(r"(?:PREMISES|PROPERTY|APARTMENT\s+COMPLEX)[:\s]+([A-Za-z0-9\s.,'-]{3,50})", text, re.IGNORECASE)
        if prop_match:
            p_val = cls._clean_val(prop_match.group(1))
            fields.append(
                ExtractedField(
                    field_key="property_name",
                    field_label="Property Name",
                    extracted_value=p_val,
                    confidence_pct=90.0,
                    source_page=cls._find_page_number(p_val, pages),
                    is_sensitive_pii=False,
                    verified=False,
                )
            )

        unit_match = re.search(r"(?:UNIT\s+NO|HOUSE\s+NO|APT\s+NO|DOOR\s+NO)[:\s]*([A-Za-z0-9\-]+)", text, re.IGNORECASE)
        if unit_match:
            u_val = unit_match.group(1).strip()
            fields.append(
                ExtractedField(
                    field_key="unit_number",
                    field_label="Unit Number",
                    extracted_value=u_val,
                    confidence_pct=95.0,
                    source_page=cls._find_page_number(u_val, pages),
                    is_sensitive_pii=False,
                    verified=False,
                )
            )

        # Monthly Rent
        rent_match = re.search(r"(?:MONTHLY\s+RENT|RENT\s+PAYABLE|RENT\s+OF)[:\s]*(?:KES|KSH)?\s*([0-9,]+(?:\.[0-9]{2})?)", text, re.IGNORECASE)
        if rent_match:
            r_val = rent_match.group(1).replace(",", "").strip()
            fields.append(
                ExtractedField(
                    field_key="monthly_rent_kes",
                    field_label="Monthly Rent (KES)",
                    extracted_value=r_val,
                    confidence_pct=95.0,
                    source_page=cls._find_page_number(rent_match.group(0), pages),
                    is_sensitive_pii=False,
                    verified=False,
                )
            )

        # Security Deposit
        deposit_match = re.search(r"(?:SECURITY\s+DEPOSIT|DEPOSIT\s+AMOUNT)[:\s]*(?:KES|KSH)?\s*([0-9,]+(?:\.[0-9]{2})?)", text, re.IGNORECASE)
        if deposit_match:
            d_val = deposit_match.group(1).replace(",", "").strip()
            fields.append(
                ExtractedField(
                    field_key="security_deposit_kes",
                    field_label="Security Deposit (KES)",
                    extracted_value=d_val,
                    confidence_pct=94.0,
                    source_page=cls._find_page_number(deposit_match.group(0), pages),
                    is_sensitive_pii=False,
                    verified=False,
                )
            )

        # Dates
        start_match = re.search(r"(?:COMMENCING\s+ON|COMMENCEMENT\s+DATE|START\s+DATE)[:\s]*([0-9]{1,2}[./-][0-9]{1,2}[./-][0-9]{2,4})", text, re.IGNORECASE)
        if start_match:
            s_val = start_match.group(1).strip()
            fields.append(
                ExtractedField(
                    field_key="lease_start_date",
                    field_label="Lease Start Date",
                    extracted_value=s_val,
                    confidence_pct=92.0,
                    source_page=cls._find_page_number(s_val, pages),
                    is_sensitive_pii=False,
                    verified=False,
                )
            )

        return fields

    @classmethod
    def extract_payment_receipt(cls, text: str, pages: List[PageExtraction]) -> List[ExtractedField]:
        fields: List[ExtractedField] = []

        # Receipt Number / Transaction Ref
        tx_match = re.search(r"(?:RECEIPT\s+NO|TRANS(?:ACTION)?\s+ID|REF(?:ERENCE)?\s+NO)[:\s]*([A-Z0-9]{8,15})", text, re.IGNORECASE)
        if not tx_match:
            tx_match = re.search(r"\b([A-Z0-9]{10})\b\s*(?:Confirmed|Confirmed\.)", text)
        if tx_match:
            tx_val = tx_match.group(1).strip().upper()
            fields.append(
                ExtractedField(
                    field_key="transaction_reference",
                    field_label="Transaction Reference",
                    extracted_value=tx_val,
                    confidence_pct=98.0,
                    source_page=cls._find_page_number(tx_val, pages),
                    is_sensitive_pii=False,
                    verified=False,
                )
            )

        # Amount
        amt_match = re.search(r"(?:AMOUNT\s+PAID|AMOUNT|KES|KSH)[:\s]*([0-9,]+(?:\.[0-9]{2})?)", text, re.IGNORECASE)
        if amt_match:
            a_val = amt_match.group(1).replace(",", "").strip()
            fields.append(
                ExtractedField(
                    field_key="amount_kes",
                    field_label="Amount (KES)",
                    extracted_value=a_val,
                    confidence_pct=96.0,
                    source_page=cls._find_page_number(amt_match.group(0), pages),
                    is_sensitive_pii=False,
                    verified=False,
                )
            )

        # Payer
        payer_match = re.search(r"(?:RECEIVED\s+FROM|PAID\s+BY|FROM)[:\s]+([A-Za-z\s.,'-]{3,40})", text, re.IGNORECASE)
        if payer_match:
            p_val = cls._clean_val(payer_match.group(1))
            fields.append(
                ExtractedField(
                    field_key="payer_name",
                    field_label="Payer Name",
                    extracted_value=p_val,
                    confidence_pct=90.0,
                    source_page=cls._find_page_number(p_val, pages),
                    is_sensitive_pii=True,
                    verified=False,
                )
            )

        # Date
        date_match = re.search(r"(?:DATE|ON)[:\s]*([0-9]{1,2}[./-][0-9]{1,2}[./-][0-9]{2,4})", text, re.IGNORECASE)
        if date_match:
            d_val = date_match.group(1).strip()
            fields.append(
                ExtractedField(
                    field_key="payment_date",
                    field_label="Payment Date",
                    extracted_value=d_val,
                    confidence_pct=93.0,
                    source_page=cls._find_page_number(d_val, pages),
                    is_sensitive_pii=False,
                    verified=False,
                )
            )

        return fields

    @classmethod
    def extract_bank_statement(cls, text: str, pages: List[PageExtraction]) -> List[ExtractedField]:
        fields: List[ExtractedField] = []

        # Account Number (Masked)
        acc_match = re.search(r"(?:ACCOUNT\s+NO|A/C\s+NO)[:\s]*([0-9]{8,16})", text, re.IGNORECASE)
        if acc_match:
            acc_val = acc_match.group(1).strip()
            masked = f"••••••••{acc_val[-4:]}" if len(acc_val) >= 4 else "••••••••"
            fields.append(
                ExtractedField(
                    field_key="account_number",
                    field_label="Account Number",
                    extracted_value=masked,
                    confidence_pct=95.0,
                    source_page=cls._find_page_number(acc_val, pages),
                    is_sensitive_pii=True,
                    verified=False,
                )
            )

        # Opening & Closing Balance
        open_match = re.search(r"(?:OPENING\s+BALANCE)[:\s]*(?:KES|KSH)?\s*([0-9,]+(?:\.[0-9]{2})?)", text, re.IGNORECASE)
        if open_match:
            fields.append(
                ExtractedField(
                    field_key="opening_balance",
                    field_label="Opening Balance",
                    extracted_value=open_match.group(1).replace(",", "").strip(),
                    confidence_pct=92.0,
                    source_page=cls._find_page_number(open_match.group(0), pages),
                    is_sensitive_pii=False,
                    verified=False,
                )
            )

        close_match = re.search(r"(?:CLOSING\s+BALANCE)[:\s]*(?:KES|KSH)?\s*([0-9,]+(?:\.[0-9]{2})?)", text, re.IGNORECASE)
        if close_match:
            fields.append(
                ExtractedField(
                    field_key="closing_balance",
                    field_label="Closing Balance",
                    extracted_value=close_match.group(1).replace(",", "").strip(),
                    confidence_pct=92.0,
                    source_page=cls._find_page_number(close_match.group(0), pages),
                    is_sensitive_pii=False,
                    verified=False,
                )
            )

        return fields

    @classmethod
    def extract_invoice(cls, text: str, pages: List[PageExtraction]) -> List[ExtractedField]:
        fields: List[ExtractedField] = []

        # Invoice Number
        inv_match = re.search(r"(?:INVOICE\s+NO|INVOICE\s+#)[:\s]*([A-Za-z0-9\-_/]+)", text, re.IGNORECASE)
        if inv_match:
            i_val = inv_match.group(1).strip()
            fields.append(
                ExtractedField(
                    field_key="invoice_number",
                    field_label="Invoice Number",
                    extracted_value=i_val,
                    confidence_pct=96.0,
                    source_page=cls._find_page_number(i_val, pages),
                    is_sensitive_pii=False,
                    verified=False,
                )
            )

        # Total Amount Due (excluding SUBTOTAL)
        tot_match = re.search(r"(?<!SUB)\b(?:TOTAL\s+AMOUNT\s+DUE|TOTAL\s+PAYABLE|AMOUNT\s+DUE|TOTAL)[:\s]*(?:KES|KSH)?\s*([0-9,]+(?:\.[0-9]{2})?)", text, re.IGNORECASE)
        if tot_match:
            t_val = tot_match.group(1).replace(",", "").strip()
            fields.append(
                ExtractedField(
                    field_key="total_amount_kes",
                    field_label="Total Amount (KES)",
                    extracted_value=t_val,
                    confidence_pct=95.0,
                    source_page=cls._find_page_number(tot_match.group(0), pages),
                    is_sensitive_pii=False,
                    verified=False,
                )
            )

        return fields

    @classmethod
    def extract_property_document(cls, text: str, pages: List[PageExtraction]) -> List[ExtractedField]:
        fields: List[ExtractedField] = []

        # Land Reference (LR) Number
        lr_match = re.search(r"(?:L\.?R\.?\s*NO|LAND\s+REFERENCE\s+NO)[:\s]*([0-9]+/[0-9]+(?:/[0-9]+)?)", text, re.IGNORECASE)
        if lr_match:
            lr_val = lr_match.group(1).strip()
            fields.append(
                ExtractedField(
                    field_key="lr_number",
                    field_label="Land Reference (LR) Number",
                    extracted_value=lr_val,
                    confidence_pct=96.0,
                    source_page=cls._find_page_number(lr_val, pages),
                    is_sensitive_pii=False,
                    verified=False,
                )
            )

        # Registered Proprietor
        prop_match = re.search(r"(?:REGISTERED\s+PROPRIETOR|PROPRIETOR)[:\s]+([A-Za-z\s.,'-]{3,50})", text, re.IGNORECASE)
        if prop_match:
            p_val = cls._clean_val(prop_match.group(1))
            fields.append(
                ExtractedField(
                    field_key="registered_proprietor",
                    field_label="Registered Proprietor",
                    extracted_value=p_val,
                    confidence_pct=92.0,
                    source_page=cls._find_page_number(p_val, pages),
                    is_sensitive_pii=True,
                    verified=False,
                )
            )

        return fields

    @classmethod
    def extract_fields(
        cls,
        category: str,
        text: str,
        pages: List[PageExtraction],
    ) -> List[ExtractedField]:
        """Routes text extraction to the appropriate category extractor."""
        if not text or not text.strip():
            return []

        cat_clean = category.lower()

        if "id" in cat_clean or "tenant_identification" in cat_clean:
            return cls.extract_national_id(text, pages)
        elif "rental" in cat_clean or "lease" in cat_clean:
            return cls.extract_rental_agreement(text, pages)
        elif "receipt" in cat_clean or "payment" in cat_clean:
            return cls.extract_payment_receipt(text, pages)
        elif "bank" in cat_clean or "statement" in cat_clean:
            return cls.extract_bank_statement(text, pages)
        elif "invoice" in cat_clean:
            return cls.extract_invoice(text, pages)
        elif "property" in cat_clean or "title" in cat_clean:
            return cls.extract_property_document(text, pages)

        # Generic key-value line fallback if format is "Key: Value"
        fields = []
        for line in text.splitlines():
            line_str = line.strip().lstrip("-*• ")
            if ":" in line_str:
                k, v = line_str.split(":", 1)
                k_clean = k.strip().lower().replace(" ", "_")
                v_clean = v.strip()
                if k_clean and v_clean and len(k_clean) <= 40:
                    fields.append(
                        ExtractedField(
                            field_key=k_clean,
                            field_label=k_clean.replace("_", " ").title(),
                            extracted_value=v_clean,
                            confidence_pct=88.0,
                            source_page=cls._find_page_number(v_clean, pages),
                            is_sensitive_pii=any(t in k_clean for t in ("id", "pin", "phone")),
                            verified=False,
                        )
                    )
        return fields
