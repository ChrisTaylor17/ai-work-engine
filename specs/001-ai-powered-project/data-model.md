# Data Model: AI Work Engine Platform

## Core Entities

### User
```prisma
model User {
  id              String   @id @default(cuid())
  walletAddress   String   @unique
  publicKey       String
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  isOnline        Boolean  @default(false)
  lastSeen        DateTime @default(now())
  
  // Relations
  profile         Profile?
  projectMembers  ProjectMember[]
  contributions   WorkContribution[]
  conversations   Conversation[]
}
```

### Profile
```prisma
model Profile {
  id          String   @id @default(cuid())
  userId      String   @unique
  displayName String?
  bio         String?
  skills      String[] // Array of skill tags
  interests   String[] // Array of interest tags
  experience  String?  // Experience level
  availability String  @default("available") // available, busy, offline
  
  // Relations
  user        User     @relation(fields: [userId], references: [id])
}
```

### Project
```prisma
model Project {
  id              String   @id @default(cuid())
  name            String
  description     String
  tokenMintAddress String  @unique // Solana SPL token mint
  tokenSymbol     String
  totalSupply     BigInt
  status          String   @default("active") // active, completed, dissolved
  createdAt       DateTime @default(now())
  completedAt     DateTime?
  
  // Relations
  members         ProjectMember[]
  contributions   WorkContribution[]
  conversations   Conversation[]
  tokenAllocations TokenAllocation[]
}
```

### ProjectMember
```prisma
model ProjectMember {
  id        String   @id @default(cuid())
  userId    String
  projectId String
  role      String   @default("contributor") // founder, contributor
  joinedAt  DateTime @default(now())
  leftAt    DateTime?
  isActive  Boolean  @default(true)
  
  // Relations
  user      User     @relation(fields: [userId], references: [id])
  project   Project  @relation(fields: [projectId], references: [id])
  
  @@unique([userId, projectId])
}
```

### WorkContribution
```prisma
model WorkContribution {
  id          String   @id @default(cuid())
  userId      String
  projectId   String
  description String
  aiScore     Float?   // AI-evaluated contribution score
  tokenReward BigInt?  // Tokens allocated for this contribution
  createdAt   DateTime @default(now())
  evaluatedAt DateTime?
  
  // Relations
  user        User     @relation(fields: [userId], references: [id])
  project     Project  @relation(fields: [projectId], references: [id])
}
```

### TokenAllocation
```prisma
model TokenAllocation {
  id              String   @id @default(cuid())
  projectId       String
  userId          String
  amount          BigInt
  allocationType  String   // founder, contribution, platform_fee
  transactionHash String?  // Solana transaction hash
  createdAt       DateTime @default(now())
  
  // Relations
  project         Project  @relation(fields: [projectId], references: [id])
}
```

### Conversation
```prisma
model Conversation {
  id        String   @id @default(cuid())
  userId    String?  // null for system/AI messages
  projectId String?  // null for general platform conversations
  message   String
  role      String   // user, assistant, system
  createdAt DateTime @default(now())
  
  // Relations
  user      User?    @relation(fields: [userId], references: [id])
  project   Project? @relation(fields: [projectId], references: [id])
}
```

### AIDecisionLog
```prisma
model AIDecisionLog {
  id            String   @id @default(cuid())
  decisionType  String   // matching, allocation, evaluation
  context       Json     // Decision context and criteria
  result        Json     // Decision outcome
  ipfsHash      String?  // IPFS hash for immutable storage
  blockchainTx  String?  // Solana transaction hash if applicable
  createdAt     DateTime @default(now())
}
```

## Relationships

- **User** has one **Profile** (optional initially)
- **User** can be member of multiple **Projects** via **ProjectMember**
- **Project** has multiple **WorkContributions** from various users
- **Project** has multiple **TokenAllocations** tracking distribution
- **Conversations** can be user-to-platform or project-specific
- **AIDecisionLog** tracks all AI agent decisions for transparency

## Blockchain Data Mapping

### On-Chain (Solana)
- SPL Token mints (one per project)
- Token accounts (user balances)
- Transaction history
- NFT metadata (future feature)

### Off-Chain (PostgreSQL)
- User profiles and preferences
- Conversation history
- AI decision context
- Project metadata and descriptions
- Contribution tracking and scoring

## Validation Rules

- Wallet addresses must be valid Solana public keys
- Token allocations must sum to total supply per project
- Founders must retain minimum 51% allocation (constitutional requirement)
- Platform fees cannot exceed 5% (constitutional limit)
- Users can only be active in one project at a time initially