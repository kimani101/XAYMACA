import { polygon, polygonAmoy } from "wagmi/chains";

export type ContractAddress = `0x${string}` | null;

export type XaymacaDeployment = {
  token: ContractAddress;
  staking: ContractAddress;
  governor: ContractAddress;
  timelock: ContractAddress;
};

const notDeployed: XaymacaDeployment = {
  token: null,
  staking: null,
  governor: null,
  timelock: null,
};

export const deployments: Record<number, XaymacaDeployment> = {
  [polygon.id]: { ...notDeployed },
  [polygonAmoy.id]: { ...notDeployed },
};

export function getDeployment(chainId: number): XaymacaDeployment | null {
  return deployments[chainId] ?? null;
}

export function isFeatureDeployed(
  chainId: number,
  feature: keyof XaymacaDeployment,
): boolean {
  return Boolean(getDeployment(chainId)?.[feature]);
}
