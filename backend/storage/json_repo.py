import json
from typing import Any, Dict, List, Optional
from pathlib import Path
from datetime import datetime
from core.config import get_settings


class JSONRepository:
    def __init__(self):
        self.settings = get_settings()
        self.path = Path(self.settings.DB_FILE)

    # ==========================
    # Utility: Read / Write JSON
    # ==========================
    def _read(self) -> Dict[str, Any]:
        """Read database JSON or initialize if missing"""
        if not self.path.exists():
            self.path.write_text(json.dumps({
                "counters": {"artisan": 0, "client": 0, "request": 0, "contract": 0},
                "artisans": [], "clients": [], "requests": [], "contracts": []
            }, indent=2), encoding="utf-8")
        return json.loads(self.path.read_text(encoding="utf-8"))

    def _write(self, data: Dict[str, Any]) -> None:
        """Write back the updated JSON database"""
        self.path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")

    # ==========================
    # ID Generator (Corrected)
    # ==========================
    def _next_id(self, kind: str, data: Dict[str, Any]) -> str:
        """Generate the next sequential ID without re-writing the file"""
        current_value = data["counters"].get(kind, 0) + 1
        data["counters"][kind] = current_value

        prefix_map = {
            "artisan": "art",
            "client": "cli",
            "request": "req",
            "contract": "con",
        }
        prefix = prefix_map.get(kind, "id")
        return f"{prefix}{current_value:06d}"

    # ==========================
    # Users
    # ==========================
    def find_user_by_email(self, user_type: str, email: str) -> Optional[Dict[str, Any]]:
        """Find a user (artisan or client) by email"""
        data = self._read()
        items = data["artisans"] if user_type == "artisan" else data["clients"]
        for u in items:
            if u["email"].lower() == email.lower():
                return u
        return None

    def get_user(self, user_type: str, user_id: str) -> Optional[Dict[str, Any]]:
        """Find a user by ID"""
        data = self._read()
        items = data["artisans"] if user_type == "artisan" else data["clients"]
        for u in items:
            if u["_id"] == user_id:
                return u
        return None

    def create_artisan(self, artisan: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new artisan and assign a unique sequential ID"""
        data = self._read()
        artisan["_id"] = self._next_id("artisan", data)
        now = datetime.utcnow().isoformat()
        artisan["createdAt"] = now
        artisan["updatedAt"] = now
        data["artisans"].append(artisan)
        self._write(data)
        return artisan

    def create_client(self, client: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new client and assign a unique sequential ID"""
        data = self._read()
        client["_id"] = self._next_id("client", data)
        now = datetime.utcnow().isoformat()
        client["createdAt"] = now
        client["updatedAt"] = now
        data["clients"].append(client)
        self._write(data)
        return client

    def update_user(self, user_type: str, user_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update artisan or client info"""
        data = self._read()
        key = "artisans" if user_type == "artisan" else "clients"
        for i, u in enumerate(data[key]):
            if u["_id"] == user_id:
                u.update(updates)
                u["updatedAt"] = datetime.utcnow().isoformat()
                data[key][i] = u
                self._write(data)
                return u
        return None

    # ==========================
    # Requests
    # ==========================
    def create_request(self, req: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new request between client and artisan"""
        data = self._read()
        req["_id"] = self._next_id("request", data)
        now = datetime.utcnow().isoformat()
        req["createdAt"] = now
        req["updatedAt"] = now
        data["requests"].append(req)
        self._write(data)
        return req

    def list_requests_for_artisan(self, artisan_id: str, status: Optional[str] = None) -> List[Dict[str, Any]]:
        """List all requests received by an artisan"""
        data = self._read()
        items = [r for r in data["requests"] if r["artisanId"] == artisan_id]
        if status:
            items = [r for r in items if r["status"] == status]
        return items

    def list_requests_for_client(self, client_id: str) -> List[Dict[str, Any]]:
        """List all requests created by a client"""
        data = self._read()
        return [r for r in data["requests"] if r["clientId"] == client_id]

    def get_request(self, request_id: str) -> Optional[Dict[str, Any]]:
        """Fetch a single request by ID"""
        data = self._read()
        for r in data["requests"]:
            if r["_id"] == request_id:
                return r
        return None

    def update_request(self, request_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing request"""
        data = self._read()
        for i, r in enumerate(data["requests"]):
            if r["_id"] == request_id:
                r.update(updates)
                r["updatedAt"] = datetime.utcnow().isoformat()
                data["requests"][i] = r
                self._write(data)
                return r
        return None

    # ==========================
    # Contracts
    # ==========================
    def create_contract(self, contract: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new contract for a request"""
        data = self._read()
        contract["_id"] = self._next_id("contract", data)
        now = datetime.utcnow().isoformat()
        contract["createdAt"] = now
        contract["updatedAt"] = now
        data["contracts"].append(contract)
        self._write(data)
        return contract

    def list_contracts_for_user(self, user_id: str) -> List[Dict[str, Any]]:
        """List all contracts related to a user"""
        data = self._read()
        return [c for c in data["contracts"] if c.get("artisanId") == user_id or c.get("clientId") == user_id]

    def get_contract(self, contract_id: str) -> Optional[Dict[str, Any]]:
        """Fetch a single contract by ID"""
        data = self._read()
        for c in data["contracts"]:
            if c["_id"] == contract_id:
                return c
        return None

    def update_contract(self, contract_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Update an existing contract"""
        data = self._read()
        for i, c in enumerate(data["contracts"]):
            if c["_id"] == contract_id:
                c.update(updates)
                c["updatedAt"] = datetime.utcnow().isoformat()
                data["contracts"][i] = c
                self._write(data)
                return c
        return None
