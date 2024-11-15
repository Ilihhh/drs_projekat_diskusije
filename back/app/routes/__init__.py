from .users import users_blueprint

def initialize_routes(app):
    app.register_blueprint(users_blueprint)
