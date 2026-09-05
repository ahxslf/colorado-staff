#!/usr/bin/env python3
"""
Colorado State Roleplay Staff Application — form server.

Serves the static form AND a small API:
  GET  /api/status  -> {"submitted": bool, "ip": "..."}
  POST /api/submit  -> records a submission (with IP) or rejects with 409 if the
                       same IP already submitted within the last 48 hours.

Retention rules:
  - Only ONE response is accepted per IP within a 48-hour (2-day) window.
    After 2 days the "ban" is lifted and the user may submit again.
  - The IP address is removed from the stored record 7 days (1 week) after
    submission. Answers are kept for review.
  - Each submission can be forwarded by email. Settings live in the .env file.

Submissions are stored in submissions.json (same folder as this file).
"""

import json
import os
import smtplib
import sys
import threading
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from email.mime.text import MIMEText
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse

ROOT = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(ROOT, "submissions.json")
ENV_FILE = os.path.join(ROOT, ".env")
LOCK = threading.Lock()

BAN_WINDOW = timedelta(days=2)    # one response per IP within this window
PURGE_AFTER = timedelta(days=7)   # IP removed from the record after this long

MIME = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon",
    ".json": "application/json; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".woff2": "font/woff2",
}


# ---------------------------------------------------------------- data ----
def load_data():
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {"submissions": []}


def save_data(data):
    try:
        tmp = DATA_FILE + ".tmp"
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        os.replace(tmp, DATA_FILE)
        return True
    except Exception as e:
        sys.stderr.write("save_data failed: %r\n" % e)
        return False


def parse_ts(s):
    try:
        dt = datetime.fromisoformat(str(s).replace("Z", "+00:00"))
        if dt.tzinfo is None:
            dt = dt.replace(tzinfo=timezone.utc)
        return dt
    except Exception:
        return None


def anonymize_old_ips(data, now):
    """Remove IP addresses from records older than PURGE_AFTER (1 week)."""
    changed = False
    for s in data.get("submissions", []):
        dt = parse_ts(s.get("submittedAt"))
        if dt is not None and (now - dt) > PURGE_AFTER and s.get("ip"):
            s["ip"] = None
            changed = True
    return changed


def is_banned(ip, data, now):
    """True if this IP submitted within the last BAN_WINDOW (2 days)."""
    for s in data.get("submissions", []):
        if s.get("ip") == ip:
            dt = parse_ts(s.get("submittedAt"))
            if dt is not None and (now - dt) <= BAN_WINDOW:
                return True
    return False


