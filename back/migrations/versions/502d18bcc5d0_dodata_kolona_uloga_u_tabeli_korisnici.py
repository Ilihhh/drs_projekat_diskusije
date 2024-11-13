"""Dodata kolona uloga u tabeli korisnici

Revision ID: 502d18bcc5d0
Revises: 4f8bd840ca65
Create Date: 2024-11-13 20:24:17.419821

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '502d18bcc5d0'
down_revision = '4f8bd840ca65'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('korisnici', schema=None) as batch_op:
        batch_op.add_column(sa.Column('uloga', sa.String(length=50), nullable=False))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('korisnici', schema=None) as batch_op:
        batch_op.drop_column('uloga')

    # ### end Alembic commands ###