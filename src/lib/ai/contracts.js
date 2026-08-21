"use strict";
/**
 * VeriFlow AI Service Contracts & Interfaces
 *
 * IMPORTANT ARCHITECTURAL DESIGN PRINCIPLES:
 * 1. These interfaces establish strict decoupling between the verification engine and future AI vision/geospatial model services.
 * 2. Real AI models (e.g., multimodal LLMs, visual embedding comparators, EXIF spatial analyzers) implement these contracts.
 * 3. Confidence values returned by implementations MUST represent evidence-support confidence ratings,
 *    not calibrated statistical probabilities.
 * 4. The engine and UI consume these contracts without assuming specific model implementations.
 */
Object.defineProperty(exports, "__esModule", { value: true });
