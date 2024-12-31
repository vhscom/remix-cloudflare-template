import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BotHandler, type BotHandlingOptions } from './handler';

describe('BotHandler', () => {
  let handler: BotHandler;
  const defaultOptions: BotHandlingOptions = {
    waitForContent: true,
    serveSimplifiedContent: false,
    botCacheDuration: 3600,
  };

  beforeEach(() => {
    handler = new BotHandler(defaultOptions);
  });

  describe('handleRequest', () => {
    it('should identify human users correctly', async () => {
      const mockRequest = {
        headers: {
          get: () =>
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      } as unknown as Request;

      const result = await handler.handleRequest(mockRequest);
      expect(result.isBot).toBe(false);
      expect(result.botName).toBeNull();
      expect(result.cacheControl).toBe('no-store');
    });

    it('should identify Googlebot correctly', async () => {
      const mockRequest = {
        headers: {
          get: () =>
            'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        },
      } as unknown as Request;

      const result = await handler.handleRequest(mockRequest);
      expect(result.isBot).toBe(true);
      expect(result.botName).toBe('googlebot');
      expect(result.cacheControl).toContain('public');
      expect(result.cacheControl).toContain('max-age=3600');
      expect(result.cacheControl).toContain('stale-while-revalidate=300');
    });

    it('should handle null user-agent gracefully', async () => {
      const mockRequest = {
        headers: {
          get: () => null,
        },
      } as unknown as Request;

      const result = await handler.handleRequest(mockRequest);
      expect(result.isBot).toBe(false);
      expect(result.botName).toBeNull();
    });

    it('should wait for content when specified', async () => {
      const mockRequest = {
        headers: {
          get: () =>
            'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        },
      } as unknown as Request;

      const mockAllReady = vi.fn().mockResolvedValue(undefined);
      const body = { allReady: mockAllReady() };

      await handler.handleRequest(mockRequest, body);
      expect(mockAllReady).toHaveBeenCalled();
    });
  });

  describe('getSimplifiedContent', () => {
    beforeEach(() => {
      handler = new BotHandler({
        ...defaultOptions,
        serveSimplifiedContent: true,
      });
    });

    it('should remove scripts', () => {
      const input = '<div><script>alert("test")</script>content</div>';
      const output = handler.getSimplifiedContent(input);
      expect(output).toBe('<div>content</div>');
    });

    it('should remove interactive elements', () => {
      const input = '<div><button>Click</button><input type="text"/></div>';
      const output = handler.getSimplifiedContent(input);
      expect(output).toBe('<div></div>');
    });

    it('should remove interactive classes', () => {
      const input =
        '<div class="text-lg hover:underline active:bg-red-500">Text</div>';
      const output = handler.getSimplifiedContent(input);
      expect(output).toBe('<div class="">Text</div>');
    });
  });
});
