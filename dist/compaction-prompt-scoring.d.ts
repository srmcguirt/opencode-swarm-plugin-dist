/**
 * Compaction Prompt Quality Scoring - Pure Functions
 *
 * Evaluates the quality of continuation prompts generated after context compaction.
 * **Problem**: Post-compaction coordinators often "wake up" confused, forget their role,
 * and start editing files instead of checking worker status.
 *
 * **Solution**: Score prompts on 5 dimensions that predict coordinator success:
 *
 * 1. **Epic ID Specificity (0.20)**: Real IDs (`mjkw...`) not placeholders (`<epic-id>`, `bd-xxx`)
 *    - Placeholders = coordinator can't check actual swarm status
 *
 * 2. **Actionability (0.20)**: Tool calls with real values (e.g., `swarm_status(epic_id='mjkw81rkq4c')`)
 *    - Generic instructions like "check status" don't work
 *
 * 3. **Coordinator Identity (0.25)**: ASCII header + strong mandates (NEVER/ALWAYS)
 *    - Visual + semantic cues reinforce role post-compaction
 *
 * 4. **Forbidden Tools Listed (0.15)**: Explicitly lists Edit, Write, swarmmail_reserve, git commit
 *    - Naming forbidden tools reduces violations
 *
 * 5. **Post-Compaction Discipline (0.20)**: First suggested tool is swarm_status or inbox (not Edit)
 *    - First tool sets the pattern - "check status" vs "dive into code"
 *
 * **Pure functions**: These can be tested without evalite. The evalite wrappers are in
 * `evals/scorers/compaction-prompt-scorers.ts`.
 *
 * **Data source**: Captured from `captureCompactionEvent()` with `compaction_type: "prompt_generated"`.
 * The payload includes the FULL prompt content (not truncated) for scoring.
 *
 * **Integration**: `compaction-prompt.eval.ts` uses these scorers to track prompt quality over time.
 * Progressive gates enforce quality: bootstrap → stabilization → production.
 *
 * @module compaction-prompt-scoring
 */
/**
 * Compaction prompt structure (from LLM generation)
 */
export interface CompactionPrompt {
    content: string;
}
/**
 * Scorer result type
 */
export interface ScorerResult {
    score: number;
    message: string;
}
/** Matches real epic/cell IDs (mjkw prefix + 7+ base36 chars) */
export declare const REAL_EPIC_ID: RegExp;
/** Matches common placeholder patterns */
export declare const PLACEHOLDERS: RegExp[];
/** Matches ASCII box-drawing characters (for headers) */
export declare const ASCII_BOX: RegExp;
/** Matches strong mandate language */
export declare const STRONG_LANGUAGE: RegExp[];
/**
 * Score epic ID specificity
 *
 * Validates that epic IDs are REAL, not placeholders.
 * Placeholders like <epic-id>, bd-xxx, <path> indicate
 * the prompt generator failed to inject actual values.
 *
 * @returns 1.0 if real IDs, 0.0 if placeholders found
 */
export declare function scoreEpicIdSpecificity(prompt: CompactionPrompt): ScorerResult;
/**
 * Score actionability of tool calls
 *
 * Validates that the prompt includes SPECIFIC actionable tool calls.
 * Generic instructions like "check status" are useless.
 * Good: swarm_status(epic_id='mjkw81rkq4c', project_key='/path')
 * Bad: "Check the status of workers"
 *
 * @returns 1.0 if actionable tool calls with real values, 0.0 otherwise
 */
export declare function scoreActionability(prompt: CompactionPrompt): ScorerResult;
/**
 * Score coordinator identity reinforcement
 *
 * Validates that the prompt has STRONG coordinator identity reinforcement.
 * Post-compaction coordinators lose their identity without visual+semantic cues.
 *
 * Checks:
 * 1. ASCII box header (visual anchor)
 * 2. Strong language (NEVER/ALWAYS, not "should"/"consider")
 *
 * @returns 1.0 for ASCII header + strong mandates, 0.5 for header only, 0.0 otherwise
 */
export declare function scoreCoordinatorIdentity(prompt: CompactionPrompt): ScorerResult;
/**
 * Score forbidden tools listing
 *
 * Validates that the prompt LISTS forbidden tools by name.
 * Coordinators must know exactly which tools to avoid.
 *
 * Required forbidden tools:
 * 1. Edit
 * 2. Write
 * 3. swarmmail_reserve (only workers reserve)
 * 4. git commit (workers commit)
 * 5. bash (for file modifications)
 *
 * @returns ratio of forbidden tools mentioned (0.0 to 1.0)
 */
export declare function scoreForbiddenToolsPresent(prompt: CompactionPrompt): ScorerResult;
/**
 * Score post-compaction discipline (first tool correctness)
 *
 * Validates that the FIRST suggested tool is correct.
 * Coordinators should check status FIRST, not edit files.
 *
 * Good first tools:
 * - swarm_status
 * - swarmmail_inbox
 *
 * Bad first tools:
 * - Edit
 * - Write
 * - Read (should check status first)
 *
 * @returns 1.0 if first tool is swarm_status or inbox, 0.0 otherwise
 */
export declare function scorePostCompactionDiscipline(prompt: CompactionPrompt): ScorerResult;
//# sourceMappingURL=compaction-prompt-scoring.d.ts.map