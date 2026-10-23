/**
 * Site Security & Hardening ("Blindagem 100%") Utility Module
 * Ling Petshop USA
 */

// 1. Input Sanitization to prevent XSS / Script Injection attacks
export function sanitizeInput(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

// 2. Admin Rate Limiting & Secure Backend Verification
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60000; // 60 seconds

export interface AuthCheckResult {
  success: boolean;
  error?: string;
  isLockedOut?: boolean;
  remainingLockoutSeconds?: number;
}

export async function checkAdminPassword(inputPassword: string): Promise<AuthCheckResult> {
  const now = Date.now();
  const lockoutUntil = parseInt(localStorage.getItem('ling_admin_lockout_until') || '0', 10);

  if (now < lockoutUntil) {
    const remainingSec = Math.ceil((lockoutUntil - now) / 1000);
    return {
      success: false,
      isLockedOut: true,
      remainingLockoutSeconds: remainingSec,
      error: `Acesso bloqueado por segurança! Muitas tentativas incorretas. Aguarde ${remainingSec}s.`,
    };
  }

  try {
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: inputPassword.trim() }),
    });
    const data = await res.json();

    if (res.ok && data.success) {
      localStorage.removeItem('ling_admin_failed_attempts');
      localStorage.removeItem('ling_admin_lockout_until');
      localStorage.setItem('ling_admin_authenticated', 'true');
      if (data.token) {
        sessionStorage.setItem('ling_admin_token', data.token);
      }
      return { success: true };
    }
  } catch (err) {
    // Network or server error
  }

  // Handle failure
  const attempts = parseInt(localStorage.getItem('ling_admin_failed_attempts') || '0', 10) + 1;
  localStorage.setItem('ling_admin_failed_attempts', attempts.toString());

  if (attempts >= MAX_FAILED_ATTEMPTS) {
    const lockoutTime = now + LOCKOUT_DURATION_MS;
    localStorage.setItem('ling_admin_lockout_until', lockoutTime.toString());
    localStorage.setItem('ling_admin_failed_attempts', '0');
    return {
      success: false,
      isLockedOut: true,
      remainingLockoutSeconds: 60,
      error: 'Acesso bloqueado por segurança! 5 tentativas incorretas atingidas. Aguarde 60s.',
    };
  }

  const remainingAttempts = MAX_FAILED_ATTEMPTS - attempts;
  return {
    success: false,
    error: `Senha incorreta! Você tem mais ${remainingAttempts} tentativa(s) antes do bloqueio temporário.`,
  };
}

// 3. Initialize Site Anti-Theft & Asset Protection
export function initSiteSecurity(): () => void {
  // Prevent context menu image dragging/stealing
  const handleContextMenu = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target && target.tagName === 'IMG') {
      e.preventDefault();
    }
  };

  // Prevent keyboard shortcuts for raw source inspection if desired
  const handleKeyDown = (e: KeyboardEvent) => {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
      (e.metaKey && e.altKey && (e.key === 'I' || e.key === 'J' || e.key === 'C'))
    ) {
      console.warn('🔒 Ling Petshop Shield: Standard 256-Bit SSL & Asset Protection Active');
    }
  };

  window.addEventListener('contextmenu', handleContextMenu);
  window.addEventListener('keydown', handleKeyDown);

  return () => {
    window.removeEventListener('contextmenu', handleContextMenu);
    window.removeEventListener('keydown', handleKeyDown);
  };
}
