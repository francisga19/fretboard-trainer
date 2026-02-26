#!/usr/bin/env python3
import argparse
import os
import threading
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class IdleTrackingServer(ThreadingHTTPServer):
    def __init__(self, server_address, handler_class, idle_timeout):
        super().__init__(server_address, handler_class)
        self.idle_timeout = idle_timeout
        self.last_activity = time.monotonic()
        self._stop_event = threading.Event()

    def touch(self):
        self.last_activity = time.monotonic()

    def start_watchdog(self):
        def watchdog():
            while not self._stop_event.is_set():
                time.sleep(1.0)
                if time.monotonic() - self.last_activity >= self.idle_timeout:
                    self.shutdown()
                    return

        t = threading.Thread(target=watchdog, daemon=True)
        t.start()

    def stop_watchdog(self):
        self._stop_event.set()


class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Prevent stale UI/JS/CSS/SVG after app/browser restarts.
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def do_GET(self):
        self.server.touch()
        super().do_GET()

    def do_HEAD(self):
        self.server.touch()
        super().do_HEAD()

    def do_POST(self):
        self.server.touch()
        super().do_POST()

    def log_message(self, fmt, *args):
        # Keep launcher logs small and quiet.
        pass


def parse_args():
    p = argparse.ArgumentParser(description="Temporary static file server with idle shutdown.")
    p.add_argument("--bind", default="127.0.0.1")
    p.add_argument("--port", type=int, default=8080)
    p.add_argument("--root", default=".")
    p.add_argument("--idle-timeout", type=int, default=90, help="Idle seconds before shutdown.")
    return p.parse_args()


def main():
    args = parse_args()
    os.chdir(args.root)

    server = IdleTrackingServer((args.bind, args.port), Handler, args.idle_timeout)
    server.start_watchdog()
    try:
        server.serve_forever()
    finally:
        server.stop_watchdog()
        server.server_close()


if __name__ == "__main__":
    main()
