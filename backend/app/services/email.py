import aiosmtplib
from email.message import EmailMessage
from app.config import settings

async def send_contact_email(name: str, email: str, message: str):
    if not settings.mail_username:
        return  # skip if not configured

    msg = EmailMessage()
    msg["Subject"] = f"New Portfolio Contact: {name}"
    msg["From"] = settings.mail_from or settings.mail_username
    msg["To"] = settings.contact_recipient or settings.mail_username
    msg["Reply-To"] = email
    msg.set_content(f"Name: {name}\nEmail: {email}\n\nMessage:\n{message}")

    try:
        await aiosmtplib.send(
            msg,
            hostname=settings.mail_host,
            port=settings.mail_port,
            username=settings.mail_username,
            password=settings.mail_password,
            start_tls=True,
        )
    except Exception:
        pass  # don't fail the request if email fails
