export function getDiscoveryConfig() {
  return {
    enabled: process.env.DISCOVERY_ENABLED !== "false",
    defaultLimit: 10,
    maxLimit: 50,
    provider: "mock" as const,
  };
}
