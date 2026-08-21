import { NextRequest, NextResponse } from 'next/server';

const OCR_API_BASE_URL =
  process.env.OCR_API_BASE_URL || 'https://ocr-api-ua2v.onrender.com';

export const maxDuration = 60; // Allow sufficient time for Render free-tier cold starts

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const docType = formData.get('docType') as string | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file was provided in the request.' },
        { status: 400 }
      );
    }

    // Build the outbound multipart form data for the FastAPI backend
    const outboundFormData = new FormData();
    outboundFormData.append('file', file, file.name || 'document.pdf');

    const targetUrl = `${OCR_API_BASE_URL.replace(/\/+$/, '')}/ocr`;

    // 90 second timeout to accommodate cold starts on Render
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000);

    let upstreamResponse: Response;
    try {
      upstreamResponse = await fetch(targetUrl, {
        method: 'POST',
        body: outboundFormData,
        signal: controller.signal,
      });
    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);
      const isAbort =
        fetchError instanceof Error && fetchError.name === 'AbortError';
      return NextResponse.json(
        {
          success: false,
          error: isAbort
            ? 'The OCR service timed out while starting up on Render. Please retry in a few moments.'
            : `Failed to connect to OCR server at ${targetUrl}: ${
                fetchError instanceof Error ? fetchError.message : 'Unknown network error'
              }`,
        },
        { status: 504 }
      );
    } finally {
      clearTimeout(timeoutId);
    }

    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text();
      let errorDetail = errorText;
      try {
        const parsed = JSON.parse(errorText);
        if (parsed.detail) {
          errorDetail = typeof parsed.detail === 'string' ? parsed.detail : JSON.stringify(parsed.detail);
        }
      } catch {
        // use raw text
      }

      return NextResponse.json(
        {
          success: false,
          error: `OCR API error (${upstreamResponse.status}): ${errorDetail}`,
          statusCode: upstreamResponse.status,
        },
        { status: upstreamResponse.status }
      );
    }

    const data = await upstreamResponse.json();

    return NextResponse.json({
      success: true,
      filename: data.filename || file.name,
      status: data.status || 'success',
      content: data.content || '',
      docType: docType || undefined,
    });
  } catch (err: unknown) {
    console.error('OCR Proxy Route Error:', err);
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Internal server error while processing OCR.',
      },
      { status: 500 }
    );
  }
}
