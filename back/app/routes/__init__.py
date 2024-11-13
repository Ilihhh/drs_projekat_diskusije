from .korisnici import korisnici_blueprint

def initialize_routes(app):
    app.register_blueprint(korisnici_blueprint)
