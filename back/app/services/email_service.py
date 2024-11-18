from flask import current_app  # type: ignore
from flask_mail import Message  # type: ignore
from . import mail  # Uvozite mail instancu iz vaše aplikacije

class EmailService:
    @staticmethod
    def send_email(recipient, subject, body):
        """Metoda za slanje e-pošte"""
        msg = Message(subject=subject, recipients=[recipient], sender=current_app.config['MAIL_DEFAULT_SENDER'])
        msg.body = body

        try:
            mail.send(msg)
        except Exception as e:
            print(f"Error sending email: {e}")
            # Opcionalno: Dodajte logovanje ili dodatne obavesti korisnika u slučaju greške
