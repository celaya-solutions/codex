#!/bin/bash
set -e

echo "=========================================="
echo "CORA Integration Test"
echo "=========================================="
echo

echo "1. Test lesson generation (mock mode)"
echo "--------------------------------------"
LMU_MOCK_OLLAMA=1 python3 run.py --lessons 0.1 --mock 2>&1 | grep -E "(Started|Passed|Failed|Success)" || true
echo

echo "2. Test CORA list"
echo "--------------------------------------"
python3 cora --list
echo

echo "3. Test CORA lesson execution"
echo "--------------------------------------"
python3 cora 0.1 2>&1 | grep -E "(Starting|Result|success)" || true
echo

echo "4. Check generated artifacts"
echo "--------------------------------------"
ls -lh celaya/lmu/artifacts/lessons/0.1/ | grep -v "^total"
echo

echo "5. Test MCP server tools/list"
echo "--------------------------------------"
cd /home/user/codex
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node cora-mcp/dist/mcp-server.js 2>&1 | grep -o '"name":"[^"]*"' || true
echo

echo "=========================================="
echo "Integration test complete!"
echo "=========================================="
