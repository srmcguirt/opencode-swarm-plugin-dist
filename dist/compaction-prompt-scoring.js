// src/compaction-prompt-scoring.ts
var REAL_EPIC_ID = /mjkw[a-z0-9]{7,}/;
var PLACEHOLDERS = [
  /<epic-id>/i,
  /bd-xxx/,
  /<path>/i,
  /<project>/i
];
var ASCII_BOX = /[┌┐└┘─│]{3,}/;
var STRONG_LANGUAGE = [/\bNEVER\b/, /\bALWAYS\b/, /\bNON-NEGOTIABLE\b/];
function scoreEpicIdSpecificity(prompt) {
  for (const pattern of PLACEHOLDERS) {
    if (pattern.test(prompt.content)) {
      return {
        score: 0,
        message: `Found placeholder: ${pattern.source}`
      };
    }
  }
  if (REAL_EPIC_ID.test(prompt.content)) {
    return {
      score: 1,
      message: "Contains real epic ID"
    };
  }
  return {
    score: 0,
    message: "No epic ID found"
  };
}
function scoreActionability(prompt) {
  const actionableTools = [
    /swarm_status\([^)]*epic_id\s*=\s*['"]mjkw[a-z0-9]{7,}['"]/,
    /swarmmail_inbox\(\)/
  ];
  for (const pattern of actionableTools) {
    if (pattern.test(prompt.content)) {
      return {
        score: 1,
        message: "Contains actionable tool call with real values"
      };
    }
  }
  if (/swarm_status\([^)]*<epic-id>/.test(prompt.content) || /swarm_status\([^)]*<path>/.test(prompt.content)) {
    return {
      score: 0,
      message: "Tool call has placeholders"
    };
  }
  return {
    score: 0,
    message: "No actionable tool calls found"
  };
}
function scoreCoordinatorIdentity(prompt) {
  const hasAsciiHeader = ASCII_BOX.test(prompt.content) && /(YOU ARE THE COORDINATOR|COORDINATOR MODE)/i.test(prompt.content);
  if (!hasAsciiHeader) {
    return {
      score: 0,
      message: "No ASCII header found"
    };
  }
  const hasStrongLanguage = STRONG_LANGUAGE.some((pattern) => pattern.test(prompt.content));
  if (!hasStrongLanguage) {
    return {
      score: 0.5,
      message: "ASCII header present but weak language"
    };
  }
  return {
    score: 1,
    message: "ASCII header + strong mandates present"
  };
}
function scoreForbiddenToolsPresent(prompt) {
  const forbiddenTools = [
    /\bEdit\b/i,
    /\bWrite\b/i,
    /swarmmail_reserve/,
    /git commit/,
    /\bbash\b/i
  ];
  const foundTools = forbiddenTools.filter((pattern) => pattern.test(prompt.content));
  const score = foundTools.length / forbiddenTools.length;
  if (score === 1) {
    return {
      score: 1,
      message: "All 5 forbidden tools listed"
    };
  }
  if (score === 0) {
    return {
      score: 0,
      message: "No forbidden tools listed (0/5)"
    };
  }
  return {
    score,
    message: `${foundTools.length}/5 forbidden tools listed`
  };
}
function scorePostCompactionDiscipline(prompt) {
  const toolCallPattern = /\b(swarm_status|swarmmail_inbox|Edit|Write|Read)\b/i;
  const match = prompt.content.match(toolCallPattern);
  if (!match) {
    return {
      score: 0,
      message: "No tool calls found"
    };
  }
  const firstTool = match[1].toLowerCase();
  if (firstTool === "swarm_status") {
    return {
      score: 1,
      message: "First tool is swarm_status (correct)"
    };
  }
  if (firstTool === "swarmmail_inbox") {
    return {
      score: 1,
      message: "First tool is inbox (correct)"
    };
  }
  return {
    score: 0,
    message: `First tool is ${match[1]} (should be swarm_status or inbox)`
  };
}
export {
  scorePostCompactionDiscipline,
  scoreForbiddenToolsPresent,
  scoreEpicIdSpecificity,
  scoreCoordinatorIdentity,
  scoreActionability,
  STRONG_LANGUAGE,
  REAL_EPIC_ID,
  PLACEHOLDERS,
  ASCII_BOX
};
