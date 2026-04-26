# 000-mvp-web3.md

# **MVP Proposal: “Proof of Skill” — A Trustless Skill Verification Network**

## **Executive Summary**
Proof of Skill is a Web3 platform that allows individuals to verify real-world skills through independently validated proofs written to a blockchain. It gives organisations, communities, and individuals a way to certify abilities without relying on centralised institutions. This bridges the trust gap in freelance work, hiring, and community participation by providing verifiable, tamper-proof skill attestations.

## **Problem Statement**
Traditional skill validation relies on institutions, CVs, or subjective references, all of which can be manipulated or forged. There is no global, interoperable, tamper-proof way to validate that someone genuinely possesses a specific skill. This is particularly problematic for freelancers, contributors in decentralised communities, and people in regions where credentials are difficult to obtain or verify.

## **Target Audience**
- Freelancers who need trustless, verifiable proof of ability  
- Employers and clients who want reliable, fraud-resistant validation  
- Online communities, DAOs, and guilds that rely on contributor reputation  
- Students and professionals without traditional credentials  
- Web2 users who can onboard seamlessly without previous crypto experience  

## **Unique Value Proposition & Market Differentiation**
- Verifiable skill proofs backed by independent validators  
- Fraud-resistant, tamper-proof skill attestations stored on-chain  
- Built on a high-speed chain allowing gasless UX for non-crypto users  
- Onboarding doesn’t require wallets — users can authenticate with email and claim a self-custodial wallet later  
- Goes beyond simple NFTs or badges by linking proofs to verifiable evidence and validator reputation  

## **Core MVP Features**
1. **Skill Claim Creation**  
   Users submit a claim about a skill (e.g., “JavaScript development”, “Video editing”, “Carpentry”).  
2. **Evidence Upload**  
   Users provide supporting evidence (portfolio links, videos, code repos, etc.), stored off-chain with a hash recorded on-chain.  
3. **Validator Verification**  
   Independent validators review submissions and stake reputation to approve or reject claims.  
4. **On-Chain Attestation**  
   Approved skills are published as verifiable attestations with metadata (skill type, issuer, timestamp).  
5. **Public Verification Page**  
   A shareable profile exposing a user’s verified skills for clients, employers, or communities.  

## **Technical Stack**
- **Frontend:** React Native + Expo  
- **Backend:** Node.js + Serverless functions (Fastify or Next API routes)  
- **Storage:**  
  - IPFS or web3.storage for evidence  
  - Postgres for app state and analytics  
- **Blockchain:** **Solana**  
  - High throughput enables near-zero verification cost  
  - Mature ecosystem for compressed NFTs and on-chain attestations  
  - Strong tooling for Web2-style onboarding (e.g., Solana Mobile Stack, wallet-less auth)  

## **High-Level User Flow**
1. User signs in with email or OAuth.  
2. User submits a claim and uploads evidence.  
3. Validators review the claim, vote, and optionally stake reputation.  
4. When consensus is reached, a proof-of-skill attestation is written on-chain.  
5. User receives a badge and can share a public profile link with verified skills.  

## **Success Metrics**
- Number of verified skill attestations created  
- Number of validators participating  
- Conversion rate: claims submitted → claims verified  
- User retention (30-day return users)  
- Validator accuracy and reliability metrics  

## **Tokenomics**
**Optional utility token** (introduced post-MVP):  
- Validators earn tokens for accurate reviews (measured by alignment with consensus).  
- Users spend tokens for priority review or dispute resolution.  
- Staking required for validators to reduce fraud and encourage honest behaviour.  
**Sustainability:**  
- Token issuance tied to actual platform usage  
- No speculative emissions; tokens earned only through meaningful contribution  

## **Development Timeline (Phase-Based)**

### **Phase 1 — Foundation**
- User onboarding  
- Skill claim creation  
- Evidence storage  
- Initial validator system  

### **Phase 2 — On-Chain Attestations**
- Solana integration  
- Publishing compressed skill attestation assets  

### **Phase 3 — Public Profiles**
- Shareable verification pages  
- Searchable registry of skills  

### **Phase 4 — Quality & Scaling**
- Reputation-based validator scoring  
- First integrations with partner communities or DAOs  

## **Future Enhancements**
1. **Automated Skill Tests**  
   Optional challenge-based tests that are auto-scored and written to-chain.  
2. **DAO for Governance**  
   Community-driven control over validator standards and dispute resolution.  
3. **Marketplace Integrations**  
   Connect verified users directly to gig platforms or job boards.  
