import re
from typing import Optional, Tuple
from models import DocumentCategory


class DocumentClassifier:
    """Classifies document text into one of the 7 official Guri24 RMS document categories."""

    PATTERNS = {
        DocumentCategory.NATIONAL_ID: [
            r"republic\s+of\s+kenya",
            r"national\s+identity\s+card",
            r"jamhuri\s+ya\s+kenya",
            r"kitambulisho",
            r"serial\s+number",
            r"date\s+of\s+birth",
            r"district\s+of\s+birth",
            r"alien\s+(identity\s+)?card",
            r"passport\s+no",
            r"id\s+number",
        ],
        DocumentCategory.RENTAL_AGREEMENT: [
            r"tenancy\s+agreement",
            r"residential\s+lease\s+agreement",
            r"lease\s+agreement",
            r"demised\s+premises",
            r"landlord\s+and\s+tenant",
            r"monthly\s+rent",
            r"security\s+deposit",
            r"tenant\s+covenants",
            r"quiet\s+enjoyment",
            r"term\s+of\s+the\s+lease",
        ],
        DocumentCategory.PAYMENT_RECEIPT: [
            r"payment\s+receipt",
            r"official\s+receipt",
            r"received\s+from",
            r"being\s+payment\s+of",
            r"receipt\s+no",
            r"amount\s+received",
            r"payment\s+method",
            r"mpesa\s+receipt",
            r"paid\s+with\s+thanks",
        ],
        DocumentCategory.BANK_STATEMENT: [
            r"bank\s+statement",
            r"account\s+statement",
            r"account\s+number",
            r"opening\s+balance",
            r"closing\s+balance",
            r"statement\s+period",
            r"total\s+debits",
            r"total\s+credits",
            r"value\s+date",
            r"equity\s+bank",
            r"kcb\s+bank",
            r"standard\s+chartered",
            r"co-operative\s+bank",
            r"absa\s+bank",
        ],
        DocumentCategory.MPESA_STATEMENT: [
            r"safaricom\s+m-?pesa\s+statement",
            r"m-?pesa\s+statement",
            r"mpesa\s+transaction",
            r"paid\s+in",
            r"withdrawn",
            r"balance\s+after",
            r"transaction\s+id",
            r"lipa\s+na\s+m-?pesa",
            r"paybill",
            r"buy\s+goods",
        ],
        DocumentCategory.INVOICE: [
            r"tax\s+invoice",
            r"invoice\s+no",
            r"invoice\s+date",
            r"due\s+date",
            r"billed\s+to",
            r"subtotal",
            r"vat\s+(16%|amount)",
            r"total\s+amount\s+due",
            r"total\s+payable",
        ],
        DocumentCategory.PROPERTY_DOCUMENT: [
            r"title\s+deed",
            r"certificate\s+of\s+lease",
            r"certificate\s+of\s+title",
            r"land\s+reference\s+no",
            r"l\.?r\.?\s*no",
            r"registered\s+proprietor",
            r"allotment\s+letter",
            r"letter\s+of\s+allotment",
            r"land\s+registrar",
            r"rate\s+clearance",
            r"parcel\s+number",
        ],
    }

    @classmethod
    def classify(cls, text: str, category_hint: Optional[str] = None) -> Tuple[str, float]:
        """
        Classifies document text and returns (category_name, confidence).
        If category_hint is provided and matches, verifies against text indicators.
        """
        if not text or not text.strip():
            # If text is empty, honor category_hint if supplied, else general
            return category_hint or DocumentCategory.GENERAL_DOCUMENT.value, 0.0

        text_lower = text.lower()
        scores = {}

        for category, patterns in cls.PATTERNS.items():
            matches = sum(1 for p in patterns if re.search(p, text_lower))
            if matches > 0:
                scores[category.value] = matches

        if not scores:
            if category_hint:
                return category_hint, 50.0
            return DocumentCategory.GENERAL_DOCUMENT.value, 30.0

        sorted_cats = sorted(scores.items(), key=lambda item: item[1], reverse=True)
        top_cat, top_score = sorted_cats[0]

        # Calculate confidence based on pattern density
        confidence = min(98.0, 50.0 + (top_score * 12.0))

        # If user explicitly requested category_hint and it had matches, prioritize it
        if category_hint and category_hint in scores:
            return category_hint, max(confidence, 80.0)

        return top_cat, round(confidence, 2)
