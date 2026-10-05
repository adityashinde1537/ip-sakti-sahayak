from dataclasses import dataclass
from app.core.config import get_settings


@dataclass
class SpeechCapability:
    configured: bool
    provider: str
    message: str


def capability() -> SpeechCapability:
    settings = get_settings()
    configured = bool(settings.bhashini_user_id and settings.bhashini_api_key)
    return SpeechCapability(
        configured=configured,
        provider="Bhashini",
        message=(
            "Bhashini credentials detected; implement deployment-specific STT/TTS calls here."
            if configured
            else "Bhashini adapter is ready for credentials. Voice is intentionally not mocked as an authoritative service."
        ),
    )
