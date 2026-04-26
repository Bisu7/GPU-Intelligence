import logging
from typing import Optional

logger = logging.getLogger(__name__)

class NotificationService:
    @staticmethod
    def send_slack_alert(message: str, channel: Optional[str] = None):
        # In a real app, use slack_sdk
        logger.info(f"[SLACK ALERT] {channel or 'default'}: {message}")
        print(f"[SLACK ALERT] {channel or 'default'}: {message}")

    @staticmethod
    def send_email_alert(subject: str, body: str, recipient: str):
        # In a real app, use fastapi-mail or smtplib
        logger.info(f"[EMAIL ALERT] To: {recipient}, Subject: {subject}")
        print(f"[EMAIL ALERT] To: {recipient}, Subject: {subject}")

notification_service = NotificationService()
