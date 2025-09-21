# Tasks: AI Work Engine Platform

**Input**: Design documents from `/specs/001-ai-powered-project/`
**Prerequisites**: plan.md, research.md, data-model.md, contracts/

## Phase 3.1: Setup
- [ ] T001 Create project structure with backend/ and frontend/ directories
- [ ] T002 Initialize Node.js backend with Express, TypeScript, Prisma dependencies
- [ ] T003 [P] Initialize Next.js frontend with React, TypeScript, Tailwind CSS
- [ ] T004 [P] Configure ESLint, Prettier for both backend and frontend
- [ ] T005 Setup Prisma with PostgreSQL connection and initial schema
- [ ] T006 [P] Configure Solana Test Validator for development environment

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3
**CRITICAL: These tests MUST be written and MUST FAIL before ANY implementation**
- [ ] T007 [P] Contract test POST /api/auth/wallet in backend/tests/contract/test_auth_wallet.test.ts
- [ ] T008 [P] Contract test GET /api/auth/verify in backend/tests/contract/test_auth_verify.test.ts
- [ ] T009 [P] Contract test POST /api/projects in backend/tests/contract/test_projects_create.test.ts
- [ ] T010 [P] Contract test GET /api/projects in backend/tests/contract/test_projects_list.test.ts
- [ ] T011 [P] Contract test POST /api/projects/{id}/contributions in backend/tests/contract/test_contributions.test.ts
- [ ] T012 [P] Contract test POST /api/ai/chat in backend/tests/contract/test_ai_chat.test.ts
- [ ] T013 [P] Contract test POST /api/ai/match in backend/tests/contract/test_ai_match.test.ts
- [ ] T014 [P] Contract test POST /api/ai/evaluate in backend/tests/contract/test_ai_evaluate.test.ts
- [ ] T015 [P] Integration test wallet connection flow in backend/tests/integration/test_wallet_auth.test.ts
- [ ] T016 [P] Integration test project formation with AI matching in backend/tests/integration/test_project_formation.test.ts
- [ ] T017 [P] Integration test token creation and allocation in backend/tests/integration/test_token_operations.test.ts
- [ ] T018 [P] Integration test work contribution and evaluation in backend/tests/integration/test_contribution_flow.test.ts

## Phase 3.3: Core Implementation (ONLY after tests are failing)
- [ ] T019 [P] User model in backend/src/models/user.ts (Prisma schema)
- [ ] T020 [P] Profile model in backend/src/models/profile.ts (Prisma schema)
- [ ] T021 [P] Project model in backend/src/models/project.ts (Prisma schema)
- [ ] T022 [P] ProjectMember model in backend/src/models/projectMember.ts (Prisma schema)
- [ ] T023 [P] WorkContribution model in backend/src/models/workContribution.ts (Prisma schema)
- [ ] T024 [P] TokenAllocation model in backend/src/models/tokenAllocation.ts (Prisma schema)
- [ ] T025 [P] Conversation model in backend/src/models/conversation.ts (Prisma schema)
- [ ] T026 [P] AIDecisionLog model in backend/src/models/aiDecisionLog.ts (Prisma schema)
- [ ] T027 Wallet authentication service in backend/src/services/walletAuth.ts
- [ ] T028 Solana blockchain service in backend/src/services/blockchain.ts
- [ ] T029 OpenAI integration service in backend/src/services/aiAgent.ts
- [ ] T030 User matching service in backend/src/services/matching.ts
- [ ] T031 Token management service in backend/src/services/tokenManager.ts
- [ ] T032 IPFS service for decision logs in backend/src/services/ipfs.ts

## Phase 3.4: API Endpoints
- [ ] T033 POST /api/auth/wallet endpoint in backend/src/api/auth.ts
- [ ] T034 GET /api/auth/verify endpoint in backend/src/api/auth.ts
- [ ] T035 POST /api/projects endpoint in backend/src/api/projects.ts
- [ ] T036 GET /api/projects endpoint in backend/src/api/projects.ts
- [ ] T037 GET /api/projects/{id}/tokens endpoint in backend/src/api/projects.ts
- [ ] T038 POST /api/projects/{id}/contributions endpoint in backend/src/api/projects.ts
- [ ] T039 POST /api/ai/chat endpoint in backend/src/api/ai.ts
- [ ] T040 POST /api/ai/match endpoint in backend/src/api/ai.ts
- [ ] T041 POST /api/ai/evaluate endpoint in backend/src/api/ai.ts

