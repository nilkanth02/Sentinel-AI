"""Baseline service wrapper around the existing DB-backed prompt baselines."""

from __future__ import annotations

from typing import List, Optional

from sqlalchemy.orm import Session

from app.storage.baseline_crud import (
    create_baseline,
    delete_baseline,
    get_baseline_by_id,
    list_active_baselines,
    list_baselines,
    set_baseline_active,
    update_baseline_text,
)
from app.storage.prompt_baselines import PromptBaseline


class BaselineService:
    @staticmethod
    def get_baselines(db: Session, include_inactive: bool = False) -> List[PromptBaseline]:
        return list_baselines(db) if include_inactive else list_active_baselines(db)

    @staticmethod
    def create_baseline(db: Session, text: str) -> PromptBaseline:
        return create_baseline(db, text)

    @staticmethod
    def set_active(db: Session, baseline_id: int, active: bool) -> Optional[PromptBaseline]:
        return set_baseline_active(db, baseline_id, active)

    @staticmethod
    def update_text(db: Session, baseline_id: int, text: str) -> Optional[PromptBaseline]:
        return update_baseline_text(db, baseline_id, text)

    @staticmethod
    def get_by_id(db: Session, baseline_id: int) -> Optional[PromptBaseline]:
        return get_baseline_by_id(db, baseline_id)

    @staticmethod
    def delete(db: Session, baseline_id: int) -> bool:
        return delete_baseline(db, baseline_id)


baseline_service = BaselineService()
