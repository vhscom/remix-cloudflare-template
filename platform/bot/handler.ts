import { isbot } from 'isbot';

export interface BotHandlingOptions {
  waitForContent?: boolean;
  botHeaders?: Record<string, string>;
  serveSimplifiedContent?: boolean;
  botSpecificHandlers?: Record<string, (ua: string) => Promise<void>>;
  botCacheDuration?: number;
}

export interface BotDetectionResult {
  isBot: boolean;
  botName: string | null;
  simplifiedContent: boolean;
  cacheControl: string | null;
}

// Cloudflare-specific cache configuration
const DEFAULT_BOT_CACHE = {
  browserTTL: 0,
  edgeTTL: 60 * 60, // 1 hour
  staleWhileRevalidate: 60 * 5, // 5 minutes
};

export class BotHandler {
  private options: BotHandlingOptions;
  private botPatterns: Record<string, RegExp> = {
    /**
     * Pattern to specifically identify official Googlebot crawlers.
     * Any additional patterns can be added here for bots that need special handling.
     * General bot detection is handled by isbot.
     */
    googlebot: /(compatible;\s*Googlebot\/|Googlebot-\w+;)/i,
  };

  constructor(options: BotHandlingOptions = {}) {
    this.options = {
      waitForContent: true,
      serveSimplifiedContent: false,
      botCacheDuration: DEFAULT_BOT_CACHE.edgeTTL,
      ...options,
    };
  }

  private isBotUserAgent(userAgent: string): boolean {
    const isbotResult = isbot(userAgent);

    // Check our patterns
    for (const [name, pattern] of Object.entries(this.botPatterns)) {
      if (pattern.test(userAgent)) {
        return true;
      }
    }

    return isbotResult;
  }

  private getBotName(userAgent: string): string | null {
    for (const [name, pattern] of Object.entries(this.botPatterns)) {
      if (pattern.test(userAgent)) {
        return name;
      }
    }

    return this.isBotUserAgent(userAgent) ? 'unknown' : null;
  }

  private getCacheControl(botName: string | null): string {
    if (!botName || !this.options.botCacheDuration) {
      return 'no-store';
    }

    const { edgeTTL, staleWhileRevalidate } = DEFAULT_BOT_CACHE;
    return `public, max-age=${edgeTTL}, stale-while-revalidate=${staleWhileRevalidate}`;
  }

  async handleRequest(
    request: Request,
    body?: { allReady?: Promise<void> },
  ): Promise<BotDetectionResult> {
    const userAgent = request.headers.get('user-agent') || '';
    const isItBot = this.isBotUserAgent(userAgent);

    if (!isItBot) {
      return {
        isBot: false,
        botName: null,
        simplifiedContent: false,
        cacheControl: 'no-store',
      };
    }

    const botName = this.getBotName(userAgent);

    // Wait for content if specified
    if (this.options.waitForContent && body?.allReady) {
      await body.allReady;
    }

    // Run bot-specific handlers if they exist
    if (botName && this.options.botSpecificHandlers?.[botName]) {
      await this.options.botSpecificHandlers[botName](userAgent);
    }

    return {
      isBot: true,
      botName,
      simplifiedContent: Boolean(this.options.serveSimplifiedContent),
      cacheControl: this.getCacheControl(botName),
    };
  }

  getSimplifiedContent(fullContent: string): string {
    if (!this.options.serveSimplifiedContent) {
      return fullContent;
    }

    // Remove client-side scripts
    let simplified = fullContent.replace(
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      '',
    );

    // Remove interactive elements
    simplified = simplified.replace(
      /<button\b[^<]*(?:(?!<\/button>)<[^<]*)*<\/button>/gi,
      '',
    );
    simplified = simplified.replace(/<input[^>]*>/gi, '');

    // Remove CSS classes related to interactivity
    simplified = simplified.replace(
      /class="[^"]*(?:hover|active|focus)[^"]*"/gi,
      'class=""',
    );

    return simplified;
  }
}
