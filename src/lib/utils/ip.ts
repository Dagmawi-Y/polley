import { NextRequest } from 'next/server'

export function getClientIP(request: NextRequest): string {
  // Try to get IP from various headers
  const forwardedFor = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const cfConnectingIp = request.headers.get('cf-connecting-ip')
  
  // x-forwarded-for can contain multiple IPs, take the first one
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map(ip => ip.trim())
    return ips[0]
  }
  
  // Try other headers
  if (cfConnectingIp) return cfConnectingIp
  if (realIp) return realIp
  
  // Fallback to connection remote address (may not work in all environments)
  return request.ip || 'unknown'
}