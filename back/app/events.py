from .socketio import socketio

@socketio.on('connect')
def handle_connect():
    print("Client connected")
    socketio.emit('message', {'data': 'Welcome from Flask!'})
