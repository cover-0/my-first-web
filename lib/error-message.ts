/**
 * Supabase, PostgreSQL, 브라우저 네트워크 등에서 발생하는 로우(Raw) 에러를
 * 사용자 친화적인 메시지로 번역하는 유틸리티 함수입니다.
 * 
 * @param error 발생한 에러 객체 (Error, PostgrestError, AuthError 등)
 * @returns 사용자 화면에 노출하기에 안전하고 친근한 메시지
 */
export function getFriendlyErrorMessage(error: any): string {
  if (!error) return "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";

  // 에러 코드와 에러 메시지를 안전하게 추출
  const code = String(error.code || error.status || "").trim();
  const message = String(error.message || error.error_description || "").toLowerCase();

  // 1. 권한 위반 에러 (PostgreSQL Error Code: 42501 - Insufficient Privilege 등)
  if (code === "42501" || message.includes("row-level security") || message.includes("row level security") || message.includes("insufficient privilege")) {
    return "이 작업을 수행할 권한이 없습니다.";
  }

  // 2. 인터넷 단절 및 네트워크 페치 에러
  if (message.includes("failed to fetch") || message.includes("networkerror") || message.includes("network error") || message.includes("typings error") || message.includes("offline")) {
    return "인터넷 연결을 확인해주세요.";
  }

  // 3. 자원 없음 (Not Found 계열 - PGRST116: Single object expected but 0 returned 등)
  if (code === "PGRST116" || message.includes("not found") || message.includes("no rows")) {
    return "요청한 게시글을 찾을 수 없습니다.";
  }

  // 4. Supabase Auth 전용 로그인/회원가입 친화적 메시지 보완
  if (message.includes("invalid login credentials") || message.includes("invalid credentials")) {
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  }
  if (message.includes("email not confirmed")) {
    return "이메일 인증이 완료되지 않았습니다. 메일함을 확인해 주세요.";
  }
  if (message.includes("user already exists") || message.includes("email already registered") || message.includes("already registered")) {
    return "이미 회원가입된 이메일 주소입니다.";
  }
  if (message.includes("password should be at least")) {
    return "비밀번호는 최소 6자리 이상이어야 합니다.";
  }
  if (message.includes("signup disabled") || message.includes("signups are disabled")) {
    return "현재 회원가입이 불가능한 상태입니다. 관리자에게 문의하세요.";
  }

  // 5. 기본값
  return "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
}
