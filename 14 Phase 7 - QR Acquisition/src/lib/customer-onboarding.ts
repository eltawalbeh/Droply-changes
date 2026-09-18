const KEY = 'droply_customer_onboarding'

export interface CustomerOnboardingDraft {
  qrCode: string
  scanId?: string | null
  phone: string
  fullName: string
  addressText: string
  pin: string
  latitude?: number | null
  longitude?: number | null
  notes?: string | null
}

export function saveOnboardingDraft(draft: CustomerOnboardingDraft) {
  sessionStorage.setItem(KEY, JSON.stringify(draft))
}

export function readOnboardingDraft(): CustomerOnboardingDraft | null {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as CustomerOnboardingDraft) : null
  } catch {
    return null
  }
}

export function clearOnboardingDraft() {
  sessionStorage.removeItem(KEY)
}
