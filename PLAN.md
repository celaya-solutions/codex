# LMU Next Steps - Implementation Plan

**Current State**: Mock generation working, 2 artifacts per lesson (spec.md, tasks.json)

## Phase 2: Complete Artifact Generation

**Priority: HIGH**

### 2.1 expected_artifacts.json Generator
- Add prompt: `GENERATE_EXPECTED_ARTIFACTS_PROMPT` (exists)
- Add pipeline method: `generate_expected_artifacts()`
- Mock response with standard artifacts list
- Write to `lessons/{id}/expected_artifacts.json`
- **Time**: 30min

### 2.2 run.sh/run.py Generator
- Add prompt: `GENERATE_RUNNER_PROMPT` (exists)
- Add pipeline method: `generate_runner()`
- Decision logic: bash for simple, python for complex
- Mock response with placeholder script
- Write to `lessons/{id}/run.py` (default to python)
- Make executable: `chmod +x`
- **Time**: 45min

### 2.3 grader.md Generator
- Add prompt: `GENERATE_GRADER_PROMPT` (exists)
- Add pipeline method: `generate_grader()`
- Include weights from expected_artifacts
- Mock response with grading rubric
- Write to `lessons/{id}/grader.md`
- **Time**: 30min

**Outcome**: All 7 standard artifacts per lesson

---

## Phase 3: Receipt Integration

**Priority: MEDIUM**

### 3.1 Pipeline Receipts
- Import `ReceiptWriter` in pipeline.py
- Emit `lesson_start` before generation
- Emit `op_start/op_done` for each stage
- Emit `lesson_complete` with artifact list
- Write to `celaya/lmu/artifacts/receipts.jsonl`
- **Time**: 20min

### 3.2 Test Receipt Flow
- Run mock generation
- Verify receipts.jsonl created
- Check timestamps, durations
- Validate JSON format
- **Time**: 10min

**Outcome**: Full observability, JSONL receipts

---

## Phase 4: Retry Logic

**Priority: MEDIUM**

### 4.1 Implement Retry with Constraint Tightening
- Wrap LLM calls in retry loop (max 3 attempts)
- On failure, use `get_retry_prompt()` from prompts.py
- Reduce max_tokens by 30% per retry
- Emit `attempt_start/attempt_fail/attempt_success`
- **Time**: 45min

### 4.2 Test Retry Scenarios
- Force failures in mock mode
- Verify constraint tightening
- Check retry receipts
- Confirm max retries honored
- **Time**: 15min

**Outcome**: Fault tolerance, retry tracking

---

## Phase 5: Real Ollama Testing

**Priority: HIGH**

### 5.1 Setup Real Ollama
- Install Ollama (if not present)
- Pull `llama2:latest` or `qwen2.5:latest`
- Verify connectivity: `python run.py --check`
- **Time**: 10min (if already installed)

### 5.2 Generate Real Lessons
- Run: `python run.py --lessons 0.1`
- Inspect real LLM output quality
- Check CUDA analogy validation
- Verify no hype language
- **Time**: 5min per lesson

### 5.3 Debug/Fix Issues
- Extract errors from malformed JSON
- Prompt tuning if needed
- Adjust temperature/max_tokens
- **Time**: Variable (30-60min estimated)

**Outcome**: Real LLM generation working

---

## Phase 6: Grading Integration

**Priority: LOW**

### 6.1 Wire Grader to Pipeline
- After generation, call `LessonGrader`
- Grade each lesson's artifacts
- Write individual lesson scores
- Update generation_summary.json with grades
- **Time**: 30min

### 6.2 Test Grading
- Run full phase: `python run.py --phase foundations`
- Check artifact weights applied
- Verify partial credit
- Test `--grade` command
- **Time**: 15min

**Outcome**: Automatic scoring, pass/fail determination

---

## Phase 7: Polish & Documentation

**Priority: LOW**

### 7.1 Error Handling
- Better error messages
- Validation error details
- Network timeout handling
- **Time**: 20min

### 7.2 Update Documentation
- QUICKSTART.md with real examples
- README.md in celaya/
- Add example lesson outputs
- **Time**: 15min

---

## Execution Order (Recommended)

1. **Phase 2** (2h) - Complete artifact generation
2. **Phase 5** (1h) - Real Ollama testing
3. **Phase 3** (30min) - Receipt integration
4. **Phase 4** (1h) - Retry logic
5. **Phase 6** (45min) - Grading
6. **Phase 7** (35min) - Polish

**Total Estimated Time**: ~5-6 hours

---

## Success Criteria

✓ Generate all 7 artifacts per lesson
✓ Real Ollama generates valid lessons
✓ Receipts track every operation
✓ Retry on failures with tighter constraints
✓ Grading produces scores
✓ No crashes on malformed output
✓ Documentation up to date

---

## Quick Wins (Can Do Now)

**30min**: Complete artifact generators (2.1-2.3)
**15min**: Add receipts (3.1)
**10min**: Test real Ollama (5.1-5.2)

Start with Phase 2.1 (expected_artifacts.json)?