## Phase 3.5: Frontend Components
- [ ] T042 [P] Wallet connection component in frontend/src/components/WalletConnect.tsx
- [ ] T043 [P] Profile setup component in frontend/src/components/ProfileSetup.tsx
- [ ] T044 [P] Project dashboard component in frontend/src/components/ProjectDashboard.tsx
- [ ] T045 [P] AI chat interface component in frontend/src/components/AIChat.tsx
- [ ] T046 [P] Token balance display component in frontend/src/components/TokenBalance.tsx
- [ ] T047 Home page in frontend/src/pages/index.tsx
- [ ] T048 Profile page in frontend/src/pages/profile.tsx
- [ ] T049 Projects page in frontend/src/pages/projects.tsx
- [ ] T050 Project detail page in frontend/src/pages/projects/[id].tsx

## Phase 3.6: Integration & Middleware
- [ ] T051 JWT authentication middleware in backend/src/lib/auth.ts
- [ ] T052 Error handling middleware in backend/src/lib/errorHandler.ts
- [ ] T053 Request logging middleware in backend/src/lib/logger.ts
- [ ] T054 CORS configuration in backend/src/lib/cors.ts
- [ ] T055 Database connection setup in backend/src/lib/database.ts
- [ ] T056 Solana network configuration in backend/src/lib/solana.ts

## Phase 3.7: Polish
- [ ] T057 [P] Unit tests for wallet auth service in backend/tests/unit/test_wallet_auth.test.ts
- [ ] T058 [P] Unit tests for AI matching logic in backend/tests/unit/test_matching.test.ts
- [ ] T059 [P] Unit tests for token allocation in backend/tests/unit/test_token_allocation.test.ts
- [ ] T060 [P] Frontend component tests in frontend/tests/components/
- [ ] T061 [P] Performance optimization for API responses (<500ms target)
- [ ] T062 [P] Update API documentation in docs/api.md
- [ ] T063 [P] Create deployment configuration (Docker, environment variables)
- [ ] T064 Run quickstart.md validation scenarios
- [ ] T065 Security audit and vulnerability assessment

## Dependencies
- Setup (T001-T006) before all other phases
- Tests (T007-T018) before implementation (T019-T041)
- Models (T019-T026) before services (T027-T032)
- Services before API endpoints (T033-T041)
- Backend API before frontend components (T042-T050)
- Core implementation before integration (T051-T056)
- Everything before polish (T057-T065)

## Parallel Example
```
# Launch T007-T014 together (contract tests):
Task: "Contract test POST /api/auth/wallet in backend/tests/contract/test_auth_wallet.test.ts"
Task: "Contract test GET /api/auth/verify in backend/tests/contract/test_auth_verify.test.ts"
Task: "Contract test POST /api/projects in backend/tests/contract/test_projects_create.test.ts"
Task: "Contract test POST /api/ai/chat in backend/tests/contract/test_ai_chat.test.ts"

# Launch T019-T026 together (Prisma models):
Task: "User model in backend/src/models/user.ts (Prisma schema)"
Task: "Profile model in backend/src/models/profile.ts (Prisma schema)"
Task: "Project model in backend/src/models/project.ts (Prisma schema)"
Task: "WorkContribution model in backend/src/models/workContribution.ts (Prisma schema)"
```

## Notes
- [P] tasks = different files, no dependencies
- Verify tests fail before implementing
- Commit after each task completion
- Use Solana devnet for all blockchain operations
- OpenAI API key required for AI agent functionality

## Validation Checklist
*GATE: Checked before task execution*

- [x] All contracts have corresponding tests (T007-T014)
- [x] All entities have model tasks (T019-T026)
- [x] All tests come before implementation (TDD enforced)
- [x] Parallel tasks truly independent ([P] marked correctly)
- [x] Each task specifies exact file path
- [x] No task modifies same file as another [P] task