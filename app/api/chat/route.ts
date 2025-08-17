import { NextRequest, NextResponse } from "next/server";
import { withPaymentInterceptor, decodeXPaymentResponse } from "x402-axios";
import axios from "axios";
import { getWalletAccount } from "@/lib/cdp-wallet";

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface ChatCompletionRequest {
  model: string;
  messages: ChatMessage[];
  provider?: 'asi' | 'openrouter';
  stream?: boolean;
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatCompletionRequest = await request.json();
    
    const { messages, model, provider = 'asi', ...options } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required" },
        { status: 400 },
      );
    }

    // Obtener cuenta de wallet CDP
    const account = await getWalletAccount();

    // Determinar la URL base del backend
    const backendBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'https://ethereum-inference-network.vercel.app';

    // Crear instancia axios con interceptor de pago
    const api = withPaymentInterceptor(
      axios.create({
        baseURL: backendBaseUrl,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      // @ts-expect-error CDP account has signing methods but doesn't match viem's SignerWallet type exactly
      account,
    );

    let endpoint: string;
    let requestBody: any;

    if (provider === 'asi') {
      // ASI endpoint expects the path exactly as shown in backend
      endpoint = '/api/asi/chat/completions';
      requestBody = {
        model: model || 'asi1-mini',  // Use correct ASI model name
        messages,
        stream: false,  // ASI API requires stream parameter
        ...options
      };
    } else if (provider === 'openrouter') {
      // OpenRouter uses dynamic route with provider/model in the path
      if (!model || !model.includes('/')) {
        return NextResponse.json(
          { error: "Model must be in format 'provider/model' for OpenRouter" },
          { status: 400 },
        );
      }
      // Split the model into provider and model name for the URL path
      const modelParts = model.split('/');
      const providerName = modelParts[0];
      const modelName = modelParts.slice(1).join('/'); // Handle cases like "meta-llama/llama-2-70b-chat"
      
      endpoint = `/api/open-router/chat-completion/${providerName}/${encodeURIComponent(modelName)}`;
      requestBody = {
        messages,
        ...options
        // Note: backend will add the model field itself
      };
    } else {
      return NextResponse.json(
        { error: "Invalid provider. Use 'asi' or 'openrouter'" },
        { status: 400 },
      );
    }

    // Hacer solicitud a la API del backend
    console.log('Calling backend API:', {
      baseURL: backendBaseUrl,
      endpoint,
      fullURL: `${backendBaseUrl}${endpoint}`,
      requestBody
    });
    const response = await api.post(endpoint, requestBody);

    // Decodificar respuesta de pago si está presente
    let paymentInfo = null;
    const paymentResponseHeader = response.headers["x-payment-response"];
    if (paymentResponseHeader) {
      paymentInfo = decodeXPaymentResponse(paymentResponseHeader);
    }

    return NextResponse.json({
      ...response.data,
      payment: paymentInfo,
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    
    if (axios.isAxiosError(error)) {
      const status = error.response?.status || 500;
      const errorMessage = error.response?.data?.error || error.message;
      return NextResponse.json({ error: errorMessage }, { status });
    }
    
    const errorMessage =
      error instanceof Error ? error.message : "Error processing chat request";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
