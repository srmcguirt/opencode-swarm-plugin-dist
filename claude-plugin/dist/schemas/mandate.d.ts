/**
 * Mandate schemas for voting system
 *
 * Agents file and vote on ideas, tips, lore, snippets, and feature requests.
 * High-consensus items become "mandates" that influence future behavior.
 *
 * Vote decay and scoring patterns match learning.ts (90-day half-life).
 */
import { z } from "zod";
/**
 * Content types for mandate entries
 */
export declare const MandateContentTypeSchema: z.ZodEnum<{
    idea: "idea";
    tip: "tip";
    lore: "lore";
    snippet: "snippet";
    feature_request: "feature_request";
}>;
export type MandateContentType = z.infer<typeof MandateContentTypeSchema>;
/**
 * Mandate status lifecycle
 *
 * - candidate: New entry, collecting votes
 * - established: Has some consensus but not enough for mandate status
 * - mandate: High consensus (net_votes >= 5 AND vote_ratio >= 0.7)
 * - rejected: Strong negative consensus or explicitly rejected
 */
export declare const MandateStatusSchema: z.ZodEnum<{
    candidate: "candidate";
    established: "established";
    mandate: "mandate";
    rejected: "rejected";
}>;
export type MandateStatus = z.infer<typeof MandateStatusSchema>;
/**
 * Vote type
 */
export declare const VoteTypeSchema: z.ZodEnum<{
    upvote: "upvote";
    downvote: "downvote";
}>;
export type VoteType = z.infer<typeof VoteTypeSchema>;
/**
 * A mandate entry represents a proposal from an agent
 *
 * Entries can be ideas, tips, lore, code snippets, or feature requests.
 * Other agents vote on entries to reach consensus.
 */
