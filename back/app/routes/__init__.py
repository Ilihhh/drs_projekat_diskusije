from .users import users_blueprint
from .topics import topics_blueprint
from .discussions import discussions_blueprint

def initialize_routes(app):
    app.register_blueprint(users_blueprint)
    app.register_blueprint(topics_blueprint)
    app.register_blueprint(discussions_blueprint)
