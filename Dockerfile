FROM python:3.13-slim

# Копіюємоuv з офіційного образу Astral
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Забороняємо Python створювати .pyc файли та буферизувати лог-вивід
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Копіюємо файли конфігурації залежностей
COPY pyproject.toml uv.lock /app/

# Встановлюємо залежності проєкту на системному рівні контейнера
# Прапорець --no-install-project дозволяє закешувати пакети до копіювання коду
RUN uv pip install --system -r pyproject.toml

# Копіюємо решту коду нашого додатку
COPY . /app/

EXPOSE 5000