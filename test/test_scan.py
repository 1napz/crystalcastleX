import os
import tempfile
from pathlib import Path
import subprocess
import json
import pytest
from scripts.scan_paths import find_abs_paths_in_text, parse_codeowners, match_codeowners, scan_repo

def test_find_abs_paths_basic():
    text = "Please check /etc/nginx/nginx.conf and https://example.com/page"
    hits = find_abs_paths_in_text(text)
    assert "/etc/nginx/nginx.conf" in hits
    # URL should not be included
    assert not any(h.startswith("http") for h in hits)

def test_codeowners_parse_and_match(tmp_path):
    co = tmp_path / "CODEOWNERS"
    co.write_text("/src/ @alice @bob
/docs/* @docowner
")
    entries = parse_codeowners(co)
    owners = match_codeowners("src/app/main.py", entries)
    assert "alice" in owners and "bob" in owners
    owners2 = match_codeowners("docs/readme.md", entries)
    assert "docowner" in owners2

def test_scan_integration(tmp_path):
    repo = tmp_path
    # create files
    (repo / "app").mkdir()
    f = repo / "app" / "script.py"
    f.write_text('CONFIG = "/etc/app/conf.yml"
# example /home/user/test
')
    (repo / "CODEOWNERS").write_text("/app/ @appteam
")
    entries = parse_codeowners(repo / "CODEOWNERS")
    results = scan_repo(repo, entries)
    assert "app/script.py" in results
    entries_for_file = results["app/script.py"]
    assert any("/etc/app/conf.yml" in hit for (_, _line, hit, _owners) in entries_for_file)
    # owners attached
    assert any("appteam" in owners for (_, _line, _hit, owners) in entries_for_file)