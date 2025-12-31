import type { ComponentProps } from "react";

/**
 * Phosphor icon glyph names with ph- prefix
 * @example "ph-check", "ph-arrow-right"
 */
export type PhosphorIcon =
  | "ph-arrow-right"
  | "ph-arrows-clockwise"
  | "ph-bell"
  | "ph-caret-double-left"
  | "ph-caret-double-right"
  | "ph-caret-down"
  | "ph-caret-left"
  | "ph-caret-right"
  | "ph-caret-up-down"
  | "ph-check"
  | "ph-clipboard"
  | "ph-cloud-slash"
  | "ph-copy"
  | "ph-database"
  | "ph-download"
  | "ph-eye"
  | "ph-eye-slash"
  | "ph-file"
  | "ph-folder"
  | "ph-folder-open"
  | "ph-gear"
  | "ph-globe-hemisphere-west"
  | "ph-house"
  | "ph-info"
  | "ph-magnifying-glass"
  | "ph-minus"
  | "ph-pencil"
  | "ph-plus"
  | "ph-share"
  | "ph-sign-out"
  | "ph-trash"
  | "ph-user"
  | "ph-warning"
  | "ph-x";

/**
 * Cloudflare brand icon glyph names with cf- prefix
 * @example "cf-workers", "cf-pages"
 */
