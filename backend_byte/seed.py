from flask.cli import with_appcontext
import click
from werkzeug.security import generate_password_hash
from models.usuario import Usuario
from db import db

def register_commands(app):
    @app.cli.command("seed")
    @with_appcontext
    def seed():
        if Usuario.query.filter_by(email="admin@sisbyte.com").first():
            click.echo("⚠️  Usuario admin ya existe.")
            return

        admin = Usuario(
            nombre="Admin",
            email="admin@sisbyte.com",
            contraseña=generate_password_hash("admin123"),
            rol="administrador"
        )
        db.session.add(admin)
        db.session.commit()
        click.echo("✅ Usuario admin creado con éxito.")
