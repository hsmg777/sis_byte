from flask_smorest import Blueprint
from flask.views import MethodView
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from models.usuario import Usuario
from db import db
from schemas.usuario import UsuarioCreateSchema, UsuarioBaseSchema
from datetime import timedelta

blp = Blueprint("Auth", __name__, description="Operaciones de autenticación")

# Registro
@blp.route("/register")
class Register(MethodView):
    @blp.arguments(UsuarioCreateSchema)
    @blp.response(201, UsuarioBaseSchema)
    def post(self, user_data):
        if Usuario.query.filter_by(email=user_data["email"]).first():
            return {"mensaje": "El usuario ya existe"}, 400

        nuevo = Usuario(
            nombre=user_data["nombre"],
            email=user_data["email"],
            contraseña=generate_password_hash(user_data["contraseña"]),
            rol=user_data["rol"]
        )
        db.session.add(nuevo)
        db.session.commit()
        return nuevo

# Login
@blp.route("/login")
class Login(MethodView):
    @blp.arguments(UsuarioCreateSchema(only=("email", "contraseña")))
    def post(self, data):
        usuario = Usuario.query.filter_by(email=data["email"]).first()
        if usuario and check_password_hash(usuario.contraseña, data["contraseña"]):
            token = create_access_token(
                identity=str(usuario.id_usuario),
                additional_claims={"role": usuario.rol},
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

# Perfil
@blp.route("/perfil")
class Perfil(MethodView):
    @blp.doc(security=[{"BearerAuth": []}])
    @jwt_required()
    def get(self):
        identidad = get_jwt_identity()
        return {"mensaje": "Acceso autorizado", "usuario": identidad}
