backend:
	cd backend && uvicorn app.main:app --reload --port 8000

frontend:
	cd frontend && npm run dev

backend-test:
	cd backend && pytest

frontend-build:
	cd frontend && npm run build

compose:
	docker compose up --build
