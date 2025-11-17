import { NextResponse } from 'next/server';

export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  OPENAI_API_ERROR = 'OPENAI_API_ERROR',
  IMAGE_PROCESSING_ERROR = 'IMAGE_PROCESSING_ERROR',
  MODERATION_ERROR = 'MODERATION_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST'
}

export interface APIError {
  code: ErrorCode;
  message: string;
  details?: unknown;
  timestamp: string;
  requestId?: string;
}

export class APIErrorHandler {
  static handle(error: unknown, requestId?: string): NextResponse {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    console.error('API Error:', {
      error: errorMessage,
      stack: errorStack,
      requestId,
      timestamp: new Date().toISOString()
    });

    // Rate limiting errors
    if (errorMessage.includes('Rate limit exceeded')) {
      return NextResponse.json(
        this.createErrorResponse(
          ErrorCode.RATE_LIMIT_EXCEEDED,
          'レート制限に達しました。しばらくしてから再度お試しください。',
          { retryAfter: 60 },
          requestId
        ),
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    // OpenAI API errors
    if (errorMessage.includes('OpenAI') || errorMessage.includes('API')) {
      return NextResponse.json(
        this.createErrorResponse(
          ErrorCode.OPENAI_API_ERROR,
          'AIサービスが一時的に利用できません。しばらくしてから再度お試しください。',
          { originalError: errorMessage },
          requestId
        ),
        { status: 503 }
      );
    }

    // Image processing errors
    if (errorMessage.includes('image') || errorMessage.includes('vision')) {
      return NextResponse.json(
        this.createErrorResponse(
          ErrorCode.IMAGE_PROCESSING_ERROR,
          '画像処理に失敗しました。画像を確認してから再度お試しください。',
          { originalError: errorMessage },
          requestId
        ),
        { status: 400 }
      );
    }

    // Moderation errors
    if (errorMessage.includes('moderation') || errorMessage.includes('content')) {
      return NextResponse.json(
        this.createErrorResponse(
          ErrorCode.MODERATION_ERROR,
          'コンテンツモデレーションに失敗しました。しばらくしてから再度お試しください。',
          { originalError: errorMessage },
          requestId
        ),
        { status: 500 }
      );
    }

    // Validation errors
    if (errorMessage.includes('required') || errorMessage.includes('invalid')) {
      return NextResponse.json(
        this.createErrorResponse(
          ErrorCode.VALIDATION_ERROR,
          errorMessage,
          { originalError: errorMessage },
          requestId
        ),
        { status: 400 }
      );
    }

    // Default internal server error
    return NextResponse.json(
      this.createErrorResponse(
        ErrorCode.INTERNAL_SERVER_ERROR,
        '内部サーバーエラーが発生しました。しばらくしてから再度お試しください。',
        { originalError: errorMessage },
        requestId
      ),
      { status: 500 }
    );
  }

  static createErrorResponse(
    code: ErrorCode,
    message: string,
    details?: unknown,
    requestId?: string
  ): APIError {
    return {
      code,
      message,
      details,
      timestamp: new Date().toISOString(),
      requestId
    };
  }

  static validateRequest(body: unknown, requiredFields: string[]): void {
    if (typeof body !== 'object' || body === null) {
      throw new Error('Request body must be an object');
    }
    
    for (const field of requiredFields) {
      if (!(body as Record<string, unknown>)[field]) {
        throw new Error(`${field} is required`);
      }
    }
  }

  static validateImageUrl(url: string): void {
    try {
      new URL(url);
    } catch {
      throw new Error('Invalid image URL format');
    }
  }

  static validateContentLength(content: string, maxLength: number = 32000): void {
    if (content.length > maxLength) {
      throw new Error(`Content too long. Maximum ${maxLength} characters allowed.`);
    }
  }
}

export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
