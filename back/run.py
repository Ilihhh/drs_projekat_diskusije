from app import create_app, socketio  # Importujemo socketio iz __init__.py

app = create_app()

if __name__ == "__main__":
    socketio.run(app, debug=True)  # SocketIO koristi svoj metod za pokretanje aplikacije