export type BrandIcon =
  | "cf-ai-audit-outline"
  | "cf-airplane-paper-outline"
  | "cf-airplane-paper-solid"
  | "cf-analytics-bots-outline"
  | "cf-analytics-bots-solid"
  | "cf-analytics-data-outline"
  | "cf-analytics-data-solid"
  | "cf-analytics-network-outline"
  | "cf-analytics-network-solid"
  | "cf-analytics-pie-outline"
  | "cf-analytics-pie-solid"
  | "cf-api-security-outline"
  | "cf-apple-outline"
  | "cf-applications-outline"
  | "cf-arrow-backward-outline"
  | "cf-arrow-down-outline"
  | "cf-arrow-external-link-1-outline"
  | "cf-arrow-external-link-2-outline"
  | "cf-arrow-external-link-2-solid"
  | "cf-arrow-outline"
  | "cf-arrow-twoway-outline"
  | "cf-arrow-up-outline"
  | "cf-attacker-outline"
  | "cf-attention-outline"
  | "cf-attention-solid"
  | "cf-auto-rag-outline"
  | "cf-benefits-healthcare-outline"
  | "cf-benefits-healthcare-solid"
  | "cf-benefits-paid-vacation-outline"
  | "cf-benefits-paid-vacation-solid"
  | "cf-benefits-parental-leave-outline"
  | "cf-benefits-parental-leave-solid"
  | "cf-benefits-returnship-outline"
  | "cf-benefits-returnship-solid"
  | "cf-benefits-salary-outline"
  | "cf-benefits-salary-solid"
  | "cf-bookmark-outline"
  | "cf-bookmark-solid"
  | "cf-bug-outline"
  | "cf-bug-solid"
  | "cf-calendar-outline"
  | "cf-calendar-solid"
  | "cf-call-outline"
  | "cf-captcha-outline"
  | "cf-caret-double-left-outline"
  | "cf-caret-double-right-outline"
  | "cf-caret-down-1-solid"
  | "cf-caret-down-2-outline"
  | "cf-caret-left-1-solid"
  | "cf-caret-left-2-outline"
  | "cf-caret-reorder-2-outline"
  | "cf-caret-reorder-solid"
  | "cf-caret-resize-horizontal-solid"
  | "cf-caret-right-1-solid"
  | "cf-caret-right-2-outline"
  | "cf-caret-up-1-solid"
  | "cf-caret-up-2-outline"
  | "cf-case-study-outline"
  | "cf-case-study-solid"
  | "cf-cell-tower-outline"
  | "cf-certificate-manager-outline"
  | "cf-certificate-manager-solid"
  | "cf-certificate-outline"
  | "cf-certificate-solid"
  | "cf-challenges"
  | "cf-change-outline"
  | "cf-chat-outline"
  | "cf-chat-social-outline"
  | "cf-cloud-hybrid-outline"
  | "cf-cloud-hybrid-solid"
  | "cf-cloud-internet-outline"
  | "cf-cloud-internet-solid"
  | "cf-cloud-multi-outline"
  | "cf-cloud-multi-solid"
  | "cf-cloud-security-outline"
  | "cf-cloud-upload-outline"
  | "cf-cloud-upload-solid"
  | "cf-cloudflare-access-outline"
  | "cf-cloudflare-access-solid"
  | "cf-cloudflare-account-analytics-outline"
  | "cf-cloudflare-api-outline"
  | "cf-cloudflare-api-solid"
  | "cf-cloudflare-area1-outline"
  | "cf-cloudflare-argo-smart-routing-outline"
  | "cf-cloudflare-browser-outline"
  | "cf-cloudflare-browser-solid"
  | "cf-cloudflare-bundled-outline"
  | "cf-cloudflare-byoip-outline"
  | "cf-cloudflare-carbon-impact-outline"
  | "cf-cloudflare-casb-outline"
  | "cf-cloudflare-d-outline"
  | "cf-cloudflare-dlp-outline"
  | "cf-cloudflare-durable-objects-outline"
  | "cf-cloudflare-email-forwarding-outline"
  | "cf-cloudflare-email-security-outline"
  | "cf-cloudflare-email-security-solid"
  | "cf-cloudflare-firewall-rules-outline"
  | "cf-cloudflare-gateway-outline"
  | "cf-cloudflare-gateway-solid"
  | "cf-cloudflare-kv-outline"
  | "cf-cloudflare-magic-firewall-outline"
  | "cf-cloudflare-magic-transit-outline"
  | "cf-cloudflare-magic-wan-outline"
  | "cf-cloudflare-pages-outline"
  | "cf-cloudflare-pages-solid"
  | "cf-cloudflare-pipelines-outline"
  | "cf-cloudflare-pubsub-outline"
  | "cf-cloudflare-radar-outline"
  | "cf-cloudflare-radar-solid"
  | "cf-cloudflare-registrar-outline"
  | "cf-cloudflare-registrar-solid"
  | "cf-cloudflare-ruleset-engine-outline"
  | "cf-cloudflare-security-application-outline"
  | "cf-cloudflare-security-center-outline"
  | "cf-cloudflare-security-center-solid"
  | "cf-cloudflare-security-network-outline"
  | "cf-cloudflare-spectrum-outline"
  | "cf-cloudflare-spectrum-solid"
  | "cf-cloudflare-stream-delivery-outline"
  | "cf-cloudflare-stream-delivery-solid"
  | "cf-cloudflare-tail-worker-outline"
  | "cf-cloudflare-teams-outline"
  | "cf-cloudflare-trace-outline"
  | "cf-cloudflare-unbound-outline"
  | "cf-cloudflare-waiting-room-outline"
  | "cf-cloudflare-warp-mobile-outline"
  | "cf-cloudflare-warp-outline"
  | "cf-cloudflare-warp-solid"
  | "cf-cloudflare-web-analytics-outline"
  | "cf-cloudflare-web3-outline"
  | "cf-cloudflare-webassembly-outline"
  | "cf-cloudflare-workers-outline"
  | "cf-cloudflare-workers-solid"
  | "cf-cloudflare-zaraz-outline"
  | "cf-cloudflare-zero-trust-outline"
  | "cf-cloudflare-zero-trust-solid"
  | "cf-cloudy"
  | "cf-code-api-outline"
  | "cf-code-api-solid"
  | "cf-code-brackets-outline"
  | "cf-code-branch-outline"
  | "cf-code-branch-solid"
  | "cf-code-js-outline"
  | "cf-code-outline"
  | "cf-code-solid"
  | "cf-collapse-outline"
  | "cf-complexity-outline"
  | "cf-comprehensive-outline"
  | "cf-connect-1-outline"
  | "cf-connect-2-outline"
  | "cf-connect-iot-outline"
  | "cf-connect-iot-solid"
  | "cf-consolidation-outline"
  | "cf-continuous-protection-outline"
  | "cf-copy-duplicate-outline"
  | "cf-copy-duplicate-solid"
  | "cf-corner-down-right-outline"
  | "cf-culture-outline"
  | "cf-customer-service-outline"
  | "cf-d1-outline"
  | "cf-ddos-attack-outline"
  | "cf-ddos-solid"
  | "cf-delivery-truck-outline"
  | "cf-device-desktop-outline"
  | "cf-device-desktop-solid"
  | "cf-device-laptop-outline"
  | "cf-device-laptop-solid"
  | "cf-device-mobile-outline"
  | "cf-device-mobile-solid"
  | "cf-device-tablet-outline"
  | "cf-device-tablet-solid"
  | "cf-dex-digital-experience-monitoring-outline"
  | "cf-documentation-clipboard-outline"
  | "cf-documentation-clipboard-solid"
  | "cf-documentation-list-outline"
  | "cf-documentation-list-solid"
  | "cf-documentation-logs-outline"
  | "cf-documentation-logs-solid"
  | "cf-documentation-outline"
  | "cf-documentation-rules-outline"
  | "cf-documentation-rules-solid"
  | "cf-documentation-solid"
  | "cf-documentation-support-outline"
  | "cf-download-outline"
  | "cf-downtime-outline"
  | "cf-drag-outline"
  | "cf-drag-solid"
  | "cf-drive-outline"
  | "cf-drive-solid"
  | "cf-ease-of-use-toggle-outline"
  | "cf-ease-of-use-toggle-solid"
  | "cf-edge-log-delivery-outline"
  | "cf-edge-log-delivery-solid"
  | "cf-edit-outline"
  | "cf-edit-solid"
  | "cf-email-outline"
  | "cf-email-solid"
  | "cf-exit-outline"
  | "cf-expand-outline"
  | "cf-eyeball-outline"
  | "cf-eyeball-solid"
  | "cf-face-happy-outline"
  | "cf-face-happy-solid"
  | "cf-face-sad-outline"
  | "cf-face-sad-solid"
  | "cf-filter-drawer-outline"
  | "cf-filtering-outline"
  | "cf-filtering-solid"
  | "cf-fire-outline"
  | "cf-firewall-for-ai"
  | "cf-folder-outline"
  | "cf-funnel-outline"
  | "cf-future-proof-outline"
  | "cf-garbage-outline"
  | "cf-geo-key-manager-outline"
  | "cf-geo-key-manager-solid"
  | "cf-government-outline"
  | "cf-graduation-outline"
  | "cf-green-leaf-outline"
  | "cf-growth-outline"
  | "cf-hamburger-1-outline"
  | "cf-hamburger-2-outline"
  | "cf-health-check-outline"
  | "cf-health-check-solid"
  | "cf-help-giving-outline"
  | "cf-help-giving-solid"
  | "cf-help-question-outline"
  | "cf-help-question-solid"
  | "cf-hide-eye-outline"
  | "cf-home-outline"
  | "cf-icard-view-outline"
  | "cf-icard-view-solid"
  | "cf-image-outline"
  | "cf-image-solid"
  | "cf-inbox-outline"
  | "cf-industry-gaming-outline"
  | "cf-industry-gaming-solid"
  | "cf-industry-outline"
  | "cf-industry-solid"
  | "cf-info-outline"
  | "cf-info-solid"
  | "cf-innovation-intelligence-outline"
  | "cf-innovation-intelligence-solid"
  | "cf-innovation-thinking-outline"
  | "cf-innovation-thinking-solid"
  | "cf-internet-browser-outline"
  | "cf-internet-browser-solid"
  | "cf-internet-globe-outline"
  | "cf-internet-globe-solid"
  | "cf-ip-truncation-outline"
  | "cf-ip-truncation-solid"
  | "cf-key-outline"
  | "cf-leader-crown-outline"
  | "cf-leader-crown-solid"
  | "cf-learning-center-book-outline"
  | "cf-learning-center-book-solid"
  | "cf-lighthouse-outline"
  | "cf-link-outline"
  | "cf-link-solid"
  | "cf-list-view-outline"
  | "cf-loading-outline"
  | "cf-location-pin-outline"
  | "cf-location-pin-solid"
  | "cf-logo-1.1.1.1-outline"
  | "cf-logo-cloudflare-tv-solid"
  | "cf-logo-discord-outline"
  | "cf-logo-discord-solid"
  | "cf-logo-facebook-solid"
  | "cf-logo-github-solid"
  | "cf-logo-instagram-outline"
  | "cf-logo-instagram-solid"
  | "cf-logo-linkedin-outline"
  | "cf-logo-linkedin-solid"
  | "cf-logo-terraform-solid"
  | "cf-logo-twitter-outline"
  | "cf-logo-twitter-solid"
  | "cf-logo-wechat-outline"
  | "cf-logo-wechat-solid"
  | "cf-logo-weibo-outline"
  | "cf-logo-weibo-solid"
  | "cf-logo-youtube-outline"
  | "cf-logo-youtube-solid"
  | "cf-logo-zhihu-outline"
  | "cf-logo-zhihu-solid"
  | "cf-machine-learning-contextual-outline"
  | "cf-magic-network-monitoring-outline"
  | "cf-mcp-server-outline"
  | "cf-media-pause-outline"
  | "cf-media-pause-solid"
  | "cf-media-play-outline"
  | "cf-media-play-solid"
  | "cf-media-stop-outline"
  | "cf-media-stop-solid"
  | "cf-more-1-outline"
  | "cf-more-1-solid"
  | "cf-more-2-outline"
  | "cf-network-scale-outline"
  | "cf-network-scale-solid"
  | "cf-network-virtual-backbone-outline"
  | "cf-network-virtual-backbone-solid"
  | "cf-no-edit-outline"
  | "cf-no-edit-solid"
  | "cf-no-security-shield-outline"
  | "cf-no-security-shield-solid"
  | "cf-no-stop-outline"
  | "cf-no-stop-solid"
  | "cf-no-stop-x-outline"
  | "cf-no-stop-x-solid"
  | "cf-notification-announcements-outline"
  | "cf-notification-announcements-solid"
  | "cf-numeric-1-outline"
  | "cf-numeric-1-solid"
  | "cf-numeric-100-outline"
  | "cf-numeric-2-outline"
  | "cf-numeric-2-solid"
  | "cf-numeric-3-outline"
  | "cf-numeric-3-solid"
  | "cf-numeric-add-outline"
  | "cf-numeric-add-solid"
  | "cf-numeric-minus-outline"
  | "cf-numeric-minus-solid"
  | "cf-numeric-plus-outline"
  | "cf-numeric-subtract-outline"
  | "cf-office-branch-outline"
  | "cf-office-branch-solid"
  | "cf-office-headquarters-outline"
  | "cf-office-headquarters-solid"
  | "cf-ok-check-outline"
  | "cf-open-door-exit-outline"
  | "cf-open-door-exit-solid"
  | "cf-open-sidepanel-left-outline"
  | "cf-open-sidepanel-right-outline"
  | "cf-optimization-gear-outline"
  | "cf-optimization-gear-solid"
  | "cf-optimization-scale-outline"
  | "cf-optimization-scale-solid"
  | "cf-optimization-web-outline"
  | "cf-optimization-web-solid"
  | "cf-orbit-outline"
  | "cf-organization-outline"
  | "cf-overflow-2-solid"
  | "cf-overflow-solid"
  | "cf-page-shield-outine"
  | "cf-page-shield-solid"
  | "cf-payments-credit-card-outline"
  | "cf-payments-credit-card-solid"
  | "cf-performance-1-outline"
  | "cf-performance-acceleration-bolt-outline"
  | "cf-performance-acceleration-bolt-solid"
  | "cf-performance-acceleration-rocket-outline"
  | "cf-performance-acceleration-rocket-solid"
  | "cf-performance-arrow-up-outline"
  | "cf-performance-cloud-speed-outline"
  | "cf-performance-cloud-speed-solid"
  | "cf-performance-intelligent-routing-outline"
  | "cf-performance-intelligent-routing-solid"
  | "cf-performance-routing-outline"
  | "cf-performance-routing-solid"
  | "cf-performance-validator-outline"
  | "cf-performance-validator-solid"
  | "cf-performance-wrench-outline"
  | "cf-performance-wrench-solid"
  | "cf-phishing-outline"
  | "cf-pin-outline"
  | "cf-pin-solid"
  | "cf-pipeline-sink-outline"
  | "cf-pipeline-stream-outline"
  | "cf-platform-apps-outline"
  | "cf-platform-apps-solid"
  | "cf-podcast-microphone-outline"
  | "cf-podcast-microphone-solid"
  | "cf-poison-outline"
  | "cf-power-outline"
  | "cf-power-solid"
  | "cf-preemptive-outline"
  | "cf-premium-success-offering-outline"
  | "cf-premium-success-offering-solid"
  | "cf-price-outline"
  | "cf-price-solid"
  | "cf-printer-outline"
  | "cf-printer-solid"
  | "cf-process-flow-outline"
  | "cf-process-flow-solid"
  | "cf-process-stack-outline"
  | "cf-pull-request-merged-outline"
  | "cf-pull-request-merged-solid"
  | "cf-pull-request-outline"
  | "cf-pull-request-solid"
  | "cf-queues-outline"
  | "cf-r2-outline"
  | "cf-radar-dish-outline"
  | "cf-ransom-ddos-outline"
  | "cf-ransomware-attack-outline"
  | "cf-ransomware-outline"
  | "cf-refactor-outline"
  | "cf-refresh-outline"
  | "cf-regional-services-outline"
  | "cf-regional-services-solid"
  | "cf-reliability-dns-outline"
  | "cf-reliability-dns-resolver-outline"
  | "cf-reliability-dns-resolver-solid"
  | "cf-reliability-dns-solid"
  | "cf-reliability-load-balancer-outline"
  | "cf-reliability-load-balancer-solid"
  | "cf-reliability-timer-outline"
  | "cf-reliability-timer-solid"
  | "cf-remote-work-from-home-outline"
  | "cf-replatform-outline"
  | "cf-reusable-components-outline"
  | "cf-revert-outline"
  | "cf-revert-solid"
  | "cf-router-outline"
  | "cf-router-solid"
  | "cf-satellite-outline"
  | "cf-satellite-solid"
  | "cf-search-outline"
  | "cf-secrets-store-outline"
  | "cf-security-bots-outline"
  | "cf-security-bots-solid"
  | "cf-security-crawler-outline"
  | "cf-security-crawler-solid"
  | "cf-security-fingerprint-privacy-outline"
  | "cf-security-lock-outline"
  | "cf-security-lock-solid"
  | "cf-security-scraping-outline"
  | "cf-security-scraping-solid"
  | "cf-security-shield-protection-1-outline"
  | "cf-security-shield-protection-1-solid"
  | "cf-security-shield-protection-2-outline"
  | "cf-security-shield-protection-2-solid"
  | "cf-security-unlock-outline"
  | "cf-security-unlock-solid"
  | "cf-security-waf-outline"
  | "cf-security-waf-solid"
  | "cf-server-1-outline"
  | "cf-server-1-solid"
  | "cf-server-2-outline"
  | "cf-server-2-solid"
  | "cf-server-3-outline"
  | "cf-server-3-solid"
  | "cf-server-database-outline"
  | "cf-server-database-solid"
  | "cf-server-origin-outline"
  | "cf-server-origin-solid"
  | "cf-share-arrow-outline"
  | "cf-share-outline"
  | "cf-share-solid"
  | "cf-shop-cart-no-outline"
  | "cf-shop-cart-no-solid"
  | "cf-shop-cart-outline"
  | "cf-shop-cart-solid"
  | "cf-slow-snail-outline"
  | "cf-sort-outline"
  | "cf-spam-email-outline"
  | "cf-spam-email-solid"
  | "cf-sports-outline"
  | "cf-star-outline"
  | "cf-star-solid"
  | "cf-support-chat-outline"
  | "cf-support-chat-solid"
  | "cf-table-outline"
  | "cf-tag-outline"
  | "cf-tag-solid"
  | "cf-target-outline"
  | "cf-target-retarget-outline"
  | "cf-target-retarget-solid"
  | "cf-target-solid"
  | "cf-thumbs-down-outline"
  | "cf-thumbs-down-solid"
  | "cf-thumbs-up-outline"
  | "cf-thumbs-up-solid"
  | "cf-time-outline"
  | "cf-time-solid"
  | "cf-traffic-attack-browser-outline"
  | "cf-traffic-attack-browser-solid"
  | "cf-traffic-legit-browser-outline"
  | "cf-traffic-legit-browser-solid"
  | "cf-trophy-outline"
  | "cf-user-add-member-outline"
  | "cf-user-add-member-solid"
  | "cf-user-multi-outline"
  | "cf-user-multi-solid"
  | "cf-user-outline"
  | "cf-user-solid"
  | "cf-vectorize-db-outline"
  | "cf-version-outline"
  | "cf-video-browser-outline"
  | "cf-video-browser-solid"
  | "cf-virtual-machine-outline"
  | "cf-warning-outline"
  | "cf-warning-solid"
  | "cf-wheel"
  | "cf-workers-constellation-outline"
  | "cf-workers-for-platform-outline"
  | "cf-workers-pages-outline"
  | "cf-wrangler-cli-outline"
  | "cf-x-exit-outline"
  | "cf-x-solid"
  | "cf-yes-check-outline"
  | "cf-yes-check-solid"
  | "cf-zero-trust-risk-scoring-outline";

