export type ConceptId = "utl" | "upap" | "wns" | "apos";

export type Concept = {
  id: ConceptId;
  acronym: string;
  name: string;
  summary: string;
  explanation: string;
  benefit: string;
};

// Content from the feature brief (sourced from the official Wire docs).
export const CONCEPTS: Concept[] = [
  {
    id: "utl",
    acronym: "UTL",
    name: "Universal Transaction Layer",
    summary: "Use assets from other chains without bridges.",
    explanation:
      "Wire's core innovation. It allows smart contracts on Wire to interact with assets on other blockchains (like Ethereum or Solana) without using vulnerable bridges. Assets stay locked on their native chain, while ownership rights are traded on Wire's fast settlement layer.",
    benefit: "Eliminates bridge hacks; assets benefit from dual consensus security.",
  },
  {
    id: "upap",
    acronym: "UPAP",
    name: "Universal Polymorphic Address Protocol",
    summary: "Use Wire with the wallet you already have.",
    explanation:
      "A protocol that lets users interact with Wire using their existing wallets (e.g., MetaMask). It deterministically derives a Wire address from an existing public key (like an Ethereum address).",
    benefit: "No need to create and fund a new wallet just to use Wire.",
  },
  {
    id: "wns",
    acronym: "WNS",
    name: "Wire Name Service",
    summary: "Escrow buckets that hold assets on their home chain.",
    explanation:
      'A set of smart contracts deployed on native chains (like Ethereum) that act as "escrow buckets." They securely hold assets while their ownership is represented on Wire.',
    benefit: "Provides the secure custody mechanism for the UTL.",
  },
  {
    id: "apos",
    acronym: "APoS",
    name: "Appointed Proof of Stake",
    summary: "Consensus with separated roles to prevent collusion.",
    explanation:
      "Wire's consensus mechanism. It separates the roles of governance (a Council), staking (Node Owners), and block production (Node Operators) to prevent centralization and collusion.",
    benefit: "Enhanced decentralization and security compared to traditional DPoS.",
  },
];