export declare const MandateEntrySchema: z.ZodObject<{
    id: z.ZodString;
    content: z.ZodString;
    content_type: z.ZodEnum<{
        idea: "idea";
        tip: "tip";
        lore: "lore";
        snippet: "snippet";
        feature_request: "feature_request";
    }>;
    author_agent: z.ZodString;
    created_at: z.ZodString;
    status: z.ZodDefault<z.ZodEnum<{
        candidate: "candidate";
        established: "established";
        mandate: "mandate";
        rejected: "rejected";
    }>>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export type MandateEntry = z.infer<typeof MandateEntrySchema>;
/**
 * A vote on a mandate entry
 *
 * Each agent can vote once per entry (upvote or downvote).
 * Votes decay with 90-day half-life matching learning.ts patterns.
 */
export declare const VoteSchema: z.ZodObject<{
    id: z.ZodString;
    mandate_id: z.ZodString;
    agent_name: z.ZodString;
    vote_type: z.ZodEnum<{
        upvote: "upvote";
        downvote: "downvote";
    }>;
    timestamp: z.ZodString;
    weight: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type Vote = z.infer<typeof VoteSchema>;
/**
 * Calculated score for a mandate entry
 *
 * Scores are recalculated periodically with decay applied.
 * Uses same decay formula as learning.ts (90-day half-life).
 */
export declare const MandateScoreSchema: z.ZodObject<{
    mandate_id: z.ZodString;
    net_votes: z.ZodNumber;
    vote_ratio: z.ZodNumber;
    decayed_score: z.ZodNumber;
    last_calculated: z.ZodString;
    raw_upvotes: z.ZodNumber;
    raw_downvotes: z.ZodNumber;
    decayed_upvotes: z.ZodNumber;
    decayed_downvotes: z.ZodNumber;
}, z.core.$strip>;
export type MandateScore = z.infer<typeof MandateScoreSchema>;
/**
 * Configuration for mandate decay calculation
 *
 * Matches learning.ts decay patterns.
 */
export interface MandateDecayConfig {
    /** Half-life for vote decay in days */
    halfLifeDays: number;
    /** Net votes threshold for mandate status */
    mandateNetVotesThreshold: number;
    /** Vote ratio threshold for mandate status */
    mandateVoteRatioThreshold: number;
    /** Net votes threshold for established status */
    establishedNetVotesThreshold: number;
    /** Negative net votes threshold for rejected status */
    rejectedNetVotesThreshold: number;
}
export declare const DEFAULT_MANDATE_DECAY_CONFIG: MandateDecayConfig;
/**
 * Arguments for creating a mandate entry
 */
export declare const CreateMandateArgsSchema: z.ZodObject<{
    content: z.ZodString;
    content_type: z.ZodEnum<{
        idea: "idea";
        tip: "tip";
        lore: "lore";
        snippet: "snippet";
        feature_request: "feature_request";
    }>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export type CreateMandateArgs = z.infer<typeof CreateMandateArgsSchema>;
/**
 * Arguments for casting a vote
 */
export declare const CastVoteArgsSchema: z.ZodObject<{
    mandate_id: z.ZodString;
    vote_type: z.ZodEnum<{
        upvote: "upvote";
        downvote: "downvote";
    }>;
    weight: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type CastVoteArgs = z.infer<typeof CastVoteArgsSchema>;
/**
 * Arguments for querying mandates
 */
export declare const QueryMandatesArgsSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        candidate: "candidate";
        established: "established";
        mandate: "mandate";
        rejected: "rejected";
    }>>;
    content_type: z.ZodOptional<z.ZodEnum<{
        idea: "idea";
        tip: "tip";
        lore: "lore";
        snippet: "snippet";
        feature_request: "feature_request";
    }>>;
    tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    author_agent: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
    min_score: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type QueryMandatesArgs = z.infer<typeof QueryMandatesArgsSchema>;
/**
 * Result of score calculation
 */
export declare const ScoreCalculationResultSchema: z.ZodObject<{
    mandate_id: z.ZodString;
    previous_status: z.ZodEnum<{
        candidate: "candidate";
        established: "established";
        mandate: "mandate";
        rejected: "rejected";
    }>;
    new_status: z.ZodEnum<{
        candidate: "candidate";
        established: "established";
        mandate: "mandate";
        rejected: "rejected";
    }>;
    score: z.ZodObject<{
        mandate_id: z.ZodString;
        net_votes: z.ZodNumber;
        vote_ratio: z.ZodNumber;
        decayed_score: z.ZodNumber;
        last_calculated: z.ZodString;
        raw_upvotes: z.ZodNumber;
        raw_downvotes: z.ZodNumber;
        decayed_upvotes: z.ZodNumber;
        decayed_downvotes: z.ZodNumber;
    }, z.core.$strip>;
    status_changed: z.ZodBoolean;
}, z.core.$strip>;
export type ScoreCalculationResult = z.infer<typeof ScoreCalculationResultSchema>;
export declare const mandateSchemas: {
    MandateContentTypeSchema: z.ZodEnum<{
        idea: "idea";
        tip: "tip";
        lore: "lore";
        snippet: "snippet";
        feature_request: "feature_request";
    }>;
    MandateStatusSchema: z.ZodEnum<{
        candidate: "candidate";
        established: "established";
        mandate: "mandate";
        rejected: "rejected";
    }>;
    VoteTypeSchema: z.ZodEnum<{
        upvote: "upvote";
        downvote: "downvote";
    }>;
    MandateEntrySchema: z.ZodObject<{
        id: z.ZodString;
        content: z.ZodString;
        content_type: z.ZodEnum<{
            idea: "idea";
            tip: "tip";
            lore: "lore";
            snippet: "snippet";
            feature_request: "feature_request";
        }>;
        author_agent: z.ZodString;
        created_at: z.ZodString;
        status: z.ZodDefault<z.ZodEnum<{
            candidate: "candidate";
            established: "established";
            mandate: "mandate";
            rejected: "rejected";
        }>>;
        tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>;
    VoteSchema: z.ZodObject<{
        id: z.ZodString;
        mandate_id: z.ZodString;
        agent_name: z.ZodString;
        vote_type: z.ZodEnum<{
            upvote: "upvote";
            downvote: "downvote";
        }>;
        timestamp: z.ZodString;
        weight: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>;
    MandateScoreSchema: z.ZodObject<{
        mandate_id: z.ZodString;
        net_votes: z.ZodNumber;
        vote_ratio: z.ZodNumber;
        decayed_score: z.ZodNumber;
        last_calculated: z.ZodString;
        raw_upvotes: z.ZodNumber;
        raw_downvotes: z.ZodNumber;
        decayed_upvotes: z.ZodNumber;
        decayed_downvotes: z.ZodNumber;
    }, z.core.$strip>;
    CreateMandateArgsSchema: z.ZodObject<{
        content: z.ZodString;
        content_type: z.ZodEnum<{
            idea: "idea";
            tip: "tip";
            lore: "lore";
            snippet: "snippet";
            feature_request: "feature_request";
        }>;
        tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>;
    CastVoteArgsSchema: z.ZodObject<{
        mandate_id: z.ZodString;
        vote_type: z.ZodEnum<{
            upvote: "upvote";
            downvote: "downvote";
        }>;
        weight: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>;
    QueryMandatesArgsSchema: z.ZodObject<{
        status: z.ZodOptional<z.ZodEnum<{
            candidate: "candidate";
            established: "established";
            mandate: "mandate";
            rejected: "rejected";
        }>>;
        content_type: z.ZodOptional<z.ZodEnum<{
            idea: "idea";
            tip: "tip";
            lore: "lore";
            snippet: "snippet";
            feature_request: "feature_request";
        }>>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
        author_agent: z.ZodOptional<z.ZodString>;
        limit: z.ZodDefault<z.ZodNumber>;
        min_score: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>;
    ScoreCalculationResultSchema: z.ZodObject<{
        mandate_id: z.ZodString;
        previous_status: z.ZodEnum<{
            candidate: "candidate";
            established: "established";
            mandate: "mandate";
            rejected: "rejected";
        }>;
        new_status: z.ZodEnum<{
            candidate: "candidate";
            established: "established";
            mandate: "mandate";
            rejected: "rejected";
        }>;
        score: z.ZodObject<{
            mandate_id: z.ZodString;
            net_votes: z.ZodNumber;
            vote_ratio: z.ZodNumber;
            decayed_score: z.ZodNumber;
            last_calculated: z.ZodString;
            raw_upvotes: z.ZodNumber;
            raw_downvotes: z.ZodNumber;
            decayed_upvotes: z.ZodNumber;
            decayed_downvotes: z.ZodNumber;
        }, z.core.$strip>;
        status_changed: z.ZodBoolean;
    }, z.core.$strip>;
};
//# sourceMappingURL=mandate.d.ts.map