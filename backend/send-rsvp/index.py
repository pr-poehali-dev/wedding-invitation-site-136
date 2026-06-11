import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import psycopg2


def handler(event: dict, context) -> dict:
    """Принимает RSVP-анкету гостя, сохраняет в БД и отправляет на почту невесты."""

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
    alcohol = body.get("alcohol", "").strip()
    accommodation = body.get("accommodation", "").strip()

    if not name:
        return {"statusCode": 400, "headers": cors_headers, "body": json.dumps({"error": "Имя обязательно"})}

    guests_word = "гость" if guests == "1" else "гостя"
    alcohol_line = alcohol if alcohol else "не указано"
    accommodation_line = accommodation if accommodation else "не указано"

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
          <td style="padding: 12px 16px; background: #fff; border-bottom: 1px solid #f2dce2; color: #9a7080; font-size: 13px;">Пожелания по алкоголю</td>
          <td style="padding: 12px 16px; background: #fff; border-bottom: 1px solid #f2dce2; color: #3a2530;">{alcohol_line}</td>
        </tr>
        <tr>
          <td style="padding: 12px 16px; background: #fff; border-radius: 0 0 8px 8px; color: #9a7080; font-size: 13px;">Есть где остановиться</td>
          <td style="padding: 12px 16px; background: #fff; border-radius: 0 0 8px 8px; color: #3a2530;">{accommodation_line}</td>
        </tr>
      </table>
      <p style="color: #c9a0ae; font-size: 12px; text-align: center; margin-top: 32px;">Свадебный сайт Игоря &amp; Ксении</p>
    </div>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"💌 RSVP от {name} — Свадьба 30.08.2026"
    msg["From"] = "yudakhinakseniya@gmail.com"
    msg["To"] = "yudakhinakseniya@gmail.com"
    msg.attach(MIMEText(html_body, "html"))

    name_s = name.replace("'", "''")
    alcohol_s = ("'" + alcohol.replace("'", "''") + "'") if alcohol else "NULL"
    accommodation_s = ("'" + accommodation.replace("'", "''") + "'") if accommodation else "NULL"

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor()
    cur.execute(f"INSERT INTO rsvp (name, guests, alcohol, accommodation) VALUES ('{name_s}', {int(guests)}, {alcohol_s}, {accommodation_s})")
    conn.commit()
    cur.close()
    conn.close()

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login("yudakhinakseniya@gmail.com", os.environ.get("GMAIL_APP_PASSWORD", ""))
            server.sendmail("yudakhinakseniya@gmail.com", "yudakhinakseniya@gmail.com", msg.as_string())
    except Exception as e:
        return {"statusCode": 500, "headers": cors_headers, "body": json.dumps({"error": f"Ошибка отправки: {str(e)}"})}

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({"ok": True, "message": "Анкета отправлена"}),
    }
