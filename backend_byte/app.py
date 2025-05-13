from flask import Flask
from db import db, migrate
from flask_jwt_extended import JWTManager
from flask_smorest import Api
from dotenv import load_dotenv
from models.usuario import Usuario
import os

load_dotenv()

def create_app():
    app = Flask(__name__)

    # Configuración principal
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URI")
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv("JWT_SECRET_KEY")

    # Configuración Swagger
    app.config['API_TITLE'] = 'Sistema de Gestión'
    app.config['API_VERSION'] = 'v1'
    app.config['OPENAPI_VERSION'] = '3.0.3'
    app.config['OPENAPI_URL_PREFIX'] = '/docs'
    app.config['OPENAPI_SWAGGER_UI_PATH'] = '/'
    app.config['OPENAPI_SWAGGER_UI_URL'] = 'https://cdn.jsdelivr.net/npm/swagger-ui-dist/'

    # Inicializar extensiones
    db.init_app(app)
    migrate.init_app(app, db)
    jwt = JWTManager(app)
    api = Api(app)
    
    app.config['API_SPEC_OPTIONS'] = {
        'security': [{'BearerAuth': []}],
        'components': {
            'securitySchemes': {
                'BearerAuth': {
                    'type': 'http',
                    'scheme': 'bearer',
                    'bearerFormat': 'JWT'
                }
            }
        }
    }
    api.spec.components.security_scheme("BearerAuth", {
    "type": "http",
    "scheme": "bearer",
    "bearerFormat": "JWT"
    })


    # Registrar Blueprints
    from resources.auth import blp as AuthBlueprint
    api.register_blueprint(AuthBlueprint, url_prefix='/api/auth')

    return app
