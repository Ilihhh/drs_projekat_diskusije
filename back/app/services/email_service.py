from flask import current_app  # type: ignore
from flask_mail import Message  # type: ignore
from . import mail  # Uvozite mail instancu iz vaše aplikacije
import threading

class EmailService:
    @staticmethod
    def send_email(recipient, subject, body):
        """Asinkrono slanje emailova pomoću thread-a."""
        try:
            # Kreiranje novog thread-a za slanje emaila
            threading.Thread(
                target=EmailService._send_email_sync,
                args=(recipient, subject, body, current_app._get_current_object())  # Prosleđivanje aplikacije
            ).start()
        except Exception as e:
            print(f"Error starting email thread: {e}")
            # Opcionalno: logujte grešku ili obavestite korisnika

    @staticmethod
    def _send_email_sync(recipient, subject, body, app):
        """Metoda za sinhrono slanje emaila (poziva se iz thread-a)."""
        # Postavljanje aplikacijskog konteksta unutar thread-a sa aplikacijom koja je prosleđena
        with app.app_context():  # Flask zahteva app_context za rad sa konfiguracijom
            msg = Message(
                subject=subject,
                recipients=[recipient],
                sender=current_app.config['MAIL_DEFAULT_SENDER'],
            )
            msg.body = body
            try:
                mail.send(msg)
                print(f"Email sent to {recipient}")
            except Exception as e:
                print(f"Error sending email to {recipient}: {e}")
