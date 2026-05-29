import { test, expect } from '@playwright/test';

test.describe('Auth and CRUD Validation', () => {

  test('행복 경로(Happy Path): 로그인 후 새 글 작성 및 목록 확인', async ({ page }) => {
    // 💡 여러 브라우저가 동시에 테스트를 돌릴 때 충돌하지 않도록 test 에 uniqueTitle 넣기
    const uniqueTitle = `Playwright Test Post - ${Date.now()}`;

    // 1. /login에서 환경변수를 사용해 로그인
    const email = process.env.TEST_EMAIL;
    const password = process.env.TEST_PASSWORD;

    if (!email || !password) {
      console.warn('⚠️ 테스트 환경변수(TEST_EMAIL, TEST_PASSWORD)가 누락되어 테스트를 스킵합니다.');
      test.skip();
    }

    await page.goto('/login');
    
    // getByLabel을 사용하여 입력 폼 선택 (한국어/영어 대응)
    await page.getByLabel(/이메일|Email/i).fill(email as string);
    await page.getByLabel(/비밀번호|Password/i).fill(password as string);
    
    // 버튼 클릭 대신 엔터키를 눌러서 폼을 제출하는 것이 호환성이 가장 좋습니다.
    await page.getByLabel(/비밀번호|Password/i).press('Enter');

    // 로그인 완료 후 목록(/posts)으로 이동할 때까지 대기
    await page.waitForURL('**/posts');

    // 2. 새 글 작성 페이지 접속 및 폼 제출
    await page.goto('/posts/new');
    
    await page.getByLabel(/제목|Title/i).fill(uniqueTitle);
    await page.getByLabel(/내용|Content/i).fill('이 글은 Playwright E2E 테스트가 자동으로 작성한 글입니다.');
    
    // alert(경고창)이 뜨면 자동으로 확인(OK)을 누르도록 설정! (클릭하기 전에 미리 선언해야 합니다!)
    page.on('dialog', dialog => dialog.accept());

    await page.getByRole('button', { name: /저장|작성|Submit/i }).click();

    // 🚨 현재 프로젝트 동작에 맞춰, 목록('/posts')이든 상세페이지('/posts/아이디')든
    // 'posts'가 포함된 경로로 넘어가면 대기를 종료하도록 유연하게 허용합니다.
    await page.waitForURL(/\/posts/);
    
    // 방금 작성한 고유한 제목이 화면에 hiển thị 되는지 검증
    await expect(page.getByText(uniqueTitle).first()).toBeVisible();
  });

  test('거절 경로(Rejection Path): 비로그인 사용자의 보호된 라우트 접근 차단', async ({ page }) => {
    // 테스트는 독립된 새 브라우저 컨텍스트에서 실행되므로 기본적으로 로그아웃된(비인가) 상태입니다.
    
    // 2. /posts/new 페이지에 억지로 접속 시도
    await page.goto('/posts/new');

    // 3. 미들웨어 또는 보호 라우팅 로직에 의해 /login으로 튕겨나가는지 검증
    await page.waitForURL('**/login*');
    await expect(page).toHaveURL(/.*\/login/);
  });
});
