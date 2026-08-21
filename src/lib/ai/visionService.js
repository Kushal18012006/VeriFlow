"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisionService = void 0;
var VisionService = /** @class */ (function () {
    function VisionService() {
    }
    VisionService.prototype.analyzeResolutionDelta = function (request) {
        return __awaiter(this, void 0, void 0, function () {
            var apiKey, originalImages, resolutionImages, content, response, errText, data, rawOutput, parsed, supportConfidence, error_1;
            var _this = this;
            var _a, _b, _c;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        apiKey = process.env.VISION_AI_API_KEY;
                        if (!apiKey) {
                            console.warn('VISION_AI_API_KEY is missing. Aborting visual analysis.');
                            throw new Error('Vision AI API key is not configured.');
                        }
                        return [4 /*yield*/, Promise.all(request.originalEvidence.map(function (e) { return _this.fetchImageAsBase64(e.file_url); }))];
                    case 1:
                        originalImages = _d.sent();
                        return [4 /*yield*/, Promise.all(request.resolutionEvidence.map(function (e) { return _this.fetchImageAsBase64(e.file_url); }))];
                    case 2:
                        resolutionImages = _d.sent();
                        content = [
                            {
                                type: 'text',
                                text: "You are a professional civic infrastructure inspector.\nAnalyze the following pairs of \"Original Report\" and \"Resolution Proof\" images.\nCase Category: ".concat(request.category, "\nCase Description: ").concat(request.caseDescription, "\n\nYour task is to determine if the reported issue has been resolved.\nReturn a STRICT JSON object matching this structure:\n{\n  \"isResolved\": boolean, // true ONLY if fully resolved\n  \"resolutionLevel\": \"FULL\" | \"PARTIAL\" | \"NONE\" | \"INCONCLUSIVE\",\n  \"visualCoverageSufficient\": boolean,\n  \"detectedChanges\": string[], // list of specific observations\n  \"residualDamage\": boolean, // true if issue remains partially\n  \"explanation\": string // clear, human-readable justification for your findings\n}\nDO NOT include any markdown blocks or other text outside the JSON object.\n"),
                            },
                        ];
                        originalImages.forEach(function (img) {
                            if (img) {
                                content.push({ type: 'text', text: 'Original Evidence:' });
                                content.push({ type: 'image_url', image_url: { url: img } });
                            }
                        });
                        resolutionImages.forEach(function (img) {
                            if (img) {
                                content.push({ type: 'text', text: 'Resolution Proof Evidence:' });
                                content.push({ type: 'image_url', image_url: { url: img } });
                            }
                        });
                        _d.label = 3;
                    case 3:
                        _d.trys.push([3, 8, , 9]);
                        return [4 /*yield*/, fetch('https://api.openai.com/v1/chat/completions', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Authorization: "Bearer ".concat(apiKey),
                                },
                                body: JSON.stringify({
                                    model: 'gpt-4o', // or gpt-4-turbo, etc.
                                    messages: [{ role: 'user', content: content }],
                                    response_format: { type: 'json_object' },
                                    max_tokens: 1000,
                                }),
                            })];
                    case 4:
                        response = _d.sent();
                        if (!!response.ok) return [3 /*break*/, 6];
                        return [4 /*yield*/, response.text()];
                    case 5:
                        errText = _d.sent();
                        console.error('Vision API error:', response.status, errText);
                        throw new Error("Vision API error: ".concat(response.status));
                    case 6: return [4 /*yield*/, response.json()];
                    case 7:
                        data = _d.sent();
                        rawOutput = (_c = (_b = (_a = data.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message) === null || _c === void 0 ? void 0 : _c.content;
                        if (!rawOutput) {
                            throw new Error('Empty response from Vision API');
                        }
                        parsed = JSON.parse(rawOutput);
                        supportConfidence = 0.5;
                        if (parsed.resolutionLevel === 'FULL') {
                            supportConfidence = parsed.visualCoverageSufficient ? 0.95 : 0.7;
                        }
                        else if (parsed.resolutionLevel === 'PARTIAL') {
                            supportConfidence = 0.8;
                        }
                        else if (parsed.resolutionLevel === 'NONE') {
                            supportConfidence = 0.9;
                        }
                        return [2 /*return*/, {
                                isResolved: parsed.isResolved,
                                supportConfidence: supportConfidence,
                                detectedChanges: parsed.detectedChanges,
                                visualCoverageSufficient: parsed.visualCoverageSufficient,
                                explanation: parsed.explanation,
                                rawModelResponse: parsed,
                            }];
                    case 8:
                        error_1 = _d.sent();
                        console.error('VisionService analysis failed:', error_1);
                        throw error_1;
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Helper to fetch an image (local or remote) and convert it to a base64 Data URI
     * required by most Vision APIs when handling local development environments.
     */
    VisionService.prototype.fetchImageAsBase64 = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var fetchUrl, baseUrl, response, arrayBuffer, buffer, mimeType, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        fetchUrl = url;
                        // If it's a relative URL in local dev, prepend localhost
                        if (url.startsWith('/')) {
                            baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
                            fetchUrl = "".concat(baseUrl).concat(url);
                        }
                        return [4 /*yield*/, fetch(fetchUrl)];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, response.arrayBuffer()];
                    case 2:
                        arrayBuffer = _a.sent();
                        buffer = Buffer.from(arrayBuffer);
                        mimeType = response.headers.get('content-type') || 'image/jpeg';
                        // If it's an SVG, OpenAI doesn't natively support SVG vision well, but some models do.
                        // We will pass it as a standard data URI.
                        return [2 /*return*/, "data:".concat(mimeType, ";base64,").concat(buffer.toString('base64'))];
                    case 3:
                        e_1 = _a.sent();
                        console.error("Failed to fetch image for base64 conversion: ".concat(url), e_1);
                        return [2 /*return*/, null];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return VisionService;
}());
exports.VisionService = VisionService;
