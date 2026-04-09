/**
 * Minimal OpenAI-compatible chat-completions client (fetch).
 * Env: OPENAI_API_KEY (or LLM_API_KEY), OPENAI_BASE_URL (default https://api.openai.com/v1)
 */

export async function chatComplete({
  baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
  apiKey = process.env.OPENAI_API_KEY || process.env.LLM_API_KEY,
  model,
  messages,
  temperature = 0.2,
  maxTokens = 4096,
  responseFormatJson = false,
}) {
  if (!apiKey) {
    throw new Error('Set OPENAI_API_KEY or LLM_API_KEY for eval/evolve tools.');
  }
  const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`;
  const body = {
    model,
    messages,
    temperature,
    max_tokens: maxTokens,
  };
  if (responseFormatJson) {
    body.response_format = { type: 'json_object' };
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`API non-JSON response (${res.status}): ${text.slice(0, 500)}`);
  }
  if (!res.ok) {
    const msg = json?.error?.message || json?.message || text.slice(0, 400);
    throw new Error(`API error ${res.status}: ${msg}`);
  }
  const choice = json.choices?.[0]?.message?.content;
  if (typeof choice !== 'string') {
    throw new Error('Unexpected API response: missing choices[0].message.content');
  }
  return choice.trim();
}
