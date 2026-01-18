"""Compatibility shim.

Settings are now persisted in the DB and served via `settings_service_db`.
This module remains to avoid breaking older imports.
"""

from app.services.settings_service_db import settings_service  # noqa: F401
