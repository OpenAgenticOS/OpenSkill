/**
 * PEEM-aligned baseline rubric dimensions (arXiv:2603.10477).
 * Use as reference when authoring evaluation_rubric; eval_runner can fall back to these.
 */

export const PEEM_DIMENSION_KEYS = [
  'prompt_clarity',
  'prompt_fairness',
  'accuracy',
  'coherence',
  'relevance',
  'objectivity',
  'response_clarity',
  'conciseness',
];

export const PEEM_BASELINE_RUBRIC = [
  {
    dimension: 'prompt_clarity',
    weight: 0.12,
    criteria_5: 'Instructions are complete, unambiguous, and well-structured (e.g. COSTAR covered).',
    criteria_3: 'Mostly clear but some ambiguity or missing structure.',
    criteria_1: 'Confusing, contradictory, or severely incomplete instructions.',
  },
  {
    dimension: 'prompt_fairness',
    weight: 0.08,
    criteria_5: 'No harmful bias or discriminatory framing.',
    criteria_3: 'Minor implicit bias.',
    criteria_1: 'Clear harmful bias or discriminatory guidance.',
  },
  {
    dimension: 'accuracy',
    weight: 0.15,
    criteria_5: 'Factually correct relative to the user input; no invented specifics.',
    criteria_3: 'Mostly correct with minor unsupported claims.',
    criteria_1: 'Major factual errors or fabrication.',
  },
  {
    dimension: 'coherence',
    weight: 0.12,
    criteria_5: 'Logical flow; sections connect cleanly.',
    criteria_3: 'Some jumps or weak linkage.',
    criteria_1: 'Incoherent or contradictory output.',
  },
  {
    dimension: 'relevance',
    weight: 0.12,
    criteria_5: 'Directly addresses the user task and constraints.',
    criteria_3: 'Partially on-topic.',
    criteria_1: 'Mostly irrelevant.',
  },
  {
    dimension: 'objectivity',
    weight: 0.1,
    criteria_5: 'Balanced, evidence-grounded where applicable.',
    criteria_3: 'Some unsupported opinions.',
    criteria_1: 'Heavily biased or manipulative.',
  },
  {
    dimension: 'response_clarity',
    weight: 0.13,
    criteria_5: 'Easy to read; headings and structure match the skill’s output_format.',
    criteria_3: 'Readable but cluttered or uneven.',
    criteria_1: 'Hard to follow.',
  },
  {
    dimension: 'conciseness',
    weight: 0.1,
    criteria_5: 'No unnecessary verbosity; appropriate length.',
    criteria_3: 'Some redundancy.',
    criteria_1: 'Excessively long or rambling.',
  },
];
