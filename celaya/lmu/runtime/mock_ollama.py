"""
Organization: Celaya Solutions
Project: LMU Curriculum Runtime
Version: 0.1.0
Generated: 2026-01-02T19:20:00Z
Purpose: Mock Ollama for testing without server
Status: Experimental
"""

import json


class MockOllamaRunner:
    """Mock Ollama for testing."""

    def __init__(self, model: str = "mock", base_url: str = "mock"):
        self.model = model
        self.base_url = base_url

    def generate(self, prompt: str, max_tokens: int = 1000, temperature: float = 0.7) -> str:
        """Return mock JSON responses based on prompt."""

        # Check exact phrases from prompts.py
        if "generating a lesson specification" in prompt.lower():
            # PLAN_LESSON_PROMPT
            return json.dumps({
                "objective": "Map LMU concepts to CUDA equivalents",
                "constraints": ["No speculative claims", "Testable criteria only"],
                "success_criteria": ["Map 6 concepts correctly", "Generate valid spec.md"],
                "cuda_analogy_explanation": "LMU operations map to CUDA kernel launches with deterministic execution"
            })

        elif "tasks.json file" in prompt.lower():
            # GENERATE_TASKS_PROMPT
            return json.dumps({
                "tasks": [
                    {"id": "task1", "description": "Map LMU to CUDA concepts", "weight": 0.4},
                    {"id": "task2", "description": "Generate spec.md with analogy", "weight": 0.35},
                    {"id": "task3", "description": "Validate output against schema", "weight": 0.25}
                ]
            })

        elif "spec.md file" in prompt.lower():
            # GENERATE_SPEC_PROMPT
            return """# Organization: Celaya Solutions
# Lesson 0.1: Introduction to LMU

## Objective
Understand LMU execution model through CUDA kernel analogy.

## Constraints
- No speculative language
- Testable success criteria only
- Explicit CUDA mapping required

## Success Criteria
- Map 6 LMU/CUDA concept pairs
- Generate valid spec.md with kernel analogy
- Pass validation

## CUDA Analogy
LMU operations are analogous to CUDA kernel execution:
- LMU operation = CUDA kernel
- LMU runner = kernel launch
- LMU lane = warp
- KV cache = SRAM/HBM memory hierarchy
"""

        elif "run.sh" in prompt.lower() or "run.py" in prompt.lower() or "script" in prompt.lower():
            # GENERATE_RUNNER_PROMPT
            return '''#!/usr/bin/env python3
"""Lesson execution script."""
import json
from pathlib import Path

def main():
    print("[Lesson] Executing...")

    # Emit receipts
    receipts = []
    receipts.append({"event": "task_start", "task": "concept_mapping"})
    receipts.append({"event": "task_done", "task": "concept_mapping", "status": "success"})

    Path("receipts.jsonl").write_text("\\n".join(json.dumps(r) for r in receipts) + "\\n")

    # Write summary
    summary = {
        "status": "completed",
        "tasks_completed": 3,
        "tasks_total": 3,
        "score": 0.95
    }
    Path("summary.json").write_text(json.dumps(summary, indent=2))

    print("[Lesson] Complete")

if __name__ == "__main__":
    main()
'''

        else:
            # Default fallback
            return json.dumps({
                "response": "Mock Ollama response",
                "model": self.model
            })

    def verify_connectivity(self) -> bool:
        """Always return True for mock."""
        return True