/**
 * All available icon glyphs (Phosphor + Brand)
 */
export type IconGlyph = PhosphorIcon | BrandIcon;

/**
 * Array of all icon glyphs for validation and autocomplete
 */
export const ALL_ICON_GLYPHS: readonly IconGlyph[] = [
  "ph-arrow-right",
  "ph-arrows-clockwise",
  "ph-bell",
  "ph-caret-double-left",
  "ph-caret-double-right",
  "ph-caret-down",
  "ph-caret-left",
  "ph-caret-right",
  "ph-caret-up-down",
  "ph-check",
  "ph-clipboard",
  "ph-cloud-slash",
  "ph-copy",
  "ph-database",
  "ph-download",
  "ph-eye",
  "ph-eye-slash",
  "ph-file",
  "ph-folder",
  "ph-folder-open",
  "ph-gear",
  "ph-globe-hemisphere-west",
  "ph-house",
  "ph-info",
  "ph-magnifying-glass",
  "ph-minus",
  "ph-pencil",
  "ph-plus",
  "ph-share",
  "ph-sign-out",
  "ph-trash",
  "ph-user",
  "ph-warning",
  "ph-x",
  "cf-ai-audit-outline",
  "cf-airplane-paper-outline",
  "cf-airplane-paper-solid",
  "cf-analytics-bots-outline",
  "cf-analytics-bots-solid",
  "cf-analytics-data-outline",
  "cf-analytics-data-solid",
  "cf-analytics-network-outline",
  "cf-analytics-network-solid",
  "cf-analytics-pie-outline",
  "cf-analytics-pie-solid",
  "cf-api-security-outline",
  "cf-apple-outline",
  "cf-applications-outline",
  "cf-arrow-backward-outline",
  "cf-arrow-down-outline",
  "cf-arrow-external-link-1-outline",
  "cf-arrow-external-link-2-outline",
  "cf-arrow-external-link-2-solid",
  "cf-arrow-outline",
  "cf-arrow-twoway-outline",
  "cf-arrow-up-outline",
  "cf-attacker-outline",
  "cf-attention-outline",
  "cf-attention-solid",
  "cf-auto-rag-outline",
  "cf-benefits-healthcare-outline",
  "cf-benefits-healthcare-solid",
  "cf-benefits-paid-vacation-outline",
  "cf-benefits-paid-vacation-solid",
  "cf-benefits-parental-leave-outline",
  "cf-benefits-parental-leave-solid",
  "cf-benefits-returnship-outline",
  "cf-benefits-returnship-solid",
  "cf-benefits-salary-outline",
  "cf-benefits-salary-solid",
  "cf-bookmark-outline",
  "cf-bookmark-solid",
  "cf-bug-outline",
  "cf-bug-solid",
  "cf-calendar-outline",
  "cf-calendar-solid",
  "cf-call-outline",
  "cf-captcha-outline",
  "cf-caret-double-left-outline",
  "cf-caret-double-right-outline",
  "cf-caret-down-1-solid",
  "cf-caret-down-2-outline",
  "cf-caret-left-1-solid",
  "cf-caret-left-2-outline",
  "cf-caret-reorder-2-outline",
  "cf-caret-reorder-solid",
  "cf-caret-resize-horizontal-solid",
  "cf-caret-right-1-solid",
  "cf-caret-right-2-outline",
  "cf-caret-up-1-solid",
  "cf-caret-up-2-outline",
  "cf-case-study-outline",
  "cf-case-study-solid",
  "cf-cell-tower-outline",
  "cf-certificate-manager-outline",
  "cf-certificate-manager-solid",
  "cf-certificate-outline",
  "cf-certificate-solid",
  "cf-challenges",
  "cf-change-outline",
  "cf-chat-outline",
  "cf-chat-social-outline",
  "cf-cloud-hybrid-outline",
  "cf-cloud-hybrid-solid",
  "cf-cloud-internet-outline",
  "cf-cloud-internet-solid",
  "cf-cloud-multi-outline",
  "cf-cloud-multi-solid",
  "cf-cloud-security-outline",
  "cf-cloud-upload-outline",
  "cf-cloud-upload-solid",
  "cf-cloudflare-access-outline",
  "cf-cloudflare-access-solid",
  "cf-cloudflare-account-analytics-outline",
  "cf-cloudflare-api-outline",
  "cf-cloudflare-api-solid",
  "cf-cloudflare-area1-outline",
  "cf-cloudflare-argo-smart-routing-outline",
  "cf-cloudflare-browser-outline",
  "cf-cloudflare-browser-solid",
  "cf-cloudflare-bundled-outline",
  "cf-cloudflare-byoip-outline",
  "cf-cloudflare-carbon-impact-outline",
  "cf-cloudflare-casb-outline",
  "cf-cloudflare-d-outline",
  "cf-cloudflare-dlp-outline",
  "cf-cloudflare-durable-objects-outline",
  "cf-cloudflare-email-forwarding-outline",
  "cf-cloudflare-email-security-outline",
  "cf-cloudflare-email-security-solid",
  "cf-cloudflare-firewall-rules-outline",
  "cf-cloudflare-gateway-outline",
  "cf-cloudflare-gateway-solid",
  "cf-cloudflare-kv-outline",
  "cf-cloudflare-magic-firewall-outline",
  "cf-cloudflare-magic-transit-outline",
  "cf-cloudflare-magic-wan-outline",
  "cf-cloudflare-pages-outline",
  "cf-cloudflare-pages-solid",
  "cf-cloudflare-pipelines-outline",
  "cf-cloudflare-pubsub-outline",
  "cf-cloudflare-radar-outline",
  "cf-cloudflare-radar-solid",
  "cf-cloudflare-registrar-outline",
  "cf-cloudflare-registrar-solid",
  "cf-cloudflare-ruleset-engine-outline",
  "cf-cloudflare-security-application-outline",
  "cf-cloudflare-security-center-outline",
  "cf-cloudflare-security-center-solid",
  "cf-cloudflare-security-network-outline",
  "cf-cloudflare-spectrum-outline",
  "cf-cloudflare-spectrum-solid",
  "cf-cloudflare-stream-delivery-outline",
  "cf-cloudflare-stream-delivery-solid",
  "cf-cloudflare-tail-worker-outline",
  "cf-cloudflare-teams-outline",
  "cf-cloudflare-trace-outline",
  "cf-cloudflare-unbound-outline",
  "cf-cloudflare-waiting-room-outline",
  "cf-cloudflare-warp-mobile-outline",
  "cf-cloudflare-warp-outline",
  "cf-cloudflare-warp-solid",
  "cf-cloudflare-web-analytics-outline",
  "cf-cloudflare-web3-outline",
  "cf-cloudflare-webassembly-outline",
  "cf-cloudflare-workers-outline",
  "cf-cloudflare-workers-solid",
  "cf-cloudflare-zaraz-outline",
  "cf-cloudflare-zero-trust-outline",
  "cf-cloudflare-zero-trust-solid",
  "cf-cloudy",
  "cf-code-api-outline",
  "cf-code-api-solid",
  "cf-code-brackets-outline",
  "cf-code-branch-outline",
  "cf-code-branch-solid",
  "cf-code-js-outline",
  "cf-code-outline",
  "cf-code-solid",
  "cf-collapse-outline",
  "cf-complexity-outline",
  "cf-comprehensive-outline",
  "cf-connect-1-outline",
  "cf-connect-2-outline",
  "cf-connect-iot-outline",
  "cf-connect-iot-solid",
  "cf-consolidation-outline",
  "cf-continuous-protection-outline",
  "cf-copy-duplicate-outline",
  "cf-copy-duplicate-solid",
  "cf-corner-down-right-outline",
  "cf-culture-outline",
  "cf-customer-service-outline",
  "cf-d1-outline",
  "cf-ddos-attack-outline",
  "cf-ddos-solid",
  "cf-delivery-truck-outline",
  "cf-device-desktop-outline",
  "cf-device-desktop-solid",
  "cf-device-laptop-outline",
  "cf-device-laptop-solid",
  "cf-device-mobile-outline",
  "cf-device-mobile-solid",
  "cf-device-tablet-outline",
  "cf-device-tablet-solid",
  "cf-dex-digital-experience-monitoring-outline",
  "cf-documentation-clipboard-outline",
  "cf-documentation-clipboard-solid",
  "cf-documentation-list-outline",
  "cf-documentation-list-solid",
  "cf-documentation-logs-outline",
  "cf-documentation-logs-solid",
  "cf-documentation-outline",
  "cf-documentation-rules-outline",
  "cf-documentation-rules-solid",
  "cf-documentation-solid",
  "cf-documentation-support-outline",
  "cf-download-outline",
  "cf-downtime-outline",
  "cf-drag-outline",
  "cf-drag-solid",
  "cf-drive-outline",
  "cf-drive-solid",
  "cf-ease-of-use-toggle-outline",
  "cf-ease-of-use-toggle-solid",
  "cf-edge-log-delivery-outline",
  "cf-edge-log-delivery-solid",
  "cf-edit-outline",
  "cf-edit-solid",
  "cf-email-outline",
  "cf-email-solid",
  "cf-exit-outline",
  "cf-expand-outline",
  "cf-eyeball-outline",
  "cf-eyeball-solid",
  "cf-face-happy-outline",
  "cf-face-happy-solid",
  "cf-face-sad-outline",
  "cf-face-sad-solid",
  "cf-filter-drawer-outline",
  "cf-filtering-outline",
  "cf-filtering-solid",
  "cf-fire-outline",
  "cf-firewall-for-ai",
  "cf-folder-outline",
  "cf-funnel-outline",
  "cf-future-proof-outline",
  "cf-garbage-outline",
  "cf-geo-key-manager-outline",
  "cf-geo-key-manager-solid",
  "cf-government-outline",
  "cf-graduation-outline",
  "cf-green-leaf-outline",
  "cf-growth-outline",
  "cf-hamburger-1-outline",
  "cf-hamburger-2-outline",
  "cf-health-check-outline",
  "cf-health-check-solid",
  "cf-help-giving-outline",
  "cf-help-giving-solid",
  "cf-help-question-outline",
  "cf-help-question-solid",
  "cf-hide-eye-outline",
  "cf-home-outline",
  "cf-icard-view-outline",
  "cf-icard-view-solid",
  "cf-image-outline",
  "cf-image-solid",
  "cf-inbox-outline",
  "cf-industry-gaming-outline",
  "cf-industry-gaming-solid",
  "cf-industry-outline",
  "cf-industry-solid",
  "cf-info-outline",
  "cf-info-solid",
  "cf-innovation-intelligence-outline",
  "cf-innovation-intelligence-solid",
  "cf-innovation-thinking-outline",
  "cf-innovation-thinking-solid",
  "cf-internet-browser-outline",
  "cf-internet-browser-solid",
  "cf-internet-globe-outline",
  "cf-internet-globe-solid",
  "cf-ip-truncation-outline",
  "cf-ip-truncation-solid",
  "cf-key-outline",
  "cf-leader-crown-outline",
  "cf-leader-crown-solid",
  "cf-learning-center-book-outline",
  "cf-learning-center-book-solid",
  "cf-lighthouse-outline",
  "cf-link-outline",
  "cf-link-solid",
  "cf-list-view-outline",
  "cf-loading-outline",
  "cf-location-pin-outline",
  "cf-location-pin-solid",
  "cf-logo-1.1.1.1-outline",
  "cf-logo-cloudflare-tv-solid",
  "cf-logo-discord-outline",
  "cf-logo-discord-solid",
  "cf-logo-facebook-solid",
  "cf-logo-github-solid",
  "cf-logo-instagram-outline",
  "cf-logo-instagram-solid",
  "cf-logo-linkedin-outline",
  "cf-logo-linkedin-solid",
  "cf-logo-terraform-solid",
  "cf-logo-twitter-outline",
  "cf-logo-twitter-solid",
  "cf-logo-wechat-outline",
  "cf-logo-wechat-solid",
  "cf-logo-weibo-outline",
  "cf-logo-weibo-solid",
  "cf-logo-youtube-outline",
  "cf-logo-youtube-solid",
  "cf-logo-zhihu-outline",
  "cf-logo-zhihu-solid",
  "cf-machine-learning-contextual-outline",
  "cf-magic-network-monitoring-outline",
  "cf-mcp-server-outline",
  "cf-media-pause-outline",
  "cf-media-pause-solid",
  "cf-media-play-outline",
  "cf-media-play-solid",
  "cf-media-stop-outline",
  "cf-media-stop-solid",
  "cf-more-1-outline",
  "cf-more-1-solid",
  "cf-more-2-outline",
  "cf-network-scale-outline",
  "cf-network-scale-solid",
  "cf-network-virtual-backbone-outline",
  "cf-network-virtual-backbone-solid",
  "cf-no-edit-outline",
  "cf-no-edit-solid",
  "cf-no-security-shield-outline",
  "cf-no-security-shield-solid",
  "cf-no-stop-outline",
  "cf-no-stop-solid",
  "cf-no-stop-x-outline",
  "cf-no-stop-x-solid",
  "cf-notification-announcements-outline",
  "cf-notification-announcements-solid",
  "cf-numeric-1-outline",
  "cf-numeric-1-solid",
  "cf-numeric-100-outline",
  "cf-numeric-2-outline",
  "cf-numeric-2-solid",
  "cf-numeric-3-outline",
  "cf-numeric-3-solid",
  "cf-numeric-add-outline",
  "cf-numeric-add-solid",
  "cf-numeric-minus-outline",
  "cf-numeric-minus-solid",
  "cf-numeric-plus-outline",
  "cf-numeric-subtract-outline",
  "cf-office-branch-outline",
  "cf-office-branch-solid",
  "cf-office-headquarters-outline",
  "cf-office-headquarters-solid",
  "cf-ok-check-outline",
  "cf-open-door-exit-outline",
  "cf-open-door-exit-solid",
  "cf-open-sidepanel-left-outline",
  "cf-open-sidepanel-right-outline",
  "cf-optimization-gear-outline",
  "cf-optimization-gear-solid",
  "cf-optimization-scale-outline",
  "cf-optimization-scale-solid",
  "cf-optimization-web-outline",
  "cf-optimization-web-solid",
  "cf-orbit-outline",
  "cf-organization-outline",
  "cf-overflow-2-solid",
  "cf-overflow-solid",
  "cf-page-shield-outine",
  "cf-page-shield-solid",
  "cf-payments-credit-card-outline",
  "cf-payments-credit-card-solid",
  "cf-performance-1-outline",
  "cf-performance-acceleration-bolt-outline",
  "cf-performance-acceleration-bolt-solid",
  "cf-performance-acceleration-rocket-outline",
  "cf-performance-acceleration-rocket-solid",
  "cf-performance-arrow-up-outline",
  "cf-performance-cloud-speed-outline",
  "cf-performance-cloud-speed-solid",
  "cf-performance-intelligent-routing-outline",
  "cf-performance-intelligent-routing-solid",
  "cf-performance-routing-outline",
  "cf-performance-routing-solid",
  "cf-performance-validator-outline",
  "cf-performance-validator-solid",
  "cf-performance-wrench-outline",
  "cf-performance-wrench-solid",
  "cf-phishing-outline",
  "cf-pin-outline",
  "cf-pin-solid",
  "cf-pipeline-sink-outline",
  "cf-pipeline-stream-outline",
  "cf-platform-apps-outline",
  "cf-platform-apps-solid",
  "cf-podcast-microphone-outline",
  "cf-podcast-microphone-solid",
  "cf-poison-outline",
  "cf-power-outline",
  "cf-power-solid",
  "cf-preemptive-outline",
  "cf-premium-success-offering-outline",
  "cf-premium-success-offering-solid",
  "cf-price-outline",
  "cf-price-solid",
  "cf-printer-outline",
  "cf-printer-solid",
  "cf-process-flow-outline",
  "cf-process-flow-solid",
  "cf-process-stack-outline",
  "cf-pull-request-merged-outline",
  "cf-pull-request-merged-solid",
  "cf-pull-request-outline",
  "cf-pull-request-solid",
  "cf-queues-outline",
  "cf-r2-outline",
  "cf-radar-dish-outline",
  "cf-ransom-ddos-outline",
  "cf-ransomware-attack-outline",
  "cf-ransomware-outline",
  "cf-refactor-outline",
  "cf-refresh-outline",
  "cf-regional-services-outline",
  "cf-regional-services-solid",
  "cf-reliability-dns-outline",
  "cf-reliability-dns-resolver-outline",
  "cf-reliability-dns-resolver-solid",
  "cf-reliability-dns-solid",
  "cf-reliability-load-balancer-outline",
  "cf-reliability-load-balancer-solid",
  "cf-reliability-timer-outline",
  "cf-reliability-timer-solid",
  "cf-remote-work-from-home-outline",
  "cf-replatform-outline",
  "cf-reusable-components-outline",
  "cf-revert-outline",
  "cf-revert-solid",
  "cf-router-outline",
  "cf-router-solid",
  "cf-satellite-outline",
  "cf-satellite-solid",
  "cf-search-outline",
  "cf-secrets-store-outline",
  "cf-security-bots-outline",
  "cf-security-bots-solid",
  "cf-security-crawler-outline",
  "cf-security-crawler-solid",
  "cf-security-fingerprint-privacy-outline",
  "cf-security-lock-outline",
  "cf-security-lock-solid",
  "cf-security-scraping-outline",
  "cf-security-scraping-solid",
  "cf-security-shield-protection-1-outline",
  "cf-security-shield-protection-1-solid",
  "cf-security-shield-protection-2-outline",
  "cf-security-shield-protection-2-solid",
  "cf-security-unlock-outline",
  "cf-security-unlock-solid",
  "cf-security-waf-outline",
  "cf-security-waf-solid",
  "cf-server-1-outline",
  "cf-server-1-solid",
  "cf-server-2-outline",
  "cf-server-2-solid",
  "cf-server-3-outline",
  "cf-server-3-solid",
  "cf-server-database-outline",
  "cf-server-database-solid",
  "cf-server-origin-outline",
  "cf-server-origin-solid",
  "cf-share-arrow-outline",
  "cf-share-outline",
  "cf-share-solid",
  "cf-shop-cart-no-outline",
  "cf-shop-cart-no-solid",
  "cf-shop-cart-outline",
  "cf-shop-cart-solid",
  "cf-slow-snail-outline",
  "cf-sort-outline",
  "cf-spam-email-outline",
  "cf-spam-email-solid",
  "cf-sports-outline",
  "cf-star-outline",
  "cf-star-solid",
  "cf-support-chat-outline",
  "cf-support-chat-solid",
  "cf-table-outline",
  "cf-tag-outline",
  "cf-tag-solid",
  "cf-target-outline",
  "cf-target-retarget-outline",
  "cf-target-retarget-solid",
  "cf-target-solid",
  "cf-thumbs-down-outline",
  "cf-thumbs-down-solid",
  "cf-thumbs-up-outline",
  "cf-thumbs-up-solid",
  "cf-time-outline",
  "cf-time-solid",
  "cf-traffic-attack-browser-outline",
  "cf-traffic-attack-browser-solid",
  "cf-traffic-legit-browser-outline",
  "cf-traffic-legit-browser-solid",
  "cf-trophy-outline",
  "cf-user-add-member-outline",
  "cf-user-add-member-solid",
  "cf-user-multi-outline",
  "cf-user-multi-solid",
  "cf-user-outline",
  "cf-user-solid",
  "cf-vectorize-db-outline",
  "cf-version-outline",
  "cf-video-browser-outline",
  "cf-video-browser-solid",
  "cf-virtual-machine-outline",
  "cf-warning-outline",
  "cf-warning-solid",
  "cf-wheel",
  "cf-workers-constellation-outline",
  "cf-workers-for-platform-outline",
  "cf-workers-pages-outline",
  "cf-wrangler-cli-outline",
  "cf-x-exit-outline",
  "cf-x-solid",
  "cf-yes-check-outline",
  "cf-yes-check-solid",
  "cf-zero-trust-risk-scoring-outline",
] as const;

/**
 * Icon size variants
 */
export type KumoIconSize = "xs" | "sm" | "base" | "lg" | "xl";

/**
 * Props for icon variant configuration
 */
export interface KumoIconVariantsProps {
  size?: KumoIconSize;
}

/**
 * Props for the Icon component
 *
 * Color is controlled via className (e.g., fill-primary, fill-error).
 * Icons use fill-current by default, inheriting from parent text color.
 */
export type IconProps = ComponentProps<"svg"> &
  KumoIconVariantsProps & {
    /**
     * Icon glyph identifier (e.g., "ph-check", "cf-workers")
     */
    glyph: IconGlyph;
    /**
     * Accessible title for the icon (makes it non-decorative)
     */
    title?: string;
  };
