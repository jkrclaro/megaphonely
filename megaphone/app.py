import os
from distutils.util import strtobool

from flask import Flask

def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ['SQLALCHEMY_DATABASE_URI']
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = bool(strtobool(os.environ['SQLALCHEMY_TRACK_MODIFICATIONS']))

    from .models import db
    db.init_app(app)

    from .views.admin import admin
    from .views.home import home
    from .views.health import health
    app.register_blueprint(admin)
    app.register_blueprint(home)
    app.register_blueprint(health)

    return app
