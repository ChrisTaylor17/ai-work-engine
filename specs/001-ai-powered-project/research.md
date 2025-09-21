# Research: AI Work Engine Platform

## Solana Web3.js Integration Patterns

**Decision**: Use @solana/web3.js v1.87+ with @solana/spl-token for token operations  
**Rationale**: Official Solana libraries provide comprehensive SPL token support and wallet integration  
**Alternatives considered**: Anchor framework (too complex for token-only operations), Solana SDK direct (lower-level than needed)

### Key Implementation Patterns:
- Connection to devnet/mainnet via RPC endpoints
- SPL token mint creation with metadata
- Token account management for users
- Transaction signing with wallet adapters

## OpenAI API Best Practices

**Decision**: OpenAI GPT-4 with conversation memory via PostgreSQL storage  
**Rationale**: GPT-4 provides sophisticated reasoning for team matching and work evaluation  
**Alternatives considered**: Local models (insufficient reasoning capability), Claude API (OpenAI ecosystem integration preferred)

### Implementation Strategy:
- Store conversation history in PostgreSQL with user context
- Use system prompts for consistent AI agent behavior
- Implement decision logging for transparency requirements
- Rate limiting and error handling for API calls

## Wallet Connection Libraries

**Decision**: @solana/wallet-adapter-react with popular wallet support  
**Rationale**: Standard React integration with Phantom, Solflare, and other major wallets  
**Alternatives considered**: Custom wallet integration (reinventing wheel), web3-react (Ethereum-focused)

### Supported Wallets:
- Phantom (primary target)
- Solflare
- Backpack
- Glow

## Real-time Matching Algorithms

**Decision**: Skill vector similarity with availability weighting  
**Rationale**: Combines quantitative skill matching with real-time availability  
**Alternatives considered**: Random matching (poor user experience), manual selection (defeats AI purpose)

### Algorithm Components:
- Skill tags converted to vectors
- Cosine similarity for skill matching
- Availability status as binary filter
- Interest overlap scoring

## Token Economics Models

**Decision**: Contribution-weighted allocation with founder majority  
**Rationale**: Balances founder control with contributor incentives per constitution  
**Alternatives considered**: Equal distribution (unfair to founders), pure meritocracy (hard to measure objectively)

### Allocation Formula:
- Founders: 51% minimum (constitutional requirement)
- Contributors: 44% based on AI-evaluated contributions
- Platform: 5% maximum fee (constitutional limit)

## IPFS Integration

**Decision**: Pinata IPFS service for AI decision log storage  
**Rationale**: Reliable pinning service with simple API integration  
**Alternatives considered**: Self-hosted IPFS (operational complexity), Arweave (different consensus model)

### Storage Pattern:
- AI decisions stored as JSON on IPFS
- IPFS hash recorded on Solana blockchain
- Immutable audit trail for transparency