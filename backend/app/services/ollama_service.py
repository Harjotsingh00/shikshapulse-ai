import json
import re

import requests


OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3.2:3b"


def generate_ai_response(
    prompt: str,
    temperature: float = 0.2,
) -> str:

    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False,
        "format": "json",
        "options": {
            "temperature": temperature,
        },
    }

    response = requests.post(
        OLLAMA_URL,
        json=payload,
        timeout=120,
    )

    response.raise_for_status()

    data = response.json()

    result = data.get("response")

    if not result:
        raise ValueError(
            "Ollama returned an empty response."
        )

    return result.strip()


def extract_json(text: str) -> dict:
    """
    Safely extract a JSON object from model output.
    """

    cleaned = text.strip()

    # Remove markdown code fences if the model
    # produces them despite the JSON format request.
    cleaned = re.sub(
        r"^```(?:json)?\s*",
        "",
        cleaned,
        flags=re.IGNORECASE,
    )

    cleaned = re.sub(
        r"\s*```$",
        "",
        cleaned,
    )

    cleaned = cleaned.strip()

    try:
        return json.loads(cleaned)

    except json.JSONDecodeError:
        pass

    # Fallback: locate the outermost JSON object.
    start = cleaned.find("{")
    end = cleaned.rfind("}")

    if start == -1 or end == -1 or end <= start:
        raise ValueError(
            "Ollama response did not contain valid JSON."
        )

    candidate = cleaned[start:end + 1]

    try:
        return json.loads(candidate)

    except json.JSONDecodeError as exc:
        raise ValueError(
            "Ollama returned malformed JSON."
        ) from exc


def generate_json_response(
    prompt: str,
) -> dict:

    response_text = generate_ai_response(
        prompt,
        temperature=0.1,
    )

    return extract_json(response_text)


def check_ollama_health() -> dict:
    """
    Check whether the local Ollama service is available.
    """

    try:
        response = requests.get(
            "http://localhost:11434/api/tags",
            timeout=5,
        )

        response.raise_for_status()

        data = response.json()

        models = [
            model.get("name")
            for model in data.get("models", [])
        ]

        model_available = MODEL_NAME in models

        return {
            "status": "healthy"
            if model_available
            else "model_missing",
            "ollama": True,
            "model": MODEL_NAME,
            "model_available": model_available,
            "available_models": models,
        }

    except requests.RequestException as exc:

        return {
            "status": "unavailable",
            "ollama": False,
            "model": MODEL_NAME,
            "model_available": False,
            "error": str(exc),
        }