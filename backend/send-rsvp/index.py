import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Принимает RSVP-анкету гостя и отправляет её на почту невесты."""

    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    try:
        body = json.loads(event.get("body") or "{}")
    except Exception:
        return {"statusCode": 400, "headers": cors_headers, "body": json.dumps({"error": "Invalid JSON"})}

    name = body.get("name", "").strip()
    guests = body.get("guests", "1")
    diet = body.get("diet", "").strip()
    message = body.get("message", "").strip()

    if not name:
        return {"statusCode": 400, "headers": cors_headers, "body": json.dumps({"error": "Имя обязательно"})}

    gmail_password = os.environ.get("GMAIL_APP_PASSWORD", "")
    sender_email = "yudakhinakseniya@gmail.com"
    receiver_email = "yudakhinakseniya@gmail.com"

    diet_line = diet if diet else "не указано"
    message_line = message if message else "не указано"

    guests_word = "гость" if guests == "1" else "гостя"

    html_body = f"""
    <div style="font-family: Georgia, serif; max-width: 560px; margin: 0 auto; background: #fdf8f5; padding: 40px; border-radius: 16px;">
      <h1 style="color: #c97a8f; font-size: 28px; margin-bottom: 8px; text-align: center;">💌 Новый RSVP</h1>
      <p style="color: #9a7080; text-align: center; margin-bottom: 32px; font-size: 14px;">Свадьба Игоря &amp; Ксении · 30 августа 2026</p>
      <table style="width:100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 12px 16px; background: #fff; border-radius: 8px 8px 0 0; border-bottom: 1px solid #f2dce2; color: #9a7080; font-size: 13px; width: 40%;">Имя гостя</td>
          <td style="padding: 12px 16px; background: #fff; border-radius: 8px 8px 0 0; border-bottom: 1px solid #f2dce2; color: #3a2530; font-weight: bold;">{name}</td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; background: #fff; border-bottom: 1px solid #f2dce2; color: #9a7080; font-size: 13px;">Количество гостей</td>
          <td style="padding: 12px 16px; background: #fff; border-bottom: 1px solid #f2dce2; color: #3a2530;">{guests} {guests_word}</td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; background: #fff; border-bottom: 1px solid #f2dce2; color: #9a7080; font-size: 13px;">Пожелания по меню</td>
          <td style="padding: 12px 16px; background: #fff; border-bottom: 1px solid #f2dce2; color: #3a2530;">{diet_line}</td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; background: #fff; border-radius: 0 0 8px 8px; color: #9a7080; font-size: 13px;">Пожелания молодожёнам</td>
          <td style="padding: 12px 16px; background: #fff; border-radius: 0 0 8px 8px; color: #3a2530; font-style: italic;">{message_line}</td>
        </tr>
      </table>
      <p style="color: #c9a0ae; font-size: 12px; text-align: center; margin-top: 32px;">Свадебный сайт Игоря &amp; Ксении</p>
    </div>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"💌 RSVP от {name} — Свадьба 30.08.2026"
    msg["From"] = sender_email
    msg["To"] = receiver_email
    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, gmail_password)
            server.sendmail(sender_email, receiver_email, msg.as_string())
    except Exception as e:
        return {"statusCode": 500, "headers": cors_headers, "body": json.dumps({"error": f"Ошибка отправки: {str(e)}"})}

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({"ok": True, "message": "Анкета отправлена"}),
    }
