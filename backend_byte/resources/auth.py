from flask_smorest import Blueprint
from flask.views import MethodView
from flask import jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from models.usuario import Usuario
from db import db
from schemas.usuario import UsuarioSchema
from datetime import timedelta

blp = Blueprint("Auth", __name__, description="Operaciones de autenticación")

# Registro
@blp.route("/register")
class Register(MethodView):
    @blp.arguments(UsuarioSchema)
    @blp.response(201, UsuarioSchema)
    def post(self, user_data):
        if Usuario.query.filter_by(email=user_data["email"]).first():
            return {"mensaje": "El usuario ya existe"}, 400

        nuevo_usuario = Usuario(
            nombre=user_data['nombre'],
            email=user_data['email'],
            contraseña=generate_password_hash(user_data['contraseña']),
            rol=user_data.get('rol', 'operador')
        )

        db.session.add(nuevo_usuario)
        db.session.commit()
        return nuevo_usuario


# Login
@blp.route("/login")
class Login(MethodView):
    @blp.arguments(UsuarioSchema(only=("email", "contraseña")))
    def post(self, data):
        usuario = Usuario.query.filter_by(email=data['email']).first()
        if usuario and check_password_hash(usuario.contraseña, data['contraseña']):
            token = create_access_token(
                identity=str(usuario.id_usuario),  
                expires_delta=timedelta(hours=3)
            )
            return {
                "access_token": token,
                "usuario": {
                    "id": usuario.id_usuario,
                    "nombre": usuario.nombre,
                    "email": usuario.email,
                    "rol": usuario.rol
                }
            }
        return {"mensaje": "Credenciales incorrectas"}, 401


# Ruta protegida (opcional)
@blp.route("/perfil")
class Perfil(MethodView):
    @blp.doc(security=[{"BearerAuth": []}])  
    @jwt_required()
    def get(self):
        identidad = get_jwt_identity()
        return {"mensaje": "Acceso autorizado", "usuario": identidad}

