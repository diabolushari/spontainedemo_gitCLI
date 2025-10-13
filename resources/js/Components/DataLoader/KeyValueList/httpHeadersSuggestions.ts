export interface HttpHeaderSuggestion {
  key: string
  description: string
  commonValues: string[]
}

const EXAMPLE_URL = 'https://example.com'
const EXAMPLE_IP = '192.168.1.1'
const EXAMPLE_IP_2 = '203.0.113.195'
const EXAMPLE_DATE = 'Wed, 21 Oct 2015 07:28:00 GMT'

export const commonHttpHeaders: HttpHeaderSuggestion[] = [
  {
    key: 'Authorization',
    description: 'Authentication credentials',
    commonValues: [
      'Bearer YOUR_API_KEY',
      'Basic base64_encoded_credentials',
      'API-Key YOUR_API_KEY',
      'Token YOUR_TOKEN',
    ],
  },
  {
    key: 'Content-Type',
    description: 'Media type of the resource',
    commonValues: [
      'application/json',
      'application/xml',
      'application/x-www-form-urlencoded',
      'text/plain',
      'text/html',
      'multipart/form-data',
    ],
  },
  {
    key: 'Accept',
    description: 'Media types that are acceptable for the response',
    commonValues: ['application/json', 'application/xml', 'text/plain', 'text/html', '*/*'],
  },
  {
    key: 'User-Agent',
    description: 'User agent string of the application',
    commonValues: [
      'KSEB-Analytics/1.0',
      'Mozilla/5.0 (compatible; DataLoader/1.0)',
      'API-Client/1.0',
    ],
  },
  {
    key: 'X-API-Key',
    description: 'Custom API key header',
    commonValues: ['YOUR_API_KEY'],
  },
  {
    key: 'X-RapidAPI-Key',
    description: 'RapidAPI authentication key',
    commonValues: ['YOUR_RAPIDAPI_KEY'],
  },
  {
    key: 'X-RapidAPI-Host',
    description: 'RapidAPI host header',
    commonValues: ['api.example.com'],
  },
  {
    key: 'Accept-Encoding',
    description: 'List of acceptable encodings',
    commonValues: ['gzip, deflate', 'gzip', 'deflate', 'br'],
  },
  {
    key: 'Cache-Control',
    description: 'Caching directives',
    commonValues: ['no-cache', 'no-store', 'max-age=3600', 'public', 'private'],
  },
  {
    key: 'X-Requested-With',
    description: 'Identifies the request as AJAX',
    commonValues: ['XMLHttpRequest'],
  },
  {
    key: 'Referer',
    description: 'URL of the referring page',
    commonValues: [EXAMPLE_URL],
  },
  {
    key: 'Origin',
    description: 'Origin of the request',
    commonValues: [EXAMPLE_URL],
  },
  {
    key: 'Access-Control-Allow-Origin',
    description: 'CORS header for allowed origins',
    commonValues: ['*', EXAMPLE_URL],
  },
  {
    key: 'X-Forwarded-For',
    description: 'Client IP address when behind proxy',
    commonValues: [EXAMPLE_IP, EXAMPLE_IP_2],
  },
  {
    key: 'X-Real-IP',
    description: 'Real client IP address',
    commonValues: [EXAMPLE_IP, EXAMPLE_IP_2],
  },
  {
    key: 'If-Modified-Since',
    description: 'Conditional request header',
    commonValues: [EXAMPLE_DATE],
  },
  {
    key: 'If-None-Match',
    description: 'Conditional request header for ETags',
    commonValues: ['"686897696a7c876b7e"'],
  },
  {
    key: 'Connection',
    description: 'Connection management',
    commonValues: ['keep-alive', 'close'],
  },
  {
    key: 'Pragma',
    description: 'Implementation-specific directives',
    commonValues: ['no-cache'],
  },
  {
    key: 'X-CSRF-Token',
    description: 'CSRF protection token',
    commonValues: ['YOUR_CSRF_TOKEN'],
  },
  {
    key: 'Content-Length',
    description: 'Size of the request body in bytes',
    commonValues: ['0', '1024', '2048'],
  },
  {
    key: 'Content-Encoding',
    description: 'Encoding transformations applied to the entity-body',
    commonValues: ['gzip', 'deflate', 'br', 'compress'],
  },
  {
    key: 'Accept-Language',
    description: 'Preferred languages for the response',
    commonValues: ['en-US,en;q=0.9', 'en-GB,en;q=0.8', 'fr-FR,fr;q=0.9', '*'],
  },
  {
    key: 'Accept-Charset',
    description: 'Character sets that are acceptable',
    commonValues: ['utf-8', 'iso-8859-1', 'utf-8,iso-8859-1;q=0.8'],
  },
  {
    key: 'Cookie',
    description: 'HTTP cookies previously sent by the server',
    commonValues: ['sessionid=abc123; csrftoken=xyz789'],
  },
  {
    key: 'Set-Cookie',
    description: 'Send cookies from server to client',
    commonValues: ['sessionid=abc123; Path=/; HttpOnly', 'csrftoken=xyz789; Secure'],
  },
  {
    key: 'Location',
    description: 'URL to redirect a page to',
    commonValues: [EXAMPLE_URL, '/redirect-path'],
  },
  {
    key: 'Host',
    description: 'Domain name of the server',
    commonValues: ['api.example.com', 'localhost:3000', 'example.com'],
  },
  {
    key: 'Range',
    description: 'Request only part of an entity',
    commonValues: ['bytes=0-1023', 'bytes=1024-2047', 'bytes=0-'],
  },
  {
    key: 'Content-Range',
    description: 'Where in a full body message this partial message belongs',
    commonValues: ['bytes 0-1023/2048', 'bytes 1024-2047/2048'],
  },
  {
    key: 'ETag',
    description: 'Identifier for a specific version of a resource',
    commonValues: ['"686897696a7c876b7e"', 'W/"686897696a7c876b7e"'],
  },
  {
    key: 'Last-Modified',
    description: 'Date and time the resource was last modified',
    commonValues: [EXAMPLE_DATE],
  },
  {
    key: 'Expires',
    description: 'Date/time after which the response is considered stale',
    commonValues: [EXAMPLE_DATE, 'Thu, 01 Dec 1994 16:00:00 GMT'],
  },
  {
    key: 'Retry-After',
    description: 'How long to wait before making a follow-up request',
    commonValues: ['120', '3600', EXAMPLE_DATE],
  },
  {
    key: 'Server',
    description: 'Information about the server software',
    commonValues: ['nginx/1.18.0', 'Apache/2.4.41', 'Express.js'],
  },
  {
    key: 'Vary',
    description: 'Determines how to match future request headers',
    commonValues: ['Accept-Encoding', 'User-Agent', 'Accept-Language', '*'],
  },
  {
    key: 'WWW-Authenticate',
    description: 'Authentication method that should be used',
    commonValues: ['Basic realm="Access to API"', 'Bearer realm="API"'],
  },
  {
    key: 'Transfer-Encoding',
    description: 'Form of encoding used to transfer the entity',
    commonValues: ['chunked', 'compress', 'deflate', 'gzip'],
  },
  {
    key: 'X-Frame-Options',
    description: 'Controls whether page can be displayed in a frame',
    commonValues: ['DENY', 'SAMEORIGIN', 'ALLOW-FROM https://example.com'],
  },
  {
    key: 'X-Content-Type-Options',
    description: 'Prevents MIME type sniffing',
    commonValues: ['nosniff'],
  },
  {
    key: 'X-XSS-Protection',
    description: 'Cross-site scripting filter',
    commonValues: ['1; mode=block', '0', '1'],
  },
  {
    key: 'Strict-Transport-Security',
    description: 'HTTPS enforcement policy',
    commonValues: ['max-age=31536000', 'max-age=31536000; includeSubDomains'],
  },
  {
    key: 'Content-Security-Policy',
    description: 'Controls resources the user agent is allowed to load',
    commonValues: ["default-src 'self'", "script-src 'self' 'unsafe-inline'"],
  },
  {
    key: 'Access-Control-Allow-Methods',
    description: 'CORS allowed HTTP methods',
    commonValues: ['GET, POST, PUT, DELETE', 'GET, POST', '*'],
  },
  {
    key: 'Access-Control-Allow-Headers',
    description: 'CORS allowed request headers',
    commonValues: ['Content-Type, Authorization', 'X-Requested-With', '*'],
  },
  {
    key: 'Access-Control-Max-Age',
    description: 'CORS preflight cache duration',
    commonValues: ['3600', '86400', '1728000'],
  },
]

// Helper function to get header suggestions based on partial input
export const getHeaderKeySuggestions = (input: string): HttpHeaderSuggestion[] => {
  if (!input.trim()) {
    return commonHttpHeaders.slice(0, 8) // Show top 8 most common headers when no input
  }

  const lowercaseInput = input.toLowerCase()
  return commonHttpHeaders.filter(
    (header) =>
      header.key.toLowerCase().includes(lowercaseInput) ||
      header.description.toLowerCase().includes(lowercaseInput)
  )
}

// Helper function to get value suggestions for a specific header key
export const getHeaderValueSuggestions = (headerKey: string): string[] => {
  const header = commonHttpHeaders.find((h) => h.key.toLowerCase() === headerKey.toLowerCase())
  return header?.commonValues || []
}
