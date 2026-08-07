/**
 * Export Tools - Convert Cell Events to Various Formats
 *
 * GREEN PHASE: Minimal implementation to pass tests
 *
 * Supports:
 * - OTLP (OpenTelemetry Protocol) - for distributed tracing
 * - CSV - for spreadsheet analysis
 * - JSON - for generic data interchange
 */
import type { CellEvent } from "./schemas/cell-events.js";
/**
 * OpenTelemetry OTLP span structure
 */
interface OTLPSpan {
    traceId: string;
    spanId: string;
    name: string;
    startTimeUnixNano: string;
    attributes: Array<{
        key: string;
        value: {
            stringValue?: string;
            intValue?: number;
            boolValue?: boolean;
        };
    }>;
}
interface OTLPOutput {
    resourceSpans: Array<{
        resource: {
            attributes: Array<{
                key: string;
                value: {
                    stringValue: string;
                };
            }>;
        };
        scopeSpans: Array<{
            scope: {
                name: string;
            };
            spans: OTLPSpan[];
        }>;
    }>;
}
/**
 * Export cell events to OpenTelemetry OTLP format
 *
 * Mapping:
 * - epic_id (from metadata) → trace_id (32 hex chars)
 * - cell_id → span_id (16 hex chars)
 * - timestamp → startTimeUnixNano (nanoseconds as string)
 * - event.type → span.name
 * - event payload → span.attributes
 */
export declare function exportToOTLP(events: CellEvent[]): OTLPOutput;
/**
 * Export cell events to CSV format
 *
 * Format:
 * - Headers: id,type,timestamp,project_key,cell_id,payload
 * - Payload: JSON serialization of entire event (minus headers)
 */
export declare function exportToCSV(events: CellEvent[]): string;
/**
 * Export cell events to JSON format
 *
 * Format:
 * - Array of event objects
 * - Pretty-printed with 2-space indentation
 * - Preserves all fields and discriminated union types
 */
export declare function exportToJSON(events: CellEvent[]): string;
export {};
//# sourceMappingURL=export-tools.d.ts.map