# ---------------------------------------------------------------- env -----
def load_env(path):
    """Read KEY=VALUE lines from a .env file (no external dependencies)."""
    env = {}
    try:
        with open(path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                key, _, value = line.partition("=")
                key = key.strip()
                value = value.strip()
                if len(value) >= 2 and value[0] in "\"'" and value[-1] == value[0]:
                    value = value[1:-1]
                env[key] = value
    except OSError:
        pass
    return env


def load_email_config():
    """Read email settings. On Render (or any host) environment variables set in
    the dashboard take priority; otherwise values come from the .env file.
    Re-read on every send, so edits apply without restarting the server."""
    env_file = load_env(ENV_FILE)

    def get(key, default=""):
        v = os.environ.get(key)
        if v is not None and v != "":
            return v
        return env_file.get(key, default)

    return {
        "method": (get("EMAIL_METHOD") or "none").lower(),
        "to": get("EMAIL_TO"),
        "access_key": get("WEB3FORMS_ACCESS_KEY"),
        "form_id": get("FORMSPREE_FORM_ID"),
        "smtp_host": get("SMTP_HOST", "smtp.gmail.com"),
        "smtp_port": get("SMTP_PORT", "587"),
        "smtp_user": get("SMTP_USER"),
        "smtp_pass": get("SMTP_PASS"),
        "smtp_from": get("SMTP_FROM"),
    }


# ---------------------------------------------------------------- email ----
def build_email_text(record):
    lines = []
    lines.append("New Colorado State Roleplay Staff Application")
    lines.append("=" * 46)
    lines.append("Submitted at: %s" % record.get("submittedAt"))
    lines.append("IP:           %s" % (record.get("ip") or "(removed)"))
    lines.append("User agent:   %s" % record.get("userAgent", ""))
    lines.append("")
    for a in record.get("answers", []):
        title = a.get("title") or a.get("id") or "Question"
        val = a.get("value")
        if isinstance(val, list):
            val = ", ".join(str(v) for v in val)
        if val is None or val == "":
            val = "(no answer)"
        lines.append("Q: %s" % title)
        lines.append("A: %s" % val)
        lines.append("")
    return "\n".join(lines)


def send_web3forms(cfg, record):
    data = {
        "access_key": cfg.get("access_key"),
        "subject": "New Colorado State Roleplay Staff Application",
        "from_name": "Colorado State Roleplay Staff Application",
        "ip": record.get("ip") or "",
        "submitted_at": record.get("submittedAt", ""),
    }
    for i, a in enumerate(record.get("answers", [])):
        key = "q%d_%s" % (i + 1, (a.get("title") or a.get("id") or "q")[:60])
        val = a.get("value")
        if isinstance(val, list):
            val = ", ".join(str(v) for v in val)
        data[key] = "" if val is None else str(val)
    body = urllib.parse.urlencode(data).encode("utf-8")
    req = urllib.request.Request(
        "https://api.web3forms.com/submit", data=body,
        headers={"Content-Type": "application/x-www-form-urlencoded"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.status


def send_formsubmit(cfg, record, referer="", origin=""):
    """FormSubmit.co — no signup, no domain, free.

    Uses the AJAX endpoint (https://formsubmit.co/ajax/EMAIL) with a JSON body.
    FormSubmit requires a Referer/Origin header on this endpoint; otherwise it
    rejects the request ("Make sure you open this page through a web server...").
    We forward the visitor's real Referer/Origin from the form request.
    The first submission triggers a one-time 'Activate Form' email; after the
    recipient clicks it once, deliveries begin."""
    to = cfg.get("to")
    data = {
        "_subject": "New Colorado State Roleplay Staff Application",
        "ip": record.get("ip") or "",
        "submitted_at": record.get("submittedAt", ""),
    }
    for i, a in enumerate(record.get("answers", [])):
        key = "q%d_%s" % (i + 1, (a.get("title") or a.get("id") or "q")[:60])
        val = a.get("value")
        if isinstance(val, list):
            val = ", ".join(str(v) for v in val)
        data[key] = "" if val is None else str(val)

    url = "https://formsubmit.co/ajax/" + to
    headers = {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "ColoradoRPForm/1.0",
    }
    if referer:
        headers["Referer"] = referer
    elif origin:
        headers["Referer"] = origin
    if origin:
        headers["Origin"] = origin
    req = urllib.request.Request(url, data=json.dumps(data).encode("utf-8"),
                                 headers=headers, method="POST")
    with urllib.request.urlopen(req, timeout=25) as r:
        status = r.status
        body = r.read().decode("utf-8", "replace")
    return status, body


def parse_formsubmit(body):
    try:
        d = json.loads(body)
        if str(d.get("success", "")).lower() == "true":
            return "sent"
        return "formsubmit: %s" % (d.get("message") or "rejected")[:120]
    except Exception:
        if "Unable to submit form" in body:
            return "rejected: no referer/origin header"
        return "unexpected response"


def send_formspree(cfg, record):
    payload = {
        "subject": "New Colorado State Roleplay Staff Application",
        "ip": record.get("ip") or "",
        "submittedAt": record.get("submittedAt", ""),
        "answers": record.get("answers", []),
    }
    url = "https://formspree.io/f/" + cfg.get("form_id")
    req = urllib.request.Request(
        url, data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.status


def send_smtp(cfg, record):
    text = build_email_text(record)
    msg = MIMEText(text, "plain", "utf-8")
    msg["Subject"] = "New Colorado State Roleplay Staff Application"
    msg["From"] = cfg.get("smtp_from") or cfg.get("smtp_user")
    msg["To"] = cfg.get("to")
    with smtplib.SMTP(cfg.get("smtp_host", "smtp.gmail.com"),
                      int(cfg.get("smtp_port", 587)), timeout=25) as s:
        s.ehlo()
        s.starttls()
        s.ehlo()
        s.login(cfg.get("smtp_user"), cfg.get("smtp_pass"))
        s.sendmail(msg["From"], [cfg.get("to")], msg.as_string())


def try_send_email(record, referer="", origin=""):
    cfg = load_email_config()
    method = (cfg.get("method") or "none").lower()
    if method == "none" or not cfg.get("to"):
        return "skipped"
    try:
        if method == "web3forms":
            send_web3forms(cfg, record)
            return "sent"
        if method == "formsubmit":
            _, body = send_formsubmit(cfg, record, referer, origin)
            sys.stderr.write("FormSubmit reply: %s\n" % body[:300])
            return parse_formsubmit(body)
        if method == "formspree":
            send_formspree(cfg, record)
            return "sent"
        if method == "smtp":
            send_smtp(cfg, record)
            return "sent"
        return "skipped"
    except Exception as e:
        sys.stderr.write("Email send failed: %r\n" % e)
        return "failed"


def fetch_discord(user_id):
    url = "https://japi.rest/discord/v1/user/" + user_id
    req = urllib.request.Request(url, headers={"User-Agent": "ColoradoRPForm/1.0",
                                               "Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            raw = r.read().decode("utf-8", "replace")
    except Exception:
        return {"ok": False, "error": "lookup_failed",
                "message": "Could not reach Discord. Please try again."}
    try:
        d = json.loads(raw)
    except Exception:
        return {"ok": False, "error": "bad_response",
                "message": "Could not verify this user. Please try again."}
    u = d.get("data") or {}
    if not u.get("id"):
        return {"ok": False, "error": "not_found",
                "message": "Discord user not found. Please check the ID."}
    avatar_url = u.get("avatarURL") or u.get("defaultAvatarURL") or ""
    if avatar_url and "?" not in avatar_url:
        avatar_url += "?size=256"
    return {
        "ok": True,
        "user": {
            "id": u.get("id"),
            "username": u.get("username"),
            "display_name": u.get("global_name") or u.get("username"),
        },
        "avatar_url": avatar_url,
    }


def fetch_roblox(username):
    try:
        payload = json.dumps({"usernames": [username],
                              "excludeBannedUsers": False}).encode("utf-8")
        req = urllib.request.Request(
            "https://users.roblox.com/v1/usernames/users",
            data=payload,
            headers={"Content-Type": "application/json",
                     "User-Agent": "ColoradoRPForm/1.0"},
            method="POST")
        with urllib.request.urlopen(req, timeout=15) as r:
            users = (json.loads(r.read().decode("utf-8", "replace")).get("data") or [])
    except Exception:
        return {"ok": False, "error": "lookup_failed",
                "message": "Could not reach Roblox. Please try again."}
    if not users:
        return {"ok": False, "error": "not_found",
                "message": "Roblox user not found. Please check the username."}
    u = users[0]
    uid = u.get("id")
    avatar_url = ""
    try:
        req2 = urllib.request.Request(
            "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=%s&size=150x150&format=Png&isCircular=false" % uid,
            headers={"User-Agent": "ColoradoRPForm/1.0"})
        with urllib.request.urlopen(req2, timeout=15) as r2:
            thumbs = (json.loads(r2.read().decode("utf-8", "replace")).get("data") or [])
        if thumbs:
            avatar_url = thumbs[0].get("imageUrl") or ""
    except Exception:
        avatar_url = ""
    return {
        "ok": True,
        "user": {
            "id": uid,
            "username": u.get("name"),
            "display_name": u.get("displayName") or u.get("name"),
        },
        "avatar_url": avatar_url,
    }


# ---------------------------------------------------------------- http ----
class Handler(BaseHTTPRequestHandler):
    server_version = "ColoradoRPForm/1.0"
    # HTTP/1.0 closes the connection after every response (no keep-alive).
    # This prevents threads from piling up behind Render's proxy when the user
    # refreshes rapidly, which is what caused the intermittent 404s / half-loaded
    # pages on the free tier.
    protocol_version = "HTTP/1.0"

    def log_message(self, fmt, *args):
        sys.stderr.write("[%s] %s\n" % (self.log_date_time_string(), fmt % args))

    def send_headers_common(self, code, ctype, length):
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(length))
        self.send_header("Connection", "close")
        self.end_headers()

    def client_ip(self):
        xff = self.headers.get("X-Forwarded-For", "")
        if xff:
            first = xff.split(",")[0].strip()
            if first:
                return first
        xr = self.headers.get("X-Real-IP", "")
        if xr and xr.strip():
            return xr.strip()
        return self.client_address[0]

    def send_json(self, code, obj):
        body = json.dumps(obj).encode("utf-8")
        self.send_headers_common(code, "application/json; charset=utf-8", len(body))
        try:
            self.wfile.write(body)
        except Exception:
            pass

    def do_GET(self):
        try:
            self._do_GET()
        except Exception as e:
            sys.stderr.write("do_GET error: %r\n" % e)
            try:
                self.send_json(500, {"ok": False, "error": "server_error"})
            except Exception:
                pass

    def _do_GET(self):
        path = urlparse(self.path).path

        if path == "/health":
            # Cheap health check for keep-alive cron jobs (no disk I/O).
            self.send_json(200, {"ok": True})
            return

        if path == "/api/admin":
            # Token-protected view of all submissions (for the owner).
            qs = urllib.parse.parse_qs(urlparse(self.path).query)
            tok = (qs.get("token") or [""])[0]
            admin_token = os.environ.get("ADMIN_TOKEN") or load_env(ENV_FILE).get("ADMIN_TOKEN", "")
            if not admin_token or tok != admin_token:
                self.send_json(403, {"ok": False, "error": "forbidden"})
                return
            with LOCK:
                data = load_data()
            self.send_json(200, data)
            return

        if path == "/api/status":
            ip = self.client_ip()
            now = datetime.now(timezone.utc)
            with LOCK:
                data = load_data()
                if anonymize_old_ips(data, now):
                    save_data(data)
                banned = is_banned(ip, data, now)
            self.send_json(200, {"submitted": banned, "ip": ip})
            return

        if path == "/api/countries":
            try:
                with open(os.path.join(ROOT, "countries.json"), "r", encoding="utf-8") as f:
                    raw = f.read()
            except OSError:
                raw = "[]"
            body = raw.encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)
            return

        if path == "/api/discord":
            qs = urllib.parse.parse_qs(urlparse(self.path).query)
            uid = (qs.get("user_id") or [""])[0].strip()
            if not uid.isdigit() or len(uid) < 10:
                self.send_json(400, {"ok": False, "error": "invalid_id",
                                     "message": "Enter a valid Discord user ID."})
                return
            self.send_json(200, fetch_discord(uid))
            return

        if path == "/api/roblox":
            qs = urllib.parse.parse_qs(urlparse(self.path).query)
            name = (qs.get("username") or [""])[0].strip()
            if not name:
                self.send_json(400, {"ok": False, "error": "invalid_name",
                                     "message": "Enter a Roblox username."})
                return
            self.send_json(200, fetch_roblox(name))
            return

        if path == "/favicon.ico":
            # Serve the logo as the site icon; silences the harmless 404.
            path = "/assets/logo.png"

        if path == "/":
            path = "/index.html"
        rel = path.lstrip("/")
        # Never serve sensitive files (data, secrets, source) over static paths.
        ext = os.path.splitext(rel)[1].lower()
        base = os.path.basename(rel)
        if ext in (".json", ".py") or base in (".env", ".env.example", ".gitignore", "requirements.txt"):
            self.send_error(404, "Not Found")
            return
        full = os.path.normpath(os.path.join(ROOT, rel))
        if not full.startswith(ROOT) or not os.path.isfile(full):
            self.send_error(404, "Not Found")
            return
        ext = os.path.splitext(full)[1].lower()
        ctype = MIME.get(ext, "application/octet-stream")
        try:
            with open(full, "rb") as f:
                body = f.read()
        except OSError:
            self.send_error(404, "Not Found")
            return
        self.send_headers_common(200, ctype, len(body))
        try:
            self.wfile.write(body)
        except Exception:
            pass

    def do_POST(self):
        try:
            self._do_POST()
        except Exception as e:
            sys.stderr.write("do_POST error: %r\n" % e)
            try:
                self.send_json(500, {"ok": False, "error": "server_error"})
            except Exception:
                pass

    def _do_POST(self):
        path = urlparse(self.path).path
        if path != "/api/submit":
            self.send_error(404, "Not Found")
            return

        try:
            length = int(self.headers.get("Content-Length", 0) or 0)
            raw = self.rfile.read(length) if length else b""
            payload = json.loads(raw.decode("utf-8")) if raw else {}
        except Exception:
            self.send_json(400, {"ok": False, "error": "invalid_request"})
            return

        ip = self.client_ip()
        answers = payload.get("answers", [])
        if not isinstance(answers, list):
            answers = []

        now = datetime.now(timezone.utc)
        with LOCK:
            data = load_data()
            anonymize_old_ips(data, now)
            if is_banned(ip, data, now):
                save_data(data)
                self.send_json(409, {
                    "ok": False,
                    "error": "already_submitted",
                    "message": "A response has already been submitted from this IP address within the last 48 hours.",
                })
                return
            record = {
                "ip": ip,
                "submittedAt": now.isoformat(),
                "userAgent": (self.headers.get("User-Agent", "") or "")[:300],
                "answers": answers,
            }
            data.setdefault("submissions", []).append(record)
            save_data(data)

        referer = self.headers.get("Referer", "")
        origin = self.headers.get("Origin", "")
        if not referer and not origin:
            # Fallback so FormSubmit still sees a web referer (e.g. curl tests)
            referer = "http://" + (self.headers.get("Host", "localhost") or "localhost")
        email_status = try_send_email(record, referer, origin)
        sys.stderr.write("New submission from IP %s (%d answers, email=%s)\n"
                         % (ip, len(answers), email_status))
        self.send_json(200, {"ok": True, "email": email_status})


class LimitedThreadingHTTPServer(ThreadingHTTPServer):
    """ThreadingHTTPServer with a hard cap on concurrent request threads.

    Render's free tier has very little memory; unbounded threads (one per
    connection) would pile up on rapid refresh and get the instance killed.
    When the cap is reached we close the extra connection immediately.
    """
    daemon_threads = True
    MAX_THREADS = 48

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._sem = threading.Semaphore(self.MAX_THREADS)

    def process_request(self, request, client_address):
        if not self._sem.acquire(blocking=False):
            try:
                request.close()
            except Exception:
                pass
            return
        super().process_request(request, client_address)

    def process_request_thread(self, request, client_address):
        try:
            super().process_request_thread(request, client_address)
        finally:
            self._sem.release()


def main():
    port = int(os.environ.get("PORT", "8000"))
    server = LimitedThreadingHTTPServer(("0.0.0.0", port), Handler)
    print("Colorado State Roleplay form server running on port %d" % port, flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